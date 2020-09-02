import React, { useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { useSpring, animated } from "react-spring";

import { CatMove, CatProps } from "./../app";

type CatOnLevel = {
  y: number;
};


const CatItem = styled.div<CatOnLevel>`
  position: absolute;
  z-index: 1;
  width: 146px;
  height: 50px;
  bottom: ${(props) => {
    return `${props.y}px`;
  }};
  left: 160px;
  background: url("../assets/cat_run.gif") no-repeat;
  background-size: 91px 50px;
`;

const CatItemAnimatedJump = styled(animated(CatItem))``;

const Cat = React.forwardRef((
  props: CatProps,
  ref: any /* React.Ref<HTMLButtonElement> */
) => (
  <>
    <CatItem y={props.y} ref={ref} />
    {/* {props.y} */}
  </>
));

export default Cat;
