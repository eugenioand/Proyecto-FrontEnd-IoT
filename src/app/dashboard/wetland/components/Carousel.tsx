"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import CarouselItem from "./CarouselItem";

interface CarouselProps {
    items: Sensor[];
    selectedSensor: Sensor | null;
    onSelectSensor?: (sensor: Sensor) => void;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

interface Sensor {
    name: string;
    sensor_code: string;
    unity: string;
    value: number;
    max?: number;
}

const Carousel: React.FC<CarouselProps> = ({
    items,
    selectedSensor,
    onSelectSensor,
    autoPlay = false, // Por defecto desactivado
    autoPlayInterval = 3000,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(1); // Visible por defecto (mobile)
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // Calcular elementos visibles según el tamaño de la ventana
    const calculateVisibleItems = useCallback((width: number) => {
        if (width >= 1024) return 3; // Desktop
        if (width >= 640) return 2; // Tablet
        return 1; // Mobile
    }, []);

    // Manejar redimensionamiento con debounce
    useEffect(() => {
        const handleResize = () => {
            setVisibleItems(calculateVisibleItems(window.innerWidth));
        };

        const resizeObserver = () => {
            clearTimeout(autoPlayRef.current as NodeJS.Timeout);
            autoPlayRef.current = setTimeout(handleResize, 100); // Debounce
        };

        window.addEventListener("resize", resizeObserver);
        handleResize(); // Calcular al cargar

        return () => window.removeEventListener("resize", resizeObserver);
    }, [calculateVisibleItems]);

    // Calcular la transformación para el desplazamiento
    const calculateTranslateX = useMemo(() => {
        return `translateX(-${currentIndex * (100 / visibleItems)}%)`;
    }, [currentIndex, visibleItems]);

    // Función para ir al siguiente slide
    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex < items.length - visibleItems ? prevIndex + 1 : prevIndex
        );
    }, [items.length, visibleItems]);

    // Función para ir al slide anterior
    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }, []);

    // Auto-play si está activado
    useEffect(() => {
        if (autoPlay) {
            const interval = setInterval(() => {
                nextSlide();
            }, autoPlayInterval);

            return () => clearInterval(interval);
        }
    }, [autoPlay, autoPlayInterval, nextSlide]);

    return (
        <div className="relative w-full h-96 overflow-hidden">
            <div
                ref={containerRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: calculateTranslateX }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 p-2 ${
                            visibleItems === 3
                                ? "lg:w-1/3"
                                : visibleItems === 2
                                ? "sm:w-1/2"
                                : "w-full"
                        }`}
                        onClick={() => onSelectSensor && onSelectSensor(item)}
                    >
                        <CarouselItem
                            key={item.sensor_code}
                            sensor={item}
                            selectedSensor={selectedSensor === item}
                        />
                    </div>
                ))}
            </div>

            {/* Botones de navegación */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg opacity-75 hover:opacity-100 transition-opacity z-10"
                aria-label="Previous slide"
            >
                &#60;
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg opacity-75 hover:opacity-100 transition-opacity z-10"
                aria-label="Next slide"
            >
                &#62;
            </button>
        </div>
    );
};

export default Carousel;
