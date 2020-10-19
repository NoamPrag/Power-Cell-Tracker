import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import OrbitLogo from "./OrbitLogo";

import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';
import AdbIcon from '@material-ui/icons/Adb';
import TimelineIcon from '@material-ui/icons/Timeline';

import { Tab } from "./App";

const MenuAppBar = () => {
  const [menuOpened, setMenuOpened] = React.useState(false);

  // const TabIcon = ({tab: Tab}) => {
  //   switch(tab) {
  //     case "Scatter":
  //       return ScatterPlotIcon;

  //     case "Stats":
  //       return TimeLineIcon;

  //     case "Arduino":
  //       return AdbIcon;
  //   }
  // };

  return (
    <AppBar position="fixed">
      <Toolbar>

        <React.Fragment>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMenuOpened(true)}>
            <OrbitLogo />
          </IconButton>

          <Drawer anchor="left" open={menuOpened} onClose={() => setMenuOpened(false)}>
              <List>
                {["Scatter", "Stats", "Arduino"].map((tabName, index) => 
                  <ListItem button key={index}>
                    <ListItemIcon> 
                      {tabName === "Scatter" ? <ScatterPlotIcon /> : tabName === "Stats" ? <TimelineIcon /> : tabName === "Arduino" ? <AdbIcon /> : <></>}
                    </ListItemIcon>
                    
                    <ListItemText primary={tabName}/>
                  </ListItem>
                )}
              </List>
          </Drawer>
        </React.Fragment>

        <Typography variant="h6">Power Cell Tracker</Typography>

      </Toolbar>
    </AppBar>
  )
};

export default MenuAppBar;
