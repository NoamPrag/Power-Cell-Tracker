import { Chart } from "@devexpress/dx-react-chart-material-ui";
import { NearMeSharp } from "@material-ui/icons";
import React from "react";

import { Scatter, defaults } from "react-chartjs-2";

defaults.global.defaultFontFamily	= '"Poppins", sans-serif';

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
      }
    ]
  },
  layout:{
    padding: {
      top: 20,
      bottom: 10,
      right: 30,
    }
  },
  animation: {
    duration: 700,
    easing: "easeInOutQuad",
  },
  legend: {
    display: false,

  },
  tooltips:{

    mode: 'single',
    intersect: true,

    caretPadding: 5,
    caretSize: 7,
    cornerRadius: 6,
    backgroundColor: 'rgba(255,255,255,1)',
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    bodyFontColor: '#000',
    bodyFontSize: 16,
    bodyAlign: 'center',
    // bodySpacing: 100,
    displayColors: false,
    xPadding: 10,
    yPadding: 10,



  }

};

const ScatterChart = (): JSX.Element => {
  return (
    <>
      <Scatter data={data} options={options} />
    </>
  );
};

export default ScatterChart;
