export const options: {} = {
  maintainAspectRatio: false,
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
  plugins: {
    crosshair: {
      line: {
        color: "rgba(150, 150, 150, 1)",
        width: 1,
        dashPattern: [7, 7],
      },
      zoom: {
        enabled: false,
      },
      snap: {
        enabled: false,
      },
    },
  },
  tooltips: {
    enabled: false,

    mode: "single",
    intersect: true,

    displayColors: false,
    titleFontSize: 16,
    bodyFontSize: 14,
    xPadding: 5,
    yPadding: 5,
    callbacks: {
      label: (
        tooltipItem: {
          xLabel: number;
          yLabel: number;
          index: number;
          datasetIndex: number;
        },
        data: any
      ) => {
        return ` <b> Burst: ${tooltipItem.datasetIndex + 1}   Ball: ${
          tooltipItem.index
        }  </b> <br/>
        (${tooltipItem.xLabel.toFixed(2)}, ${tooltipItem.yLabel.toFixed(2)})`;
      },
    },

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

      function getBody(bodyItem: { lines: any }): any {
        return bodyItem.lines;
      }

      // Set Text
      if (tooltipModel.body) {
        var titleLines: any[] = tooltipModel.title || [];
        var bodyLines: any[] = tooltipModel.body.map(getBody);

        var innerHtml = "<thead>";

        titleLines.forEach(function (title: string) {
          innerHtml += "<tr><th>" + title + "</th></tr>";
        });
        innerHtml += "</thead><tbody>";

        bodyLines.forEach(function (body: string, i: string | number) {
          var colors: any = tooltipModel.labelColors[i];
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
      var position: any = this._chart.canvas.getBoundingClientRect();

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
