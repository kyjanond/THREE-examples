import { hot } from "react-hot-loader";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export interface IInfoProps{
  drawCalls:number
}

const useStyles = makeStyles({
  root: {
    backgroundColor: "white"
  },
});

const InfoCard: React.FC<IInfoProps> = (props:IInfoProps) =>{
  const classes = useStyles();
  return(
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography>
          drawCalls = {props.drawCalls}
        </Typography>
      </CardContent>
    </Card>
  )
}
export default hot(module)(InfoCard);