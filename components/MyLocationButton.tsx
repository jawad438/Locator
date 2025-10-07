
import React from 'react';
import { LocationIcon } from './icons/LocationIcon';

interface MyLocationButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

const MyLocationButton: React.FC<MyLocationButtonProps> = ({ onClick, isLoading }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
        >
            {isLoading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <LocationIcon className="w-5 h-5" />
            )}
            <span className="relative top-px">{isLoading ? 'Locating...' : 'My Location'}</span>
        </button>
    );
};

export default MyLocationButton;
