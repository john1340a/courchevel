export interface POI {
  id: string;
  name: string;
  type: 'chalet' | 'ski_station' | 'viewpoint' | 'restaurant' | 'other';
  coordinates: {
    lat: number;
    lon: number;
    alt: number;
  };
  description?: string;
  photo?: string;
  metadata?: Record<string, unknown>;
}

export interface POIProperties extends Record<string, unknown> {
  id: string;
  name: string;
  type: string;
  description?: string;
  photo?: string;
  altitude?: number;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number, number?];
  };
  properties: POIProperties;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
