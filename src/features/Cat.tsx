import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { useSpring, animated } from "react-spring";

import { CatMove } from "./../app";

type CatMoveProps = {
  move: CatMove;
};

const CatItem = styled(animated.div)<CatMoveProps>`
  position: absolute;
  z-index: 1;
  width: 146px;
  height: 50px;
  top: 235px;
  /*котик посередине*/
  left: 240px;
  background: url("../assets/cat_run.gif") no-repeat;
  background-size: 91px 50px;
/*   animation: ${(props) => {
  switch (props.move) {
    case "jump":
      return " useSpring({opacity: 1, from: {opacity: 0}})";
  }
}}; */
`;

const CatItemAnimated = styled(animated(CatItem))``;

type CatProps = {
  move: CatMove;
};

function Cat(props: CatProps) {
  const propsTest = useSpring({ opacity: 1, from: { opacity: 0 } });
  return <animated.div style={propsTest}>I will fade in</animated.div>
  /* return <animated.div style={props}>I will fade in</animated.div> */
 /*  return <CatItem move={props.move} />; */
}
 
export default Cat;
