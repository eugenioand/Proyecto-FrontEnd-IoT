"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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
    autoPlay = false, // Apagado para pruebas manuales
    autoPlayInterval = 3000,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const itemPerView = (windowWidth: number) => {
        if (windowWidth >= 1024) return 3; // Desktop
        if (windowWidth >= 640) return 2; // Tablet
        return 1; // Mobile
    };

    const [visibleItems, setVisibleItems] = useState(itemPerView(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            setVisibleItems(itemPerView(window.innerWidth));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const calculateTranslateX = () => {
        return `translateX(-${currentIndex * (100 / visibleItems)}%)`;
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex < items.length - visibleItems ? prevIndex + 1 : prevIndex
        );
    }, [items.length, visibleItems]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }, []);

    return (
        <div className="relative w-full h-72 overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: calculateTranslateX(), // Simple desplazamiento
                }}
                ref={containerRef}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 p-2 ${visibleItems === 3
                                ? "lg:w-1/3"
                                : visibleItems === 2
                                    ? "sm:w-1/2"
                                    : "w-full"
                            }
                        `}
                        onClick={() => onSelectSensor(item)}
                    >
                        <CarouselItem sensor={item} selectedSensor={selectedSensor === item} />
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
