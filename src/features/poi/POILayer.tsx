import { useEffect, useRef } from 'react';

import * as Cesium from 'cesium';

import type { POI } from '@/core/models/POI';

interface POILayerProps {
  viewer: Cesium.Viewer | null;
  pois: POI[];
  onPOIClick?: (poi: POI) => void;
}

export const POILayer: React.FC<POILayerProps> = ({ viewer, pois, onPOIClick }) => {
  const entitiesRef = useRef<Cesium.Entity[]>([]);

  useEffect(() => {
    if (!viewer) return;

    // Remove existing entities
    entitiesRef.current.forEach((entity) => {
      viewer.entities.remove(entity);
    });
    entitiesRef.current = [];

    if (pois.length === 0) {
      return;
    }

    // Create entities for each POI
    const newEntities = pois.map((poi) => {
      const entity = viewer.entities.add({
        id: poi.id,
        name: poi.name,
        position: Cesium.Cartesian3.fromDegrees(
          poi.coordinates.lon,
          poi.coordinates.lat,
          poi.coordinates.alt
        ),
        billboard: {
          image: getPOIIcon(poi.type),
          scale: 2.0,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          scaleByDistance: new Cesium.NearFarScalar(1000, 2.5, 50000, 1.0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: poi.name,
          font: '16px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -50),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.2, 50000, 0.8),
        },
        properties: {
          poi,
        },
      });

      return entity;
    });

    entitiesRef.current = newEntities;

    // Handle click events
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const pickedObject = viewer.scene.pick(click.position);

      if (
        Cesium.defined(pickedObject) &&
        Cesium.defined(pickedObject.id) &&
        Cesium.defined(pickedObject.id.properties) &&
        Cesium.defined(pickedObject.id.properties.poi)
      ) {
        const clickedPOI = pickedObject.id.properties.poi.getValue(Cesium.JulianDate.now()) as POI;
        if (onPOIClick) {
          onPOIClick(clickedPOI);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Cleanup
    return () => {
      handler.destroy();
      entitiesRef.current.forEach((entity) => {
        viewer.entities.remove(entity);
      });
      entitiesRef.current = [];
    };
  }, [viewer, pois, onPOIClick]);

  return null;
};

/**
 * Get icon URL based on POI type
 */
function getPOIIcon(type: POI['type']): string {
  const iconMap: Record<POI['type'], string> = {
    chalet: createPinIcon('#8B4513'),
    ski_station: createPinIcon('#0066CC'),
    viewpoint: createPinIcon('#228B22'),
    restaurant: createPinIcon('#FF6347'),
    other: createPinIcon('#808080'),
  };

  return iconMap[type];
}

/**
 * Create a simple colored pin icon using canvas
 */
function createPinIcon(color: string): string {
  const canvas = document.createElement('canvas');
  const size = 40;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Draw pin shape
  ctx.fillStyle = color;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;

  // Pin body
  ctx.beginPath();
  ctx.arc(size / 2, size / 3, size / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pin point
  ctx.beginPath();
  ctx.moveTo(size / 2, size / 3 + size / 4);
  ctx.lineTo(size / 2 - 5, size - 5);
  ctx.lineTo(size / 2 + 5, size - 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  return canvas.toDataURL();
}
