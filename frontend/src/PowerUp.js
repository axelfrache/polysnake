import React from "react";
import { POWER_UP_CONFIG } from "./constants/gameConstants";

const PowerUp = props => {
  const config = POWER_UP_CONFIG[props.type];
  const style = {
    left: `${props.dot[0] * 15}px`,
    top: `${props.dot[1] * 15}px`
  };
  
  return (
    <div className="power-up" style={style} data-type={props.type}>
      <span style={{ color: config.color }}>{config.icon}</span>
    </div>
  );
};

export default PowerUp;
