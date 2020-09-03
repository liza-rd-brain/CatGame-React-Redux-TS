import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { BarrierProps } from "./../app";

type BarrierCoord = {
  x: number;
  y: number;
};

const BarrierItem = styled.div<BarrierCoord>`
  height: 50px;
  width: 5px;
  background-color: red;
  /*  border: 1px solid black; */
  right: ${(props) => {
    return ` ${props.x}px`;
  }};
  position: absolute;
  bottom: ${(props) => {
    return `${props.y}px`;
  }};
  z-index: 3;
`;

const Barrier = React.forwardRef((props: BarrierProps, ref: any) => (
  <BarrierItem ref={ref} x={props.x} y={props.y} />
));

export default Barrier;
