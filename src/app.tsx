import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore, compose } from "redux";
import styled, { ThemeProvider } from "styled-components";

import Cat from "./features/Cat";
import Arrows from "./features/Arrows";
import StartScreen from "./features/StartScreen";
import Grid from "./features/Grid";

import waitingStartPhase from "./phases/waitingStart";
import run from "./phases/gameStarted/run";
import jump from "./phases/gameStarted/jump";
import fall from "./phases/gameStarted/fall";
/*1. стартовый экран
2. котик бежит и прыгает на белом фоне
3. описать, спроектировать сущности и состояния
 */

const Field = styled.div`
  position: relative;
  width: 600px;
  height: 500px;
  margin: 0 auto;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

export const duration = 350;
export const heightY = 50;
export const addJumpHeight = 30;
export const levelNumber = 6;
const levelWithCat = 2;
/*4-потом домики!! */
const levelWithGroung = [0, 2, 4];

export type MoveDirection = "top" | "bottom";

export type GameState =
  | "waitingStart"
  | "gameStarted.run"
  | "gameStarted.jump"
  | "gameStarted.jumpGoing"
  | "gameStarted.fall"
  | "gameStarted.doubleJump"
  | "endGame"
  | "getEndScreen";

export type Action =
  | { type: "clickStartButton" }
  | { type: "arrowPressed"; payload: MoveDirection }
  | { type: "jumpGoing"; payload: number }
  | { type: "fallGoing"; payload: number }
  | { type: "endOfJump" /*  payload: number */ }
  | { type: "endOfFall" /* payload: number */ }
  | { type: "catfFall" }
  | { type: "catDoubleJump" };

export type CatMove = "jump" | "doubleJump" | "fall" | "run";

export type LevelItem = {
  name: "empty" | "ground";
  startCoord: number;
  endCoord: number;
  cat?: CatItem;
};

export type CatItem = {
  y: number;
  /* health: number; */
};

export type GameLevelList = Map<string, LevelItem>;

export type State = {
  gameState: GameState;
  /*пока y вынесен, потом убрать в кота */
  y: number;
  levelList: GameLevelList;
  levelOfMove: number;

  /*health
   */
};

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    y: 100,
    levelList: getLevelList(),
    levelOfMove: levelWithCat,
  };
};

function getLevelList() {
  /*котик по дефолту на уровне 2*/

  const levelList: GameLevelList = new Map();
  for (let i = 0; i < levelNumber; i++) {
    const groundLevel = levelWithGroung.some((item) => {
      return item === i;
    });
    switch (groundLevel) {
      case true: {
        switch (i) {
          case levelWithCat: {
            const objItem: LevelItem = {
              name: "ground",
              startCoord: i * heightY,
              endCoord: (i + 1) * heightY,
              cat: {
                y: i * heightY,
              },
            };
            levelList.set(`${i}`, objItem);
            break;
          }
          default: {
            const objItem: LevelItem = {
              name: "ground",
              startCoord: i * heightY,
              endCoord: (i + 1) * heightY,
            };
            levelList.set(`${i}`, objItem);
            break;
          }
        }
        break;
      }
      case false: {
        const objItem: LevelItem = {
          name: "empty",
          startCoord: i * heightY,
          endCoord: (i + 1) * heightY,
        };
        levelList.set(`${i}`, objItem);
        break;
      }
    }
  }
  console.log(levelList);
  return levelList;
}

const reducer = (state = getInitialState(), action: Action): State => {
  const [phaseOuter, phaseInner] = state.gameState.split(".");
  switch (phaseOuter) {
    case "waitingStart": {
      return waitingStartPhase(action, state);
    }
    case "gameStarted": {
      switch (phaseInner) {
        case "run": {
          return run(action, state);
        }
        case "jump": {
          return jump(action, state);
        }
        case "jumpGoing": {
          return jump(action, state);
        }
        case "fall": {
          return fall(action, state);
        }

        default:
          return state;
      }
    }

    default:
      return state;
  }
};

/* function getDeltaCoord(startCoord, endCoord, time) {
  return (endCoord - startCoord) / time;
} */

function App() {
  let [
    gameState,
    levelList,
    yCoord,
    levelOfMove,
  ] = useSelector((state: State) => [
    state.gameState,
    state.levelList,
    state.y,
    state.levelOfMove,
  ]);
  const dispatch = useDispatch();

  const deltaCooord = (heightY * 20 + addJumpHeight) / duration;

  useEffect(() => {
    switch (gameState) {
      case "gameStarted.jump": {
        const levelItem = levelList.get(`${levelOfMove}`);
        if (levelItem) {
          const startCoord = levelItem.startCoord;
          const endCoord = levelItem.endCoord;
          const catCoord = levelItem.cat ? levelItem.cat.y : 0;
          const currStepCoord = ((catCoord - startCoord + deltaCooord) * 3) / 2;
          if (catCoord < endCoord) {
            const timerJumpGoing = setTimeout(() => {
              if (refCat != null && refCat.current != null) {
                refCat.current.style.transform = `translateY(-${currStepCoord}px`;
                refCat.current.style.transitionDuration = `20ms`;

                const newYCoord = deltaCooord + catCoord;
                console.log("jump", currStepCoord);
                console.log("newYCoord", newYCoord);
                dispatch({ type: "jumpGoing", payload: newYCoord });
              }
            }, 20);
            return (): void => {
              clearTimeout(timerJumpGoing);
            };
          } else
            dispatch({
              type: "endOfJump",
            });
        }
      }
      case "gameStarted.fall": {
        const levelItem = levelList.get(`${levelOfMove}`);
        if (levelItem) {
          const startCoord = levelItem.startCoord;
          const endCoord = levelItem.endCoord;
          const catCoord = levelItem.cat ? levelItem.cat.y : 0;
          const currStepCoord = ((catCoord - startCoord) * 3) / 2;
          if (catCoord > startCoord) {
            const timerFallGoing = setTimeout(() => {
              if (refCat != null && refCat.current != null) {
                refCat.current.style.transform = `translateY(-${currStepCoord}px`;
                refCat.current.style.transitionDuration = `20ms`;
                const newYCoord = catCoord - deltaCooord;
                console.log("fall", currStepCoord);
                console.log("newYCoord", newYCoord);
                dispatch({ type: "fallGoing", payload: newYCoord });
              }
            }, 20);
            return (): void => {
              clearTimeout(timerFallGoing);
            };
          } else
            dispatch({
              type: "endOfFall",
            });
        }
      }

      default:
        break;
    }
  }, [gameState, levelList /* yCoord */]);

  const refCat = useRef<HTMLDivElement>(null);

  const getGameScreen = () => {
    switch (gameState) {
      case "waitingStart":
        return <StartScreen />;

      default:
        return (
          <>
            <Grid refItem={refCat} />
            <Arrows />
          </>
        );
    }
  };
  return <Field>{getGameScreen()}</Field>;
}

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
