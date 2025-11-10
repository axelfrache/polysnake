import React from "react";

const Food = props => {
  const style = {
    left: `${props.dot[0] * 15}px`,
    top: `${props.dot[1] * 15}px`
  };
  return <div className="food" style={style} />;
};

export default Food;
