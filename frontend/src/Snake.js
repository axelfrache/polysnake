import React from "react";
import { scalePosition } from "./utils/scale";

const Snake = props => {
  return (
    <div>
      {props.snakeDots.map((dot, i) => {
        const style = {
          left: `${scalePosition(dot[0])}px`,
          top: `${scalePosition(dot[1])}px`
        };
        const className = props.isGhostMode ? "snake ghost-mode" : "snake";
        return <div className={className} key={i} style={style} />;
      })}
    </div>
  );
};
export default Snake;
