"use client";

import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center">
                {/* Spinner with blue rotating part and gray background */}
                <div
                    className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full"
                    style={{ borderTopColor: "#1d4ed8" }} // Apply blue color to the top part
                    role="status"
                >
                    <span className="sr-only">Cargando...</span>
                </div>
                <p className="mt-4 text-lg text-gray-700">Cargando...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
