import React, { useState, Fragment } from "react";
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
import OrbitLogo from "./OrbitLogo";

import ScatterPlotIcon from "@material-ui/icons/ScatterPlot";
import AdbIcon from "@material-ui/icons/Adb";
import TimelineIcon from "@material-ui/icons/Timeline";

export type Tab = "Scatter" | "Arduino" | "Stats";

const MenuAppBar = (props: { setTab: (tab: Tab) => void }) => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Fragment>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpened(true)}
          >
            <OrbitLogo />
          </IconButton>

          <Drawer
            anchor="left"
            open={menuOpened}
            onClose={() => setMenuOpened(false)}
          >
            <List>
              {["Scatter", "Stats", "Arduino"].map((tabName: Tab, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    setMenuOpened(false);
                    props.setTab(tabName);
                  }}
                >
                  <ListItemIcon>
                    {tabName === "Scatter" ? (
                      <ScatterPlotIcon />
                    ) : tabName === "Stats" ? (
                      <TimelineIcon />
                    ) : tabName === "Arduino" ? (
                      <AdbIcon />
                    ) : (
                      <></>
                    )}
                  </ListItemIcon>

                  <ListItemText primary={tabName} />
                </ListItem>
              ))}
            </List>
          </Drawer>
        </Fragment>

        <Typography variant="h6">Power Cell Tracker</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MenuAppBar;
