import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = ({ location }) => {
  if (!location || !location.lat || !location.lon) {
    return <p>Loading map...</p>;
  }

  return (
    <MapContainer center={[location.lat, location.lon]} zoom={10} style={{ height: "300px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lon]}>
        <Popup>{location.city ? location.city : "Selected Location"}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
