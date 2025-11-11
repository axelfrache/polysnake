import React from "react";
import { scalePosition } from "./utils/scale";

const Food = props => {
  const style = {
    left: `${scalePosition(props.dot[0])}px`,
    top: `${scalePosition(props.dot[1])}px`
  };
  return <div className="food" style={style} />;
};

export default Food;
