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
  height: 800px;
  margin: 0 auto;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

export const duration = 300;
export const levelHeight = 80;
export const catHeight = 25;
export const addJumpHeight = 30;
export const levelNumber = 6;
const levelWithCat = 2;
/*4-потом домики!! */
const levelWithGroung = [0, 2, 4];

export type MoveDirection = "top" | "bottom";

export type GameState =
  | "waitingStart"
  | "gameStarted.run"
  | "gameStarted.jumpStarted"
  | "gameStarted.jump"
  | "gameStarted.jumpGoing"
  | "gameStarted.fall"
  | "gameStarted.doubleJump"
  | "endGame"
  | "getEndScreen";

export type Action =
  | { type: "clickStartButton" }
  | { type: "arrowPressed"; payload: MoveDirection }
  | { type: "jumpStarted" }
  | { type: "jumpGoing"; payload: number }
  | { type: "switchLevel" }
  | { type: "fallGoing"; payload: number }
  | { type: "endOfJump" /*  payload: number */ }
  | { type: "endOfFall" /* payload: number */ }
  | { type: "catfFall" }
  | { type: "catDoubleJump" };

export type CatMove = "jump" | "doubleJump" | "fall" | "run";

export type Level = {
  name: "empty" | "ground";
  startCoord: number;
  endCoord: number;
  levelItem: { cat?: CatItem };
  /*  cat?: CatItem; */
};

export type CatItem = {
  y: number;
  health: number;
  /* health: number; */
};

export type GameLevelList = Map<string, Level>;

export type State = {
  gameState: GameState;
  /*пока y вынесен, потом убрать в кота */
  y: number;
  levelList: GameLevelList;
  levelOfMove: number;
  testAnimation: Boolean;

  /*health
   */
};

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    y: 100,
    levelList: getLevelList(),
    levelOfMove: levelWithCat,
    testAnimation: false,
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
            const objItem: Level = {
              name: "ground",
              startCoord: i * levelHeight,
              endCoord: (i + 1) * levelHeight,
              levelItem: {
                cat: {
                  y: i * levelHeight,
                  health: 3,
                },
              },
            };
            levelList.set(`${i}`, objItem);
            break;
          }
          default: {
            const objItem: Level = {
              name: "ground",
              startCoord: i * levelHeight,
              endCoord: (i + 1) * levelHeight,
              levelItem: {},
            };
            levelList.set(`${i}`, objItem);
            break;
          }
        }
        break;
      }
      case false: {
        const objItem: Level = {
          name: "empty",
          startCoord: i * levelHeight,
          endCoord: (i + 1) * levelHeight,
          levelItem: {},
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
        case "jumpStarted": {
          return jump(action, state);
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
    testAnimation,
  ] = useSelector((state: State) => [
    state.gameState,
    state.levelList,
    state.y,
    state.levelOfMove,
    state.testAnimation,
  ]);
  const dispatch = useDispatch();

  const deltaCooord = ((levelHeight + addJumpHeight) * 20) / duration;
  const level = levelList.get(`${levelOfMove}`);
  const currentYCoord =
    level && level.levelItem.cat ? level.levelItem.cat?.y : 0;
  /*от изменения gameState рисуем анимацию  + дистпачим y
  сразу регулируем время прыжка!
  задаем через 3 секунды очищение setInterval*/

  /*от изменения y свитчим уровни*/

  useEffect(
    () => {
      switch (gameState) {
        case "gameStarted.jumpStarted": {
          const makingJump = setInterval(() => console.log("test"), 200);
          dispatch({ type: "jumpStarted" });
          const endingJump = setTimeout(() => {
            console.log("endOfJump");
            clearInterval(makingJump);
          }, 500);
          return (): void => {
            clearTimeout(endingJump);
          };
        }
      }
    },
    [] /* [testAnimation] */
  );

  /*анимация котика + изменение координаты */
  useEffect(() => {
    switch (gameState) {
      case "gameStarted.jumpStarted": {
        const levelItem = levelList.get(`${levelOfMove}`);
        if (levelItem) {
          const startCoord = levelItem.startCoord;
          let currCoord = deltaCooord;
          const makingJump = setInterval(() => {
            if (refCat != null && refCat.current != null) {
              refCat.current.style.transform = `translateY(-${currCoord}px`;
              refCat.current.style.transitionDuration = `20ms`;
              currCoord += deltaCooord;
              const newYCoord = currCoord + startCoord;
              console.log("newYCoord", newYCoord);
              dispatch({ type: "jumpGoing", payload: newYCoord });
            }
          }, 20);
          const endingJump = setTimeout(() => {
            console.log("endOfJump");
            clearInterval(makingJump);
          }, duration);
          return (): void => {
            clearTimeout(endingJump);
          };
        }
      }
      default:
        break;
    }
  }, [gameState]);

  useEffect(() => {
    switch (gameState) {
      case "gameStarted.jumpStarted": {
        const levelItem = levelList.get(`${levelOfMove}`);
        const startCoord = levelItem ? levelItem.startCoord : 0;
        /*голова котика приподнята на catHeight над уровнем */
        const catCrossLine =
          currentYCoord + catHeight > startCoord + levelHeight &&
          currentYCoord + catHeight < startCoord + levelHeight + deltaCooord;
        if (catCrossLine) {
          console.log(levelOfMove);
          dispatch({
            type: "switchLevel",
          });
        }
      }
      default:
        break;
    }
  }, [currentYCoord]);
  useEffect(
    () => {
      switch (gameState) {
        /*   case "gameStarted.jump": {
          const levelItem = levelList.get(`${levelOfMove}`);
        
          if (levelItem) {
            const startCoord = levelItem.startCoord;
            const endCoord = levelItem.endCoord;
            const catCoord = levelItem.cat ? levelItem.cat.y : 0;
            const currCoord = catCoord - startCoord + deltaCooord;
            if (catCoord < endCoord + addJumpHeight) {
              const timerJumpGoing = setTimeout(() => {
                if (refCat != null && refCat.current != null) {
                  refCat.current.style.transform = `translateY(-${currCoord}px`;
                  refCat.current.style.transitionDuration = `20ms`;

                  const newYCoord = deltaCooord + catCoord;
              
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
        } */
        /* case "gameStarted.fall": {
          const levelItem = levelList.get(`${levelOfMove}`);
          if (levelItem) {
            const startCoord = levelItem.startCoord;
            const endCoord = levelItem.endCoord;
            const catCoord = levelItem.cat ? levelItem.cat.y : 0;
            const currCoord = catCoord - startCoord;

            if (catCoord > startCoord) {
              const timerFallGoing = setTimeout(() => {
                if (refCat != null && refCat.current != null) {
                  refCat.current.style.transform = `translateY(-${currCoord}px`;
                  refCat.current.style.transitionDuration = `20ms`;
                  const newYCoord = catCoord - deltaCooord;
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
        } */

        default:
          break;
      }
    },
    [
      /* gameState, levelList */
    ]
  );

  const refCat = useRef<HTMLDivElement>(null);

  const getGameScreen = () => {
    switch (gameState) {
      case "waitingStart":
        return <StartScreen />;

      default:
        return (
          <>
            <Grid refItem={refCat} levelHeight={levelHeight} />
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
