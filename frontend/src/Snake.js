import React from "react";

const Snake = props => {
  return (
    <div>
      {props.snakeDots.map((dot, i) => {
        const style = {
          left: `${dot[0] * 15}px`,
          top: `${dot[1] * 15}px`
        };
        const className = props.isGhostMode ? "snake ghost-mode" : "snake";
        return <div className={className} key={i} style={style} />;
      })}
    </div>
  );
};
export default Snake;
