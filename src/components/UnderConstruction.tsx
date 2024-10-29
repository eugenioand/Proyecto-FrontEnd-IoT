import React from "react";

interface UnderConstructionProps {
    sectionName: string;
}

const UnderConstruction = ({ sectionName }: UnderConstructionProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">¡En Construcción!</h1>
            <p className="text-lg text-gray-600">Estamos trabajando en la sección de {sectionName}. ¡Pronto estará disponible!</p>
            <div className="mt-8">
                <svg
                    className="w-16 h-16 text-yellow-500 animate-bounce"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default UnderConstruction;