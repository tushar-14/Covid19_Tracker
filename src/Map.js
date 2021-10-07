import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./Map.css";
import { showdatamap } from "./util";

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}
function Map({ countries, center, zoom, types }) {
  return (
    <div className="map_box">
      <MapContainer className="map" center={center} zoom={zoom}>
        <ChangeView center={center} zoom={zoom} scrollWheelZoom={false} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showdatamap(countries, types)}
      </MapContainer>
    </div>
  );
}

export default Map;
