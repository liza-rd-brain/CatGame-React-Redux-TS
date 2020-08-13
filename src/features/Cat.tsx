import React, { useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { useSpring, animated } from "react-spring";

import { CatMove } from "./../app";

/* 
type CatMoveProps = {

}; */

/*styled.div <CatMoveProps> */

const CatItem = styled.div`
  position: absolute;
  z-index: 1;
  width: 146px;
  height: 50px;
  bottom:-15px;
  /*top будет меняться от Y */
 /*  top: 235px; */
  /*котик посередине*/
  left: 240px;
  background: url("../assets/cat_run.gif") no-repeat;
  background-size: 91px 50px;
`;

const CatItemAnimatedJump = styled(animated(CatItem))``;

const Cat = React.forwardRef((props, ref: any) => <CatItem ref={ref} />);

export default Cat;
