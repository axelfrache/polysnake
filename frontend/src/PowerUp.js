import React from "react";
import { POWER_UP_CONFIG } from "./constants/gameConstants";
import { scalePosition } from "./utils/scale";

const PowerUp = props => {
  const config = POWER_UP_CONFIG[props.type];
  const style = {
    left: `${scalePosition(props.dot[0])}px`,
    top: `${scalePosition(props.dot[1])}px`
  };
  
  return (
    <div className="power-up" style={style} data-type={props.type}>
      <span style={{ color: config.color }}>{config.icon}</span>
    </div>
  );
};

export default PowerUp;
