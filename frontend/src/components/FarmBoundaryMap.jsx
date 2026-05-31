import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * FarmBoundaryMap Component
 * Displays farm boundary with MapBox GL and handles site visit requests
 */
const FarmBoundaryMap = ({ farmData, onRequestSiteVisit }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Initialize map and draw farm boundary
  useEffect(() => {
    if (!mapContainer.current || !farmData) return;

    // Set Mapbox access token (replace with your actual token)
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

    // Initialize map centered on farm location
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [farmData.location.longitude, farmData.location.latitude],
      zoom: 15,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load before adding layers
    map.current.on('load', () => {
      // Draw farm boundary polygon
      if (farmData.boundary && farmData.boundary.coordinates) {
        map.current.addSource('farm-boundary', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: farmData.boundary,
            properties: {}
          }
        });

        // Add semi-transparent green overlay
        map.current.addLayer({
          id: 'farm-boundary-fill',
          type: 'fill',
          source: 'farm-boundary',
          paint: {
            'fill-color': '#22c55e',
            'fill-opacity': 0.3,
            'fill-outline-color': '#16a34a'
          }
        });

        // Add boundary outline
        map.current.addLayer({
          id: 'farm-boundary-outline',
          type: 'line',
          source: 'farm-boundary',
          paint: {
            'line-color': '#16a34a',
            'line-width': 3
          }
        });
      }

      // Add farmhouse marker
      const markerElement = document.createElement('div');
      markerElement.className = 'w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg cursor-pointer';

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([farmData.location.longitude, farmData.location.latitude])
        .addTo(map.current);

      // Create popup with farm details
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-4 bg-white rounded shadow-lg">
          <h3 class="font-bold text-lg text-gray-800">${farmData.title}</h3>
          <p class="text-gray-600 text-sm mt-2">📏 Acreage: ${farmData.acreage} acres</p>
          <p class="text-gray-600 text-sm">💧 Water: ${farmData.waterSource}</p>
          <button 
            onclick="window.requestSiteVisit('${farmData.id}')"
            class="mt-3 w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
          >
            Request Site Visit
          </button>
        </div>
      `);

      marker.setPopup(popup).togglePopup();

      // Make requestSiteVisit globally available
      window.requestSiteVisit = (farmId) => {
        if (onRequestSiteVisit) {
          onRequestSiteVisit(farmId);
        }
        popup.remove();
      };
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [farmData, onRequestSiteVisit]);

  return (
    <div className="space-y-4">
      <div 
        ref={mapContainer} 
        className="w-full h-96 md:h-[600px] rounded-lg shadow-lg overflow-hidden"
      />
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-gray-700">
          💡 <strong>Tip:</strong> Click on the farm marker to view details and request a site visit. 
          Use the satellite view toggle to inspect farm vegetation from above.
        </p>
      </div>
    </div>
  );
};

export default FarmBoundaryMap;
