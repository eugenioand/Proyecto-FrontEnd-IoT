import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngBounds } from "leaflet";
import Image from "next/image";

interface MarkerItem {
    name: string;
    // coordinates: [number, number];
    latitude: number;
    longitude: number;
    type?: "node" | "sensor" | "generic"; // Nuevos tipos
    details?: Record<string, string | number>; // Información adicional para el popup
}

interface MapProps {
    items: MarkerItem[]; // Lista de elementos a mostrar
}

const AutoZoom = ({ bounds }: { bounds: LatLngBounds }) => {
    const map = useMap();
    map.fitBounds(bounds, { padding: [50, 50] });
    return null;
};

const Map: React.FC<MapProps> = ({ items }) => {
    // Niveles de zoom personalizados por tipo
    const zoomLevels: Record<string, number> = {
        node: 15,
        sensor: 17,
        default: 14,
    };

    // Definición de íconos personalizados
    const icons: Record<string, Icon> = {
        node: new Icon({
            iconUrl: "/node-icon.svg",
            iconSize: [30, 50],
            iconAnchor: [15, 50],
            popupAnchor: [0, -40],
        }),
        sensor: new Icon({
            iconUrl: "/sensor-icon.svg",
            iconSize: [20, 30],
            iconAnchor: [10, 30],
            popupAnchor: [0, -20],
        }),
        generic: new Icon({
            iconUrl: "/generic-icon.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        }),
        default: new Icon({
            iconUrl: "/default-icon.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        }),
    };

    // Calcular límites iniciales para el autozoom
    const bounds = new LatLngBounds(items.map((item) => [item.latitude, item.longitude]));

    return (
        <MapContainer scrollWheelZoom={true} className="h-full w-full" zoomControl={false} attributionControl={false}>
            <TileLayer
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Ajustar zoom inicial */}
            <AutoZoom bounds={bounds} />

            {/* Agregar marcadores dinámicos */}
            {items.map((item, index) => (
                <Marker
                    key={index}
                    position={[item.latitude, item.longitude]}
                    icon={icons[item.type || "default"]}
                    eventHandlers={{
                        click: (e) => {
                            const map = e.target._map; // Obtener el mapa desde el marcador
                            map.setView([item.latitude, item.longitude], zoomLevels[item.type || "default"], { animate: true }); // Ajustar el zoom
                        },
                    }}
                >
                    <Popup>
                        <div className="text-center p-2">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            {item.type && (
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Image
                                        src={`/${item.type}-icon.svg`}
                                        alt={`${item.type} icon`}
                                        width={20}
                                        height={20}
                                        className="w-5 h-5"
                                    />
                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </p>
                            )}
                            {item.details &&
                                Object.entries(item.details).map(([key, value]) => (
                                    <p key={key} className="text-sm text-gray-600">
                                        {key}: {value}
                                    </p>
                                ))}
                        </div>
                    </Popup>
                </Marker>
            ))}
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default Map;
