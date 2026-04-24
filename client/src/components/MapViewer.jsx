import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const southWest = L.latLng(8.0, 102.0);
const northEast = L.latLng(24.0, 110.0);
const maxBounds = L.latLngBounds(southWest, northEast);

function FocusSelected({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo([selected.latitude, selected.longitude], 12, { duration: 1.2 });
    }
  }, [selected, map]);

  return null;
}

export default function MapViewer({ heritages, selected, onSelect }) {
  return (
    <div className="absolute inset-0 w-screen h-screen">
      <MapContainer
        center={[16.0, 106.0]}
        zoom={6}
        minZoom={5}
        maxZoom={18}
        maxBounds={maxBounds}
        maxBoundsViscosity={1}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FocusSelected selected={selected} />

        {heritages.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={markerIcon}
            eventHandlers={{ click: () => onSelect(item) }}
          >
            <Popup>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs">{item.province}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}