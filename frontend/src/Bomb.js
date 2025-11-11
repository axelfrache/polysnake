import React from "react";

const Bomb = props => {
  const style = {
    left: `${props.dot[0] * 15}px`,
    top: `${props.dot[1] * 15}px`
  };
  return <div className="bomb" style={style}>💣</div>;
};

export default Bomb;
