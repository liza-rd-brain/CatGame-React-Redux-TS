import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Cat from "./Cat";
import { State, GameLevelList, LevelItem } from "./../app";

const GridItem = styled.div``;

const Level = styled.div`
  height: 50px;
  border-bottom: 1px solid black;
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
          <Level>
            <Cat ref={ref} />
            {index}
          </Level>
        );
      }
      case false: {
        return <Level>{index}</Level>;
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
