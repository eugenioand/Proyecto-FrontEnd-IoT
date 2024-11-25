import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngBounds } from "leaflet";
import { useSelection } from "@/context/SelectionContext";
import { useEffect, useState } from "react";

interface MarkerItem {
    id: number | string;
    name: string;
    latitude: number;
    longitude: number;
    code?: string;
    type?: "node" | "sensor" | "generic";
    details?: Record<string, string | number>;
}

interface MapProps {
    items: MarkerItem[];
}

const AutoZoom = ({ bounds }: { bounds: LatLngBounds }) => {
    const map = useMap();
    map.fitBounds(bounds, { padding: [50, 50] });
    return null;
};

const eye = <i className="fa fa-eye" aria-hidden="true" />;
const eyeSlash = <i className="fa fa-eye-slash" aria-hidden="true" />;

const Map: React.FC<MapProps> = ({ items }) => {
    const { selectedItem, setSelectedItem } = useSelection();
    const [selectedMarker, setSelectedMarker] = useState<MarkerItem | null>(null);
    
    useEffect(() => {
        if (selectedItem) {
            const marker = items.find(item => item.id === selectedItem.id && item.type === selectedItem.type);
            setSelectedMarker(marker || null);
            console.log("################### Item seleccionado", selectedItem);
        } else {
            console.log("No hay item seleccionado", selectedItem);
            setSelectedMarker(null);
        }
    }, [selectedItem, items]);

    const isSelected = (item: MarkerItem) =>
        selectedItem && selectedItem.id === item.id && selectedItem.type === item.type;

    const toggle = (item: MarkerItem) => {
        if (isSelected(item)) {
            setSelectedItem(null);
        } else {
            setSelectedItem({ id: item.id, type: item.type || "generic" });
        }
    };

    const zoomLevels: Record<string, number> = {
        node: 17,
        sensor: 18,
        default: 14,
    };

    const icons: Record<string, Icon> = {
        node: new Icon({
            iconUrl: "/node-icon.svg",
            iconSize: [30, 50],
            // iconAnchor: [15, 50],
            // popupAnchor: [0, -40],
        }),
        sensor: new Icon({
            iconUrl: "/sensor-icon.svg",
            iconSize: [20, 30],
            iconAnchor: [10, 29],
            // popupAnchor: [0, -20],
        }),
        generic: new Icon({
            iconUrl: "/generic-icon.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        PH: new Icon({
            iconUrl: "/assets/science.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        HUM: new Icon({
            iconUrl: "/assets/water_drop.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        OD: new Icon({
            iconUrl: "/assets/water.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        TURB: new Icon({
            iconUrl: "/assets/waves.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        TEMP: new Icon({
            iconUrl: "/assets/thermostat.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        CAUD_EN: new Icon({
            iconUrl: "/assets/arrow_forward.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        CAUD_SAL: new Icon({
            iconUrl: "/assets/arrow_back.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
        default: new Icon({
            iconUrl: "/default-icon.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            // popupAnchor: [1, -34],
        }),
    };

    const bounds = new LatLngBounds(items.map((item) => [item.latitude, item.longitude]));

    return (
        <MapContainer
            scrollWheelZoom={true}
            className="h-full w-full"
            zoomControl={false}
            attributionControl={false}
            style={{ zIndex: 1 }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <AutoZoom bounds={bounds} />

            {items.map((item, index) => (
                <Marker
                    key={index}
                    position={[item.latitude, item.longitude]}
                    icon={icons[item.type == "sensor" ? item.code : item.type || "default"]}
                    eventHandlers={{
                        click: (e) => {
                            const map = e.target._map;
                            const currentZoom = map.getZoom();
                            const targetZoom = zoomLevels[item.type || "default"];
                            console.log("Zoom actual:", currentZoom, "Zoom objetivo:", targetZoom);
                            // if (currentZoom < targetZoom) {
                            //     map.setView([item.latitude, item.longitude], targetZoom, { animate: true });
                            // };
                            
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
                                ))}
                        </p>
                        <button
                            className="popup-inner__button"
                            onClick={() => {
                                toggle(item);
                            }}
                        >
                            <span>{selectedMarker ? eyeSlash : eye}</span>
                            {selectedMarker ? "Deseleccionar" : "Seleccionar"}
                        </button>
                    </Popup>
                </Marker>
            ))}
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default Map;