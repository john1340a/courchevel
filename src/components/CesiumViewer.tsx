import { useEffect, useRef } from 'react';

import * as Cesium from 'cesium';

interface CesiumViewerProps {
  onViewerReady?: (viewer: Cesium.Viewer) => void;
  children?: React.ReactNode;
}

export const CesiumViewer: React.FC<CesiumViewerProps> = ({ onViewerReady, children }) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!cesiumContainerRef.current || viewerRef.current) return;

    let keyboardCleanup: (() => void) | null = null;

    const initViewer = async () => {
      if (!cesiumContainerRef.current) return;

      // Initialize Cesium Viewer with high-resolution basemap
      const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
        // Terrain provider - using ArcGIS World Elevation 3D (public endpoint)
        terrain: new Cesium.Terrain(
          Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(
            'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
          )
        ),

        // Imagery provider - using OpenStreetMap to avoid Ion token requirement
        baseLayerPicker: false,

        // UI configuration
        timeline: false,
        animation: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: true,
        infoBox: true,
        sceneModePicker: false,
        selectionIndicator: true,
        navigationHelpButton: true,

        // Scene configuration
        scene3DOnly: false,
        shadows: false, // Performance: Disable shadows
        shouldAnimate: false,
      });

      // Set imagery provider - Esri World Imagery (Satellite)
      viewer.imageryLayers.removeAll();
      const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      );
      viewer.imageryLayers.addImageryProvider(imageryProvider);

      // Disable lighting for performance
      viewer.scene.globe.enableLighting = false;

      // Set time to noon (12:00 PM) for daylight visibility without dynamic lighting
      const currentDate = new Date();
      viewer.clock.currentTime = Cesium.JulianDate.fromDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          12, // 12:00 PM (noon)
          0,
          0
        )
      );
      viewer.clock.shouldAnimate = false;

      // Configure atmosphere and fog - Disabled for performance
      viewer.scene.globe.showGroundAtmosphere = false;
      viewer.scene.fog.enabled = false;
      viewer.scene.fog.density = 0.0001;

      // Set default camera position (Courchevel)
      const courchevelView = {
        destination: Cesium.Cartesian3.fromDegrees(6.6347, 45.4164, 15000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0.0,
        },
      };

      viewer.camera.setView(courchevelView);

      // Configure Home button to return to Courchevel
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e: {
        cancel: boolean;
      }) {
        e.cancel = true;
        viewer.camera.flyTo(courchevelView);
      });

      // Enable keyboard navigation
      const canvas = viewer.scene.canvas;
      canvas.setAttribute('tabindex', '0');
      canvas.focus();

      // Add keyboard controls
      const handleKeyDown = (e: KeyboardEvent) => {
        const camera = viewer.camera;
        const moveAmount = 1000; // meters
        const rotateAmount = Cesium.Math.toRadians(1.0); // degrees

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            camera.moveForward(moveAmount);
            break;
          case 'ArrowDown':
            e.preventDefault();
            camera.moveBackward(moveAmount);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            camera.moveLeft(moveAmount);
            break;
          case 'ArrowRight':
            e.preventDefault();
            camera.moveRight(moveAmount);
            break;
          case 'w':
          case 'W':
            e.preventDefault();
            camera.moveForward(moveAmount);
            break;
          case 's':
          case 'S':
            e.preventDefault();
            camera.moveBackward(moveAmount);
            break;
          case 'a':
          case 'A':
            e.preventDefault();
            camera.moveLeft(moveAmount);
            break;
          case 'd':
          case 'D':
            e.preventDefault();
            camera.moveRight(moveAmount);
            break;
          case 'q':
          case 'Q':
            e.preventDefault();
            camera.twistLeft(rotateAmount);
            break;
          case 'e':
          case 'E':
            e.preventDefault();
            camera.twistRight(rotateAmount);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Store cleanup function for keyboard listener
      keyboardCleanup = () => {
        document.removeEventListener('keydown', handleKeyDown);
      };

      viewerRef.current = viewer;

      // Notify parent component
      if (onViewerReady) {
        onViewerReady(viewer);
      }
    };

    initViewer();

    // Cleanup
    return () => {
      if (keyboardCleanup) {
        keyboardCleanup();
      }
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [onViewerReady]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={cesiumContainerRef} style={{ width: '100%', height: '100%' }} />
      {children}
    </div>
  );
};
