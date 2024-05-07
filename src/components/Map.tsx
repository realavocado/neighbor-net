import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon path problem
const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

type MapProps = {
    latitude: number;
    longitude: number;
};

const Map = ({ latitude, longitude }: MapProps) => {
        // get map instance through useRef
        const mapRef = useRef<L.Map | null>(null);

        useEffect(() => {
            // Side effects after component initialization: You can set or operate the map here
            if (mapRef.current) {
                const map = mapRef.current;
                // Perform necessary map settings or actions
                // For example: Set the map view to specific coordinates
                map.setView([latitude, longitude], 13);
            }
    
            // Clean up when component is uninstalled
            return () => {
                if (mapRef.current) {
                    mapRef.current.remove();  // Remove map instance
                }
            };
        }, [latitude, longitude]);
    
    return (
        <MapContainer
            key={`${latitude}-${longitude}`}
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "150px", width: "100%" }}
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]}>
                <Popup>
                    {`Location: ${latitude}, ${longitude}`}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
