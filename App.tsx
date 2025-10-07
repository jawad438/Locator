import React, { useState, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import MyLocationButton from './components/MyLocationButton';

type LocationData = {
    coords: [number, number];
    accuracy: number;
};

const App: React.FC = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLocateMe = useCallback(() => {
        setLoading(true);
        setError(null);
        setLocation(null); // Clear previous location data on a new request

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                setLocation({ coords: [latitude, longitude], accuracy });
                setLoading(false);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("You denied the request for Geolocation.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information is unavailable. This can happen indoors or in areas with poor satellite signal.");
                        break;
                    case err.TIMEOUT:
                        setError("The request to get user location timed out. Please try again in an open area.");
                        break;
                    default:
                        setError("An unknown error occurred.");
                        break;
                }
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000, // Increased timeout to 20 seconds for a better GPS lock
                maximumAge: 0,
            }
        );
    }, []);

    return (
        <div className="relative h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <MapComponent position={location ? location.coords : null} />
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center p-4 sm:p-6 gap-4 pointer-events-none">
                <header 
                    className="text-center pointer-events-auto"
                    style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)' }}
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                        Satellite Locator
                    </h1>
                    <p className="text-gray-300 mt-2 text-lg">Find your place on the map.</p>
                </header>

                <main className="flex flex-col items-center gap-4 pointer-events-auto text-center">
                    <MyLocationButton onClick={handleLocateMe} isLoading={loading} />
                    {error && <p className="text-red-400 bg-red-900/50 px-4 py-2 rounded-md shadow-lg max-w-sm">{error}</p>}
                    {location && !loading && !error && (
                        <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg pointer-events-auto">
                            <p className="text-teal-300">
                                Location found with an accuracy of <span className="font-bold">{Math.round(location.accuracy)}</span> meters.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                (Accuracy may vary based on your device and environment)
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;