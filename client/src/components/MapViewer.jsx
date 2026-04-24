import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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
        zoom={4}          // Đã giảm zoom mặc định để góc nhìn ban đầu rộng hơn
        minZoom={2}       // Đã giảm minZoom xuống mức 2 để thu nhỏ nhìn được toàn cầu
        maxZoom={18}
        className="w-full h-full z-0"
        // Đã gỡ bỏ giới hạn maxBounds và maxBoundsViscosity ở đây
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