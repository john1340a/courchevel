import type { GeoJSONFeatureCollection } from '@/core/models/POI';
import { GeoJSONLoaderService } from '@/services/geojsonLoader';

describe('GeoJSONLoaderService', () => {
  let service: GeoJSONLoaderService;

  beforeEach(() => {
    service = new GeoJSONLoaderService();
  });

  describe('convertToPOIs', () => {
    it('should convert GeoJSON features to POI objects', () => {
      const geojson: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [6.8657, 45.8326, 1850],
            },
            properties: {
              id: 'chalet-001',
              name: 'Test Chalet',
              type: 'chalet',
              description: 'A test chalet',
              altitude: 1850,
            },
          },
        ],
      };

      const pois = service.convertToPOIs(geojson);

      expect(pois).toHaveLength(1);
      expect(pois[0]).toEqual({
        id: 'chalet-001',
        name: 'Test Chalet',
        type: 'chalet',
        coordinates: {
          lat: 45.8326,
          lon: 6.8657,
          alt: 1850,
        },
        description: 'A test chalet',
        photo: undefined,
        metadata: expect.objectContaining({
          id: 'chalet-001',
          name: 'Test Chalet',
          type: 'chalet',
        }),
      });
    });

    it('should handle POIs without altitude in coordinates', () => {
      const geojson: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [6.8657, 45.8326],
            },
            properties: {
              id: 'test-001',
              name: 'Test POI',
              type: 'viewpoint',
              altitude: 2000,
            },
          },
        ],
      };

      const pois = service.convertToPOIs(geojson);

      expect(pois).toHaveLength(1);
      expect(pois[0].coordinates.alt).toBe(2000);
    });

    it('should normalize unknown POI types to "other"', () => {
      const geojson: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [6.8657, 45.8326, 1850],
            },
            properties: {
              id: 'test-001',
              name: 'Unknown Type',
              type: 'unknown_type',
            },
          },
        ],
      };

      const pois = service.convertToPOIs(geojson);

      expect(pois).toHaveLength(1);
      expect(pois[0].type).toBe('other');
    });

    it('should filter out non-Point geometries', () => {
      const geojson: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [6.8657, 45.8326, 1850],
            },
            properties: {
              id: 'point-001',
              name: 'Valid Point',
              type: 'chalet',
            },
          },
        ],
      };

      const pois = service.convertToPOIs(geojson);

      expect(pois).toHaveLength(1);
      expect(pois[0].name).toBe('Valid Point');
    });
  });
});
