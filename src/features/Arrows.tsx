import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { MoveDirection } from "./../app";

type ArrowProps = {
  direction: MoveDirection;
};

const Arrow = styled.div<ArrowProps>`
  text-align: center;
  vertical-align: middle;
  border: 1px solid lightgrey;
  cursor: pointer;
  &:hover {
    color: pink;
  }
  &:active {
    color: red;
  }
  transform: ${(props) => {
    switch (props.direction) {
      case "top":
        return "rotate(-90deg)";
      case "bottom":
        return "rotate(90deg)";
    }
  }};

  width: 50px;
  align-self: center;
  padding: 15px 0;
`;

const ArrowContainer = styled.div`
  position: absolute;
  /*   width: 50px; */
  height: 50px;
  bottom: 100px;
  left: 250px;
  display: flex;
`;

function Arrows() {
  const dispatch = useDispatch();

  const renderArrow = (direction: MoveDirection) => {
    return (
      <Arrow
        direction={direction}
        onClick={() => {
          dispatch({ type: "jumpRequested", payload: direction });
        }}
      >
        &gt;
      </Arrow>
    );
  };

  return (
    <ArrowContainer>
      {renderArrow("top")}
      {renderArrow("bottom")}
    </ArrowContainer>
  );
}

export default Arrows;
