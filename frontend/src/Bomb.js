import React from "react";
import { scalePosition } from "./utils/scale";

const Bomb = props => {
  const style = {
    left: `${scalePosition(props.dot[0])}px`,
    top: `${scalePosition(props.dot[1])}px`
  };
  return <div className="bomb" style={style}>💣</div>;
};

export default Bomb;
