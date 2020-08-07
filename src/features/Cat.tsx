import React, { useState } from "react";
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

const CatItemAnimatedJump = styled(animated(CatItem))``;

type CatProps = {
  move: CatMove;
};

export function Cat(props: CatProps) {
  /* return <animated.div style={props}>I will fade in</animated.div> */
  return <CatItem move={props.move} />;
}

export function CatAnimated() {
  /* const propsTest = useSpring({
    from: {
      transform: `translateY(0px)`,
    },
    to: {
      transform: `translateY(-150px)`,
    },
    config: {
      duration: 300,
    },
  });
  return <CatItemAnimatedJump style={propsTest} />; */

  /*  const [state, toggle] = useState(true); */
  const { x } = useSpring({
    from: { x: 0 },
    x: 1,
    /*     x: state ? 1 : 0, */
    config: { duration: 600 },
  });
  return (
    <div /* onClick={() => toggle(!state)} */>
      <CatItemAnimatedJump
        style={{
          /*   opacity: x.interpolate({ range: [0, 1], output: [0.3, 1] }), */
          transform: x
            .interpolate({
              range: [0, 0.5, 1],
              output: [0, -100, 0],
            })
            .interpolate((x) => `translateY(${x}px)`),
        }}
      />
      {/* click
      </animated.div> */}
    </div>
  );
}

/* export default Cat; */

{
  /* <animated.div style={propsTest}>I will fade in</animated.div>; */
}
