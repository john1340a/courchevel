import type { GeoJSONFeatureCollection, POI } from '@/core/models/POI';

export class GeoJSONLoaderService {
  /**
   * Load GeoJSON from a file path
   */
  async loadGeoJSON(path: string): Promise<GeoJSONFeatureCollection> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
      }
      const data = (await response.json()) as GeoJSONFeatureCollection;
      this.validateGeoJSON(data);
      return data;
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      throw error;
    }
  }

  /**
   * Validate GeoJSON structure
   */
  private validateGeoJSON(data: unknown): asserts data is GeoJSONFeatureCollection {
    if (
      !data ||
      typeof data !== 'object' ||
      !('type' in data) ||
      data.type !== 'FeatureCollection' ||
      !('features' in data) ||
      !Array.isArray(data.features)
    ) {
      throw new Error('Invalid GeoJSON structure');
    }
  }

  /**
   * Convert GeoJSON features to POI objects
   */
  convertToPOIs(geojson: GeoJSONFeatureCollection): POI[] {
    return geojson.features
      .filter((feature) => feature.geometry.type === 'Point')
      .map((feature) => {
        const [lon, lat, alt = 0] = feature.geometry.coordinates;
        return {
          id: feature.properties.id,
          name: feature.properties.name,
          type: this.validatePOIType(feature.properties.type),
          coordinates: {
            lat,
            lon,
            alt: feature.properties.altitude ?? alt,
          },
          description: feature.properties.description,
          photo: feature.properties.photo,
          metadata: feature.properties,
        } satisfies POI;
      });
  }

  /**
   * Validate and normalize POI type
   */
  private validatePOIType(
    type: string
  ): 'chalet' | 'ski_station' | 'viewpoint' | 'restaurant' | 'other' {
    const validTypes = ['chalet', 'ski_station', 'viewpoint', 'restaurant'] as const;
    return validTypes.includes(type as (typeof validTypes)[number])
      ? (type as (typeof validTypes)[number])
      : 'other';
  }
}

export const geojsonLoader = new GeoJSONLoaderService();
