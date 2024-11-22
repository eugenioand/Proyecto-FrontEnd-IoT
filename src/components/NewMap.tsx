import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngBounds } from "leaflet";
import Image from "next/image";

interface MarkerItem {
    id: number | string;
    name: string;
    latitude: number;
    longitude: number;
    type?: "node" | "sensor" | "generic";
    details?: Record<string, string | number>;
}

interface MapProps {
    items: MarkerItem[];
    onSelectItem: (id: number | string) => void;
}

const AutoZoom = ({ bounds }: { bounds: LatLngBounds }) => {
    const map = useMap();
    map.fitBounds(bounds, { padding: [50, 50] });
    return null;
};

const eye = <i className="fa fa-eye" aria-hidden="true"/>
const eyeSlash = <i className="fa fa-eye-slash" aria-hidden="true"/>


const Map: React.FC<MapProps> = ({ items, onSelectItem }) => {
    const zoomLevels: Record<string, number> = {
        node: 15,
        sensor: 17,
        default: 14,
    };

    const icons: Record<string, Icon> = {
        node: new Icon({
            iconUrl: "/node-icon.svg",
            iconSize: [30, 50],
            iconAnchor: [15, 50],
            // popupAnchor: [0, -40],
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

    const bounds = new LatLngBounds(items.map((item) => [item.latitude, item.longitude]));

    return (
        <MapContainer
            scrollWheelZoom={true}
            className="h-full w-full"
            zoomControl={false}
            attributionControl={false}
            style={{ zIndex: 1}}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <AutoZoom bounds={bounds} />

            {items.map((item, index) => (
                <Marker
                    key={index}
                    position={[item.latitude, item.longitude]}
                    icon={icons[item.type || "default"]}
                    eventHandlers={{
                        click: (e) => {
                            const map = e.target._map;
                            map.setView(
                                [item.latitude, item.longitude],
                                zoomLevels[item.type || "default"],
                                { animate: true }
                            );
                        },
                        popupopen: (e) => {
                            const map = e.target._map;
                            const popup = e.popup;
                            const popupHeight = popup.getElement()?.offsetHeight || 0;
                            const mapSize = map.getSize();
                            const popupPosition = map.latLngToLayerPoint(popup.getLatLng());
                            const offset = popupPosition.y - popupHeight / 2;

                            if (offset < 0) {
                                map.panBy([0, offset - 20]); // Ajustar el mapa para hacer visible el popup
                            }
                        },
                    }}
                >
                    <Popup>
                        <div className="popup-inner">
                            <h2 className="popup-inner__title">{item.name}</h2>
                        </div>
                        <p className="popup-inner__description">
                            {item.details &&
                                Object.entries(item.details).map(([key, value]) => (
                                    <div key={key} className="text-sm text-gray-600">
                                        <span className="font-medium">{key}:</span> {value}
                                    </div>
                                ))
                            }
                        </p>
                        <button className="popup-inner__button" onClick={() => onSelectItem(item.id)}>
                            <span>{eye}</span> Ver
                        </button>
                        {/* <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h3 className="font-semibold text-xl mb-2">{item.name}</h3>
                            <div className="flex items-center gap-2">
                                <Image
                                    src={`/${item.type}-icon.svg`}
                                    alt={`${item.type} icon`}
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                                <span className="text-gray-500 capitalize">{item.type}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {item.details &&
                                    Object.entries(item.details).map(([key, value]) => (
                                        <div key={key} className="text-sm text-gray-600">
                                            <span className="font-medium">{key}:</span> {value}
                                        </div>
                                    ))}
                            </div>
                        </div> */}
                    </Popup>
                </Marker>
            ))}
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default Map;
