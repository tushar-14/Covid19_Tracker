import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,

  // Table,
} from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import Infobox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import "./App.css";
import { printStat, sortdata } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
  const world = [35.746486, 13.363904];
  const worldzoom = 2;
  const lookup = require("country-code-lookup");
  const [countries, setcountries] = useState([]);
  const [country, setcountry] = useState("worldwide");
  const [countryinfo, setcountryinfo] = useState([]);
  const [tabledata, settabledata] = useState([]);
  const [mapCenter, setmapCenter] = useState(world);
  const [mapZoom, setmapZoom] = useState(worldzoom);
  const [mapcountries, setmapcountries] = useState([]);
  const [casetype, setcasetype] = useState("cases");
  useEffect(() => {
    const getcountriesdata = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));

          const sortedData = sortdata(data);
          settabledata(sortedData);
          setmapcountries(sortedData);
          setcountries(countries);
        });
    };
    getcountriesdata();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setcountryinfo(data);
      });
  }, []);

  const oncountrychange = async (event) => {
    const code = event.target.value;
    // setheading(event.target);
    console.log(event.target.response);
    const url =
      code === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${code}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setcountryinfo(data);

        setcountry(code);

        if (code === "worldwide") {
          setmapCenter(world);
          setmapZoom(worldzoom);
        } else {
          setmapCenter([data.countryInfo["lat"], data.countryInfo["long"]]);
          setmapZoom(4.48);
        }

        // console.log(mapCenter);
      });
  };

  // const setTypes =(event)=>{
  //   let type=event.target.title
  // }

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid-19 Tracker</h1>

          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              displayEmpty
              onChange={oncountrychange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <Infobox
            ifred={casetype === "cases"}
            active={casetype === "cases"}
            onClick={(e) => setcasetype("cases")}
            title="Today Cases"
            cases={printStat(countryinfo.todayCases)}
            total={printStat(countryinfo.cases)}
          />
          <Infobox
            active={casetype === "recovered"}
            onClick={(e) => setcasetype("recovered")}
            title="Today Recovered"
            cases={printStat(countryinfo.todayRecovered)}
            total={printStat(countryinfo.recovered)}
          />
          <Infobox
            ifgrey={casetype === "deaths"}
            active={casetype === "deaths"}
            onClick={(e) => setcasetype("deaths")}
            title="Today Deaths"
            cases={printStat(countryinfo.todayDeaths)}
            total={printStat(countryinfo.deaths)}
          />
        </div>
        <Map
          types={casetype}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapcountries}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live cases</h3>
          <Table countries={tabledata} />
          <h3 className="graph_heading">
            {country === "worldwide"
              ? `Worldwide recent ${casetype}`
              : lookup.byIso(country).country + `'s recent ${casetype}`}
          </h3>
        </CardContent>

        <LineGraph className="app_graph" types={casetype} codes={country} />
      </Card>
    </div>
  );
}

export default App;
