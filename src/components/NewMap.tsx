import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

interface MapProps {
    center: [number, number];
    zoom: number;
}

const defaultPosition = [51.505, -0.09];

export default function Map({ center, zoom }: MapProps) {
    center = center || defaultPosition;
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}

