import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { hot } from "react-hot-loader";

const useStyles = makeStyles({
  scene: {
    height: "100%",
    width: "100%",
    left: 0,
    top: 0,
    overflow: "hidden",
    position: "fixed",
  },
  info: {
    position: "absolute",
    top: "0px",
    right: "0px",
    background: "none",
  },
});

const App: React.FC<{}> = ()=>{
  const classes = useStyles();
  return(
    <div>
      <div id="scene" className={classes.scene}></div>
      <div id="info" className={classes.info}></div>
    </div>
  )
}
export default hot(module)(App)