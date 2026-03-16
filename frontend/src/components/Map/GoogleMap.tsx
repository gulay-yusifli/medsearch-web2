import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface MarkerInfo {
  position: { lat: number; lng: number };
  title?: string;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  markers?: MarkerInfo[];
  height?: string;
  zoom?: number;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  center,
  markers = [],
  height = '400px',
  zoom = 15,
}) => {
  const [selectedMarker, setSelectedMarker] = React.useState<MarkerInfo | null>(null);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ height }} className="bg-gray-100 flex flex-col items-center justify-center text-gray-500 gap-2">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium">Xəritə əlçatmaz</p>
        <p className="text-xs text-gray-400">Google Maps API açarı konfiqurasiya edilməyib</p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height }}
        center={center}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {selectedMarker && selectedMarker.title && (
          <InfoWindow position={selectedMarker.position} onCloseClick={() => setSelectedMarker(null)}>
            <div className="p-1">
              <p className="font-medium text-sm">{selectedMarker.title}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
