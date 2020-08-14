import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Cat from "./Cat";
import { State, GameLevelList, LevelItem } from "./../app";

const GridItem = styled.div``;

type LevelName = {
  name: string;
};

const Level = styled.div<LevelName>`
  height: 50px;

  border-bottom: ${(props) => {
    if (props.name === "ground") {
      return "2px solid black";
    } else return "1px dotted gray";
  }};
  position: relative;
`;

const getGameGrid = (levelList: GameLevelList, ref: any) => {
  const gridArray = Array.from(levelList).reverse();
  /*  console.log(gridArray); */
  return gridArray.map((level: [string, LevelItem]) => {
    const index = level[0];
    const levelItem = level[1];
    const levelHasCat = levelItem.cat ? true : false;
    switch (levelHasCat) {
      case true: {
        return (
          <Level name={levelItem.name}>
            <Cat ref={ref} />
            {index}
          </Level>
        );
      }
      case false: {
        return <Level name={levelItem.name}>{index}</Level>;
      }
    }
  });
};

function Grid(props: any) {
  const [levelList] = useSelector((state: State) => [state.levelList]);
  return (
    <GridItem>
      {getGameGrid(levelList, props.refItem)}
      {/* <Cat ref={props.refItem} /> */}
    </GridItem>
  );
}

export default Grid;
