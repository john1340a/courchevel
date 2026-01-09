export interface UserPosition {
  lat: number;
  lon: number;
  altitude: number | null;
  accuracy: number;
  heading: number | null;
  speed: number | null;
}

export class GeolocationService {
  private watchId: number | null = null;

  /**
   * Get current position once
   */
  async getCurrentPosition(): Promise<UserPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(this.mapPosition(position));
        },
        (error) => {
          reject(this.mapError(error));
        },
        {
          enableHighAccuracy: false, // Performance: Faster location lock (WiFi/Cell) instead of slow GPS
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Watch position changes
   */
  watchPosition(
    onSuccess: (position: UserPosition) => void,
    onError?: (error: Error) => void
  ): void {
    if (!navigator.geolocation) {
      onError?.(new Error('Geolocation is not supported by this browser'));
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        onSuccess(this.mapPosition(position));
      },
      (error) => {
        onError?.(this.mapError(error));
      },
      {
        enableHighAccuracy: false, // Performance: Faster location
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  }

  /**
   * Stop watching position
   */
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Map browser position to our format
   */
  private mapPosition(position: GeolocationPosition): UserPosition {
    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      altitude: position.coords.altitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
    };
  }

  /**
   * Map browser error to readable error
   */
  private mapError(error: GeolocationPositionError): Error {
    const messages: Record<number, string> = {
      [error.PERMISSION_DENIED]: 'User denied geolocation permission',
      [error.POSITION_UNAVAILABLE]: 'Position information is unavailable',
      [error.TIMEOUT]: 'Geolocation request timed out',
    };

    return new Error(messages[error.code] || 'Unknown geolocation error');
  }
}

export const geolocationService = new GeolocationService();
