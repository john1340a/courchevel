import { useEffect, useState } from 'react';

import { HeroUIProvider } from '@heroui/react';
import * as Cesium from 'cesium';

import { CesiumViewer } from './components/CesiumViewer';
import type { POI } from './core/models/POI';
import { GeoLocator } from './features/geolocation/GeoLocator';
import { POILayer } from './features/poi/POILayer';
import { POIPopup } from './features/poi/POIPopup';
import './index.css';
import { geojsonLoader } from './services/geojsonLoader';

function App() {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load POIs on mount
  useEffect(() => {
    const loadPOIs = async () => {
      try {
        setIsLoading(true);
        const geojson = await geojsonLoader.loadGeoJSON('/src/assets/data/pois.geojson');
        const loadedPOIs = geojsonLoader.convertToPOIs(geojson);
        setPois(loadedPOIs);
        setError(null);
      } catch (err) {
        console.error('Failed to load POIs, using simulated data:', err);

        // Fallback: Simulate POIs if GeoJSON fails to load
        const simulatedPOIs: POI[] = [
          {
            id: 'chalet-001',
            name: 'Chalet du Mont Blanc',
            type: 'chalet',
            coordinates: { lat: 45.8326, lon: 6.8657, alt: 1850 },
            description: 'Chalet traditionnel avec vue panoramique sur le Mont Blanc.',
          },
          {
            id: 'ski-station-001',
            name: 'Chamonix Mont-Blanc',
            type: 'ski_station',
            coordinates: { lat: 45.9237, lon: 6.6339, alt: 1035 },
            description: 'Station de ski de renommée mondiale au pied du Mont Blanc.',
          },
          {
            id: 'viewpoint-001',
            name: 'Aiguille du Midi',
            type: 'viewpoint',
            coordinates: { lat: 45.9201, lon: 6.7968, alt: 3842 },
            description: "Point de vue exceptionnel à 3842m d'altitude.",
          },
          {
            id: 'restaurant-001',
            name: 'Le Refuge Alpin',
            type: 'restaurant',
            coordinates: { lat: 45.9167, lon: 6.6198, alt: 1200 },
            description: "Restaurant d'altitude proposant une cuisine savoyarde.",
          },
          {
            id: 'chalet-002',
            name: 'Chalet Les Arolles',
            type: 'chalet',
            coordinates: { lat: 45.9053, lon: 6.6544, alt: 1650 },
            description: 'Chalet moderne avec architecture traditionnelle.',
          },
        ];

        setPois(simulatedPOIs);
        setError(null); // Don't show error to user, just use simulated data
      } finally {
        setIsLoading(false);
      }
    };

    loadPOIs();
  }, []);

  const handlePOIClick = (poi: POI) => {
    setSelectedPOI(poi);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // Keep selectedPOI for a moment to allow smooth transition
    setTimeout(() => setSelectedPOI(null), 300);
  };

  return (
    <HeroUIProvider>
      <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2000,
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '8px',
              fontSize: '18px',
            }}
          >
            Chargement de la carte 3D...
          </div>
        )}

        {error && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2000,
              background: 'rgba(220, 38, 38, 0.9)',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '8px',
              fontSize: '16px',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <strong>Erreur:</strong> {error}
          </div>
        )}

        <CesiumViewer onViewerReady={setViewer} />

        <GeoLocator viewer={viewer} />

        <POILayer viewer={viewer} pois={pois} onPOIClick={handlePOIClick} />

        <POIPopup poi={selectedPOI} isOpen={isPopupOpen} onClose={handleClosePopup} />
      </div>
    </HeroUIProvider>
  );
}

export default App;
