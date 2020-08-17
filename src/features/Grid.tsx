import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Cat from "./Cat";
import { State, GameLevelList, Level } from "./../app";

const GridItem = styled.div``;

type LevelName = {
  name: string;
  levelHeight: number;
};

const Level = styled.div<LevelName>`
  /* height: 50px; */
  height: ${(props) => {
    return `${props.levelHeight}px`;
  }};
  border-bottom: ${(props) => {
    if (props.name === "ground") {
      return "2px solid black";
    } else return "1px dotted gray";
  }};
  position: relative;
`;

const getGameGrid = (
  levelList: GameLevelList,
  ref: any,
  levelHeight: number
) => {
  const gridArray = Array.from(levelList).reverse();
  /*  console.log(gridArray); */
  return gridArray.map((item: [string, Level]) => {
    const index = item[0];
    const level = item[1];
    const levelHasCat = level.levelItem.cat ? true : false;
    /*  const levelHasCat = level.cat ? true : false; */
    switch (levelHasCat) {
      case true: {
        return (
          <Level name={level.name} levelHeight={levelHeight}>
            <Cat ref={ref} />
            {index}
          </Level>
        );
      }
      case false: {
        return (
          <Level name={level.name} levelHeight={levelHeight}>
            {index}
          </Level>
        );
      }
    }
  });
};

function Grid(props: any) {
  const [levelList] = useSelector((state: State) => [state.levelList]);
  return (
    <GridItem>
      {getGameGrid(levelList, props.refItem, props.levelHeight)}
      {/* <Cat ref={props.refItem} /> */}
    </GridItem>
  );
}

export default Grid;
