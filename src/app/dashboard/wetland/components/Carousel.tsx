"use client";

import React, { useState, useEffect, useRef } from "react";

interface CarouselProps {
    items: string[]; // Array de URLs o contenido que se quiera mostrar
    autoPlay?: boolean; // Si se desea autoplay (por defecto es true)
    autoPlayInterval?: number; // Intervalo del autoplay en ms (por defecto 3000ms)
}

const Carousel: React.FC<CarouselProps> = ({
    items,
    autoPlay = true,
    autoPlayInterval = 3000,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref para el intervalo de autoplay
    const [isHovered, setIsHovered] = useState(false); // Para controlar el estado de hover

    // Cambiar al siguiente slide
    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, [items.length]);

    // Cambiar al slide anterior
    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + items.length) % items.length
        );
    };

    // Configurar autoplay
    useEffect(() => {
        if (autoPlay && !isHovered) {
            intervalRef.current = setInterval(nextSlide, autoPlayInterval);
        }

        // Limpiar el intervalo cuando el componente se desmonta o cuando el autoplay se detiene
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoPlay, isHovered, autoPlayInterval, nextSlide]);

    // Manejar el hover para pausar el autoplay
    const handleMouseEnter = () => {
        setIsHovered(true);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className="relative w-full max-w-4xl mx-auto overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Contenedor de las imágenes o items */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {items.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-full relative">
                        {/* <img
                            src={item}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg shadow-lg"
                        /> */}
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>

            {/* Botones de navegación */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg opacity-75 hover:opacity-100 transition-opacity"
                aria-label="Previous slide"
            >
                &#60;
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg opacity-75 hover:opacity-100 transition-opacity"
                aria-label="Next slide"
            >
                &#62;
            </button>

            {/* Indicadores de slide */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-white" : "bg-gray-500"
                            } transition-colors`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Texto de información del slide actual */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold">
                <p>
                    Slide {currentIndex + 1} of {items.length}
                </p>
            </div>
        </div>
    );
};

export default Carousel;
