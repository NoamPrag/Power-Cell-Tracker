import { Chart } from "@devexpress/dx-react-chart-material-ui";
import { NearMeSharp, SportsRugbySharp } from "@material-ui/icons";
import Tooltip from "material-ui/internal/Tooltip";
import React from "react";
import $ from "jquery";

import { Scatter, defaults } from "react-chartjs-2";

defaults.global.defaultFontFamily = '"Poppins", sans-serif';
defaults.global.tooltip;

let positions: {}[] = [];

const randWithLotOfDecimels = (Math.random() - 0.5) * 10;
const rand = () => Math.round((Math.random() - 0.5) * 100 * 100) / 100;

for (let i: number = 0; i < 50; i++) {
  const newPosition: { x: number; y: number } = { x: rand(), y: rand() };
  positions.push(newPosition);
}

const data: {} = {
  datasets: [
    {
      label: "Scatter Dataset",
      // data: [
      //   {
      //     x: -10,
      //     y: 0,
      //   },
      //   {
      //     x: 0,
      //     y: 10,
      //   },
      //   {
      //     x: 10,
      //     y: 5,
      //   },
      // ],
      data: positions,
      pointRadius: 10,
      hoverRadius: 8,

      backgroundColor: [
        "#2196f3",
        "#3568ca",
        "#3f51b5",
        "#7c3696",
        "#b81b76",
        "#f50057",
        "#f44336",
        "#fa6e1b",
        "#ff9800",
        "#414141",
        "#c3a01b",
        "#88a735",
        "#4caf50",
        "#3ea786",
        "#2f9ebd",
      ],
    },
  ],
};

const options: {} = {
  scales: {
    yAxes: [
      {
        ticks: {
          // fontSize: 14,
          beginAtZero: true,
          suggestedMin: -50,
          suggestedMax: 50,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
          suggestedMin: -50,
          suggestedMax: 50,
        },
      },
    ],
  },
  layout: {
    padding: {
      top: 20,
      bottom: 10,
      right: 30,
    },
  },
  animation: {
    duration: 700,
    easing: "easeInOutQuad",
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,

    mode: "single",
    intersect: true,

    // caretPadding: 5,
    // caretSize: 7,
    // cornerRadius: 6,
    // backgroundColor: "rgba(255,255,255,1)",
    // borderColor: "rgba(0,0,0,0.5)",
    // borderWidth: 1,
    // bodyFontColor: "#000",
    // bodyFontSize: 16,
    // bodyAlign: "center",
    // // bodySpacing: 100,
    // displayColors: false,
    // xPadding: 10,
    // yPadding: 10,

    displayColors: false,
    titleFontSize: 16,
    bodyFontSize: 14,
    xPadding: 5,
    yPadding: 5,
    // callbacks: {
    //   label: (tooltipItem: { value: any }, data: any) => {
    //     return ` ${tooltipItem.value}`;
    //   },
    // },

    custom: function (tooltipModel: {
      opacity: number;
      yAlign: string;
      body: any[];
      title: any[];
      labelColors: { [x: string]: any };
      caretX: any;
      caretY: any;
      _bodyFontFamily: string;
      bodyFontSize: string;
      _bodyFontStyle: string;
      yPadding: string;
      xPadding: string;
    }) {
      // Tooltip Element
      var tooltipEl = document.getElementById("chartjs-tooltip");

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "chartjs-tooltip";
        tooltipEl.innerHTML = "<table></table>";
        document.body.appendChild(tooltipEl);
      }

      // Hide if no tooltip
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = "0";
        return;
      }

      // Set caret Position
      tooltipEl.classList.remove("above", "below", "no-transform");
      if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
      } else {
        tooltipEl.classList.add("no-transform");
      }

      function getBody(bodyItem: { lines: any }) {
        return bodyItem.lines;
      }

      // Set Text
      if (tooltipModel.body) {
        var titleLines = tooltipModel.title || [];
        var bodyLines = tooltipModel.body.map(getBody);

        var innerHtml = "<thead>";

        titleLines.forEach(function (title: string) {
          innerHtml += "<tr><th>" + title + "</th></tr>";
        });
        innerHtml += "</thead><tbody>";

        bodyLines.forEach(function (body: string, i: string | number) {
          var colors = tooltipModel.labelColors[i];
          var style = "background:" + colors.backgroundColor;
          style += "; border-color:" + colors.borderColor;
          style += "; border-width: 2px";
          var span = '<span style="' + style + '"></span>';
          innerHtml += "<tr><td>" + span + body + "</td></tr>";
        });
        innerHtml += "</tbody>";

        var tableRoot = tooltipEl.querySelector("table");
        tableRoot.innerHTML = innerHtml;
      }

      // `this` will be the overall tooltip
      var position = this._chart.canvas.getBoundingClientRect();

      // Display, position, and set styles for font
      tooltipEl.style.opacity = "1";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.left =
        position.left + window.pageXOffset + tooltipModel.caretX - 55 + "px";
      tooltipEl.style.top =
        position.top + window.pageYOffset + tooltipModel.caretY - 50 + "px";
      tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
      tooltipEl.style.fontSize = tooltipModel.bodyFontSize + "px";
      tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
      tooltipEl.style.padding =
        tooltipModel.yPadding + "px " + tooltipModel.xPadding + "px";
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.boxShadow = "0px 1px 5px 0px #ccc";
      tooltipEl.style.backgroundColor = "rgba(255,255,255,1)";
      tooltipEl.style.borderRadius = "6px";
    },
  },
};

const ScatterChart = (): JSX.Element => {
  return (
    <>
      <Scatter data={data} options={options} />
    </>
  );
};

export default ScatterChart;
