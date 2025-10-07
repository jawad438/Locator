import React, { useEffect, useRef } from 'react';

// This tells TypeScript that 'L' is a global variable provided by the Leaflet script.
declare const L: any;

interface MapComponentProps {
    position: [number, number] | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ position }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any | null>(null);
    const markerRef = useRef<any | null>(null);

    // Effect for initializing the map
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            // Initialize map
            const map = L.map(mapContainerRef.current, {
                zoomControl: false, // We can disable the default zoom control if we want a cleaner look
                attributionControl: false // This will remove the Leaflet watermark
            }).setView([20, 0], 3); // Default view
            mapInstanceRef.current = map;
            
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Add tile layer (satellite view)
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(map);
            
            // Fix for map not rendering correctly on initial load in some cases
            setTimeout(() => {
                map.invalidateSize();
            }, 400);
        }

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    // Effect for updating map view and marker when position changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (map && position) {
            const zoomLevel = 13;
            map.setView(position, zoomLevel, {
                animate: true,
                pan: {
                    duration: 1
                }
            });

            // Remove old marker if it exists
            if (markerRef.current) {
                markerRef.current.remove();
            }

            // Add new marker with a custom animated icon
            const customIcon = L.divIcon({
                className: 'custom-pin',
                html: `<div class="relative w-8 h-8 flex items-center justify-center">
                           <div class="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                           <div class="relative w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow-lg"></div>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const newMarker = L.marker(position, { icon: customIcon }).addTo(map)
                .bindPopup('<b>You are here!</b>')
                .openPopup();
            
            markerRef.current = newMarker;
        }
    }, [position]); // This effect runs whenever 'position' changes

    return (
        <>
            {/* Custom styles for the Leaflet pop-up to match the dark theme */}
            <style>
            {`
                .leaflet-popup-content-wrapper {
                    background-color: #1f2937; /* bg-gray-800 */
                    color: #d1d5db; /* text-gray-300 */
                    border-radius: 8px;
                    border: 1px solid #374151; /* border-gray-700 */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .leaflet-popup-tip {
                    background-color: #1f2937; /* bg-gray-800 */
                }
                .leaflet-popup-content b {
                    color: #60a5fa; /* text-blue-400 */
                }
                .leaflet-container a.leaflet-popup-close-button {
                    color: #9ca3af; /* text-gray-400 */
                }
                .leaflet-container a.leaflet-popup-close-button:hover {
                    color: #f9fafb; /* text-gray-50 */
                }
            `}
            </style>
            <div ref={mapContainerRef} className="w-full h-full z-0" />
        </>
    );
};

export default MapComponent;