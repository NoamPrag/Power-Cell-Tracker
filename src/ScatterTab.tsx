import React, { useState } from "react";
import Burst, { BurstData, Position } from "./Burst";
import { Grid, Typography, Fab, Button } from "@material-ui/core";
import Scatter from "./Scatter";
import { accuracy, precision } from "./Calculations";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProgressBar from "./ProgressBar";
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import InvertColorsOffIcon from '@material-ui/icons/InvertColorsOff';
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";



export let colors = [
  "#2196f3",
  "#2b7fde",
  "#3568ca",
  "#3f51b5",
  "#7c3696",
  "#b81b76",
  "#f50057",
  "#f44336",
  "#fa6e1b",
  "#ff9800",
  "#414141",
  "#ff9800",
  "#c3a01b",
  "#88a735",
  "#4caf50",
  "#3ea786",
  "#2f9ebd",
];

// export const colors2 = [
//   "#3f51b5",
//   "#f50057",
//   "#f44336",
//   "#ff9800",
//   "#2196f3",
//   "#4caf50",
// ];

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const THEME = createMuiTheme({
  typography: {
    fontFamily: `"Poppins", sans-serif`,
  },
});




const ScatterTab = (props: {data: BurstData[], setData: React.Dispatch<React.SetStateAction<BurstData[]>>}) => {

  

  let allPositions: Position[] = [];
  for (const burst of props.data.map((val) => val.burstCoordinates)) {
    for (const position of burst) {
      allPositions.push(position);
    }
  }
  const totalPrecision = precision(allPositions);
  const totalAccuracy = accuracy(allPositions);

  const [showColors, setShowColors] = useState(true);

  React.useEffect(() => {
    // Shuffle the colors array
    for (let i = 0; i < Math.pow(colors.length, 2); i++) {
      colors.sort((a, b) => Math.random() - 0.5);
    }
    
    props.setData((curr) =>
      curr.map((item, index) => {
        let itemCopy = item;
        itemCopy.color = colors[index];
        return itemCopy;
      })
    );
  }, []);

  const switchColors = () => {
    setShowColors((val) => !val);
    props.setData((curr) =>
      curr.map((item, index) => {
        let itemCopy = item;
        itemCopy.color = !showColors ? colors[index] : "grey";
        return itemCopy;
      })
    );
  };

  const forceUpdate = useForceUpdate();

  const openBurst = (burstNumber: number) => {
    if (!showColors) {
      const dataCopy = props.data;
      dataCopy[burstNumber].color = colors[burstNumber];
      props.setData(dataCopy);
      forceUpdate();
    }
  };

  const closeBurst = (burstNumber: number) => {
    if (!showColors) {
      const dataCopy = props.data;
      dataCopy[burstNumber].color = "grey";
      props.setData(dataCopy);
      forceUpdate();
    }
  };

  return (
    <div>
      <MuiThemeProvider theme={THEME}>
        <Grid
          container
          style={{
            position: "fixed",
            width: "95vw",
            height: "85vh",
            left: "3vw",
            top: 100,
          }}
        >
          <Grid item xs={9}>
            <Scatter data={props.data} />
          </Grid>
          <Grid item xs={3} style={{ height: 650, overflowY: "scroll"}}>
            {/*TODO: add border*/}
              {props.data.map((value, index) => (
                <Burst
                  burst={value}
                  key={index}
                  open={() => openBurst(index)}
                  close={() => closeBurst(index)}
                />
              ))}
          </Grid>

          <Grid item container spacing={5} xs={12} alignItems="center">

      <Grid item xs={1} style={{marginRight: -20}}>
              <Fab color={showColors ? "secondary" : "default"} aria-label="edit" onClick={() => switchColors()}>
                  {showColors ?  <InvertColorsIcon/> : <InvertColorsOffIcon/>}
              </Fab>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h5">Total Precision:</Typography>
              <ProgressBar value={totalPrecision} show={true} />
            </Grid>

            <Grid item xs={4}>
            <Typography variant="h5">Total Accuracy:</Typography>
              <ProgressBar value={totalAccuracy} show={true} />
            </Grid>

            <Grid item xs={1} style={{marginLeft: 70, marginRight: 30}}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CloudUploadIcon />}
                >     
                Upload
              </Button>
            </Grid>

            <Grid item xs={1}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                >
                Export
              </Button>
            </Grid>

          </Grid>
      </Grid>
      </MuiThemeProvider>
    </div>
  );
};

export default ScatterTab;
