import { CardContent, Card, Typography } from "@material-ui/core";
import React from "react";
import "./infobox.css";

function Infobox({ title, cases, total, active, ifred, ifgrey, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`box ${active && "box--selected"} ${ifred && "box--red"} ${
        ifgrey && "box--grey"
      }`}
    >
      <CardContent>
        <Typography className="info_title" color="textSecondary">
          {title}
        </Typography>

        <h2
          className={`info_cases ${
            title === "Today Recovered" && "green--cases"
          } `}
        >
          {cases}
        </h2>
        <Typography className="info_total" color="textSecondary">
          {total}
          {"Total"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
