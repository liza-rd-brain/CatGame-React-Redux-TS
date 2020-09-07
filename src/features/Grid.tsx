import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Cat from "./Cat";
import Barrier from "./Barrier";
import { State, GameLevelList, Level } from "./../app";

const GridItem = styled.div`
  position: relative;
`;

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
`;

const getGameGrid = (
  levelList: GameLevelList,
  refCat: any,
  refBarrier: any,
  levelHeight: number
) => {
  const gridArray = Array.from(levelList).reverse();
  /*  console.log(gridArray); */
  return gridArray.map((item: [string, Level], numberOfLevel) => {
    const index = item[0];
    const level = item[1];
    const levelCoord = level.endCoord;
    const levelHasCat = level.levelItem.cat ? true : false;
    const levelHasBarrier = level.levelItem.barrier ? true : false;
    const levelHasCatAndBarrier = levelHasCat && levelHasBarrier;
    const catY = level.levelItem.cat ? level.levelItem.cat.y : 0;
    const barrierX = level.levelItem.barrier ? level.levelItem.barrier.x : 0;
    const barrierY = level.levelItem.barrier ? level.levelItem.barrier.y : 0;
    return (
      <Level name={level.name} levelHeight={levelHeight}>
        {`${index} - ${levelCoord}`}
        {(() => {
          switch (true) {
            case levelHasCatAndBarrier: {
              return (
                <>
                  <Cat ref={refCat} y={catY} />
                  <Barrier ref={refBarrier} x={barrierX} y={barrierY} level={numberOfLevel} />
                </>
              );
            }
            case levelHasCat: {
              return <Cat ref={refCat} y={catY} />;
            }
            case levelHasBarrier: {
              return (
                <Barrier
                  ref={refBarrier}
                  x={barrierX}
                  y={barrierY}
                  level={numberOfLevel}
                />
              );
            }
            default:
              return null;
          }
        })()}
      </Level>
    );
  });
};

function Grid(props: any) {
  const [levelList] = useSelector((state: State) => [state.levelList]);
  return (
    <GridItem>
      {getGameGrid(
        levelList,
        props.refCat,
        props.refBarrier,
        props.levelHeight
      )}
      {/* <Cat ref={props.refItem} /> */}
    </GridItem>
  );
}

export default Grid;
