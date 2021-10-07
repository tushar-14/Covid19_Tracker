import React from "react";
import numeral from "numeral";

import { Circle, Popup } from "react-leaflet";

const TypeColors = {
  cases: {
    multiplier: 300,
    option: { color: "#cc1034", fillColor: "#cc1034" },
  },
  recovered: {
    multiplier: 300,
    option: { color: "#1e8f25", fillColor: "#7dd71d" },
  },
  deaths: {
    multiplier: 1600,
    option: { color: "#575655", fillColor: "#575655" },
  },
};
export const sortdata = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const showdatamap = (data, types) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={TypeColors[types].option}
      radius={Math.sqrt(country[types]) * TypeColors[types].multiplier}
    >
      <Popup>
        <div className="info__container">
          <div
            className="info__flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info__name">{country.country}</div>
          <div className="info__cases">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info__recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info__deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const printStat = (stat) => {
  return stat ? `+${numeral(stat).format("0.0a")} ` : "+0";
};
