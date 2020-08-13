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
/* export const levelList = [0, 1, 2, 3, 4, 5]; */

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
  startCoord: number;
  endCoord: number;
  cat?: string;
};

export type GameLevelList = Map<string, LevelItem>;

export type State = {
  gameState: GameState;
  /*пока y вынесен, потом убрать в кота */
  y: number;
  levelList: GameLevelList;

  /*health
   */
};

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    y: 0,
    levelList: getLevelList(),
  };
};

function getLevelList() {
  /*котик по дефолту на уровне 2*/

  const levelList: GameLevelList = new Map();
  for (let i = 0; i < levelNumber; i++) {
    const levelWithCat = 2;
    switch (i) {
      case levelWithCat: {
        const objItem = {
          startCoord: i * heightY,
          endCoord: (i + 1) * heightY,
          cat: "cat",
        };
        levelList.set(`${i}`, objItem);
        break;
      }
      default: {
        const objItem = {
          startCoord: i * heightY,
          endCoord: (i + 1) * heightY,
        };
        levelList.set(`${i}`, objItem);
        break;
      }
    }
  }
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
  let [gameState, yCoord] = useSelector((state: State) => [
    state.gameState,
    state.y,
  ]);
  const dispatch = useDispatch();

  const deltaCooord = ((heightY + addJumpHeight / 2) * 20) / duration;

  useEffect(() => {
    switch (gameState) {
      case "gameStarted.jump": {
        let currStepCoord = yCoord + deltaCooord;
        const yCoordMax = heightY + addJumpHeight;
        if (yCoord < yCoordMax - deltaCooord) {
          const timerJumpGoing = setTimeout(() => {
            if (refCat != null && refCat.current != null) {
              refCat.current.style.transform = `translateY(-${currStepCoord}px`;
              refCat.current.style.transitionDuration = `20ms`;
              console.log(currStepCoord);
              dispatch({ type: "jumpGoing", payload: currStepCoord });
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

      case "gameStarted.fall": {
        const currStepCoord = yCoord - deltaCooord;
        const newCoord = yCoord - deltaCooord;
        const yCoordMin = 0;

        if (yCoord > yCoordMin) {
          const timerFallGoing = setTimeout(() => {
            if (refCat != null && refCat.current != null) {
              refCat.current.style.transform = `translateY(-${newCoord}px`;
              refCat.current.style.transitionDuration = `20ms`;
              console.log(currStepCoord);
              dispatch({ type: "fallGoing", payload: newCoord });
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

      default:
        break;
    }
  }, [gameState, yCoord]);

  const refCat = useRef<HTMLDivElement>(null);
  /*   console.log(refCat); */

  const getGameScreen = () => {
    switch (gameState) {
      case "waitingStart":
        return <StartScreen />;

      default:
        return (
          <>
            {/* <Cat ref={refCat} /> */}
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
