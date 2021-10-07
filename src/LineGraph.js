import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  plugins: {
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem) {
          return numeral(tooltipItem.value).format("+0,0a");
        },
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, types) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[types][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[types][date];
  }
  return chartData;
};

function LineGraph({ types, codes, ...props }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `https://disease.sh/v3/covid-19/historical/${
          codes === "worldwide" ? "all" : codes
        }?lastdays=120`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // console.log(data.timeline);
          if (codes !== "worldwide") {
            data = data.timeline;
          }

          let chartData = buildChartData(data, types);
          // console.log(chartData);
          setData(chartData);

          // console.log(
          //   `https://disease.sh/v3/covid-19/historical/${codes}?lastdays=120`
          // );
          // console.log(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [types, codes]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                borderColor: ` ${types === "cases" ? "rgb(221, 27, 27)" : ""} ${
                  types === "recovered" ? "rgb(71,177, 44)" : ""
                }${types === "deaths" ? "rgb(87, 86, 85)" : ""}`,
                fill: true,
                backgroundColor: ` ${
                  types === "cases" ? "rgb(221, 27, 27,0.5)" : ""
                } ${types === "recovered" ? "rgb(71,177, 44,0.5)" : ""}${
                  types === "deaths" ? "rgb(87, 86, 85,0.5)" : ""
                }`,
                data: data,
                pointRadius: 0,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
