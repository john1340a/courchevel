import { useEffect, useRef, useState } from 'react';

import { Button } from '@heroui/react';
import ErrorIcon from '@mui/icons-material/Error';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import * as Cesium from 'cesium';

import type { UserPosition } from './geo.service';
import { geolocationService } from './geo.service';

interface GeoLocatorProps {
  viewer: Cesium.Viewer | null;
}

export const GeoLocator: React.FC<GeoLocatorProps> = ({ viewer }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const userEntityRef = useRef<Cesium.Entity | null>(null);

  const updateUserPosition = (position: UserPosition, viewerInstance: Cesium.Viewer) => {
    const cesiumPosition = Cesium.Cartesian3.fromDegrees(
      position.lon,
      position.lat,
      position.altitude ?? 0
    );

    // Create or update user entity
    if (!userEntityRef.current) {
      userEntityRef.current = viewerInstance.entities.add({
        id: 'user-position',
        name: 'Ma Position',
        position: cesiumPosition,
        point: {
          pixelSize: 18,
          color: Cesium.Color.fromCssColorString('#3B82F6'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 4,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        ellipse: {
          semiMinorAxis: Math.min(position.accuracy, 100),
          semiMajorAxis: Math.min(position.accuracy, 100),
          material: Cesium.Color.fromCssColorString('#3B82F6').withAlpha(0.15),
          outlineColor: Cesium.Color.fromCssColorString('#3B82F6').withAlpha(0.4),
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: '📍 Vous êtes ici',
          font: 'bold 15px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.fromCssColorString('#3B82F6'),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -30),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.2, 50000, 0.8),
        },
      });

      // Fly to user position on first location
      viewerInstance.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(position.lon, position.lat, 5000),
        duration: 2,
      });
    } else {
      // Update existing entity position
      userEntityRef.current.position = new Cesium.ConstantPositionProperty(cesiumPosition);
      if (userEntityRef.current.ellipse) {
        const clampedAccuracy = Math.min(position.accuracy, 100);
        userEntityRef.current.ellipse.semiMinorAxis = new Cesium.ConstantProperty(clampedAccuracy);
        userEntityRef.current.ellipse.semiMajorAxis = new Cesium.ConstantProperty(clampedAccuracy);
      }
    }
  };

  useEffect(() => {
    if (!viewer || !isTracking) {
      // Cleanup when tracking stops
      if (userEntityRef.current && viewer) {
        viewer.entities.remove(userEntityRef.current);
        userEntityRef.current = null;
      }
      geolocationService.clearWatch();
      return;
    }

    // Start watching position
    geolocationService.watchPosition(
      (position: UserPosition) => {
        updateUserPosition(position, viewer);
        setHasError(false);
      },
      (error: Error) => {
        setHasError(true);
        setErrorMessage(error.message);
        setIsTracking(false);
      }
    );

    return () => {
      geolocationService.clearWatch();
      if (userEntityRef.current && viewer) {
        viewer.entities.remove(userEntityRef.current);
        userEntityRef.current = null;
      }
    };
  }, [viewer, isTracking]);

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
    setHasError(false);
    setErrorMessage('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        pointerEvents: 'auto',
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="backdrop-blur-md bg-white/20 dark:bg-black/30 rounded-2xl shadow-2xl border border-white/30 p-2">
          <Button
            color={isTracking ? 'success' : 'primary'}
            variant={isTracking ? 'shadow' : 'flat'}
            onPress={handleToggleTracking}
            size="md"
            className="font-semibold"
            startContent={
              <span style={{ marginRight: '8px' }}>
                {isTracking ? (
                  <GpsFixedIcon fontSize="small" />
                ) : (
                  <MyLocationIcon fontSize="small" />
                )}
              </span>
            }
          >
            {isTracking ? 'Actif' : 'Me localiser'}
          </Button>
        </div>

        {hasError && (
          <div className="backdrop-blur-md bg-red-500/90 text-white px-4 py-3 rounded-2xl shadow-2xl border border-red-400/50 max-w-xs">
            <p className="font-bold text-sm flex items-center gap-1">
              <ErrorIcon fontSize="small" /> Erreur
            </p>
            <p className="text-xs mt-1 opacity-90">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
