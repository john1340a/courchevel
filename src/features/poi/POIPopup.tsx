import { Button } from '@heroui/react';
import CabinIcon from '@mui/icons-material/Cabin';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import PublicIcon from '@mui/icons-material/Public';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TerrainIcon from '@mui/icons-material/Terrain';

import type { POI } from '@/core/models/POI';

interface POIPopupProps {
  poi: POI | null;
  isOpen: boolean;
  onClose: () => void;
}

export const POIPopup: React.FC<POIPopupProps> = ({ poi, isOpen, onClose }) => {
  if (!poi || !isOpen) return null;

  const typeColors: Record<POI['type'], string> = {
    chalet: '#f59e0b',
    ski_station: '#3b82f6',
    viewpoint: '#10b981',
    restaurant: '#ef4444',
    other: '#6b7280',
  };

  const typeLabels: Record<POI['type'], string> = {
    chalet: 'Chalet',
    ski_station: 'Station de Ski',
    viewpoint: 'Point de Vue',
    restaurant: 'Restaurant',
    other: 'Autre',
  };

  const typeIcons: Record<POI['type'], React.ReactNode> = {
    chalet: <CabinIcon fontSize="small" />,
    ski_station: <DownhillSkiingIcon fontSize="small" />,
    viewpoint: <TerrainIcon fontSize="small" />,
    restaurant: <RestaurantIcon fontSize="small" />,
    other: <PlaceIcon fontSize="small" />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Content */}
      <div
        className="backdrop-blur-xl bg-gradient-to-br from-black/60 to-black/40 border border-white/20 rounded-2xl shadow-2xl"
        style={{
          position: 'relative',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          margin: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${typeColors[poi.type]}40` }}
            >
              <span style={{ color: typeColors[poi.type] }}>{typeIcons[poi.type]}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{poi.name}</h2>
              <p className="text-sm text-white/70">{typeLabels[poi.type]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {poi.description && (
            <div className="backdrop-blur-sm bg-white/10 p-4 rounded-xl border border-white/20">
              <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                <DescriptionIcon fontSize="small" /> Description
              </h3>
              <p className="text-white/90 leading-relaxed">{poi.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="backdrop-blur-sm bg-white/10 p-4 rounded-xl border border-white/20">
              <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                <PublicIcon fontSize="small" /> Coordonnées
              </h3>
              <div className="space-y-1 text-sm text-white/90">
                <p className="font-mono flex items-center gap-1">
                  <PlaceIcon fontSize="inherit" /> {poi.coordinates.lat.toFixed(6)}°
                </p>
                <p className="font-mono flex items-center gap-1">
                  <PlaceIcon fontSize="inherit" /> {poi.coordinates.lon.toFixed(6)}°
                </p>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/10 p-4 rounded-xl border border-white/20">
              <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                <LandscapeIcon fontSize="small" /> Altitude
              </h3>
              <p className="text-2xl font-bold text-white">
                {poi.coordinates.alt.toFixed(0)} <span className="text-sm font-normal">m</span>
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/20">
            <Button
              size="md"
              variant="flat"
              color="primary"
              className="font-semibold flex-1 text-white"
              startContent={
                <span style={{ marginRight: '8px' }}>
                  <MapIcon fontSize="small" />
                </span>
              }
              onPress={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${poi.coordinates.lat},${poi.coordinates.lon}`,
                  '_blank'
                );
              }}
            >
              Google Maps
            </Button>
            <Button
              size="md"
              color="danger"
              variant="light"
              onPress={onClose}
              className="font-semibold text-white"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
