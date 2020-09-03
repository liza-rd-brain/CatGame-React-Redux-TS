import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore, compose } from "redux";
import styled, { ThemeProvider } from "styled-components";

import Arrows from "./features/Arrows";
import StartScreen from "./features/StartScreen";
import Grid from "./features/Grid";

import barrierRequesting from "./phases/gameStarted/barrierRequesting";
import waitingStartPhase from "./phases/waitingStart";
import running from "./phases/gameStarted/running";
import jumping from "./phases/gameStarted/jumping";
import doubleJumping from "./phases/gameStarted/doubleJumping";
import falling from "./phases/gameStarted/falling";
import grounding from "./phases/gameStarted/grounding";

/*1. стартовый экран
2. котик бежит и прыгает на белом фоне
3. описать, спроектировать сущности и состояния
 */
const Field = styled.div`
  position: relative;
  width: 600px;
  height: 800px;
  margin: 0 auto;
  margin-left: 50px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

const FieldWrap = styled.div`
  position: relative;
  width: 650px;
  height: 800px;
  display: flex;
`;

const EmptyColumn = styled.div`
  background-color: white;
  width: 50px;
  /* border: 3px solid red; */
  height: 800px;
  position: absolute;
  left: 0;
  z-index: 5;
`;

/*коэфицент кратности-?! */
export const duration = 260 * 1.5; /*  * 2; */
const durationFall = 200; /*  * 2; */
/*  750; */
export const deltaDuration = 20;
export const defaultDeltaCoord = 8;
/* export const levelHeight = 70; */
export const levelHeight = 80;
export const catHeight = 25;
export const addJumpHeight = 24;
export const levelNumber = 7;
const levelWithCat = 2;
/*4-потом домики!! */
const levelWithGroung = [0, 2, 4];

export type CatProps = {
  y: number;
};

export type BarrierProps = {
  /*  y: number; */
  x: number;
};

export type MoveDirection = "top" | "bottom";

export type BarrierPhase =
  | "waitingStartGame"
  | "waitingRequest"
  | "movingBarrier"
  | "barrierRequesting";

export type GameState =
  | "waitingStart"
  //
  | "gameStarted.running"
  | "gameStarted.jumpPreparing"
  | "gameStarted.jumpStarted"
  | "gameStarted.jumping"
  | "gameStarted.endingJump"
  | "gameStarted.grounding"
  | "gameStarted.fallPreparing"
  | "gameStarted.falling"
  | "gameStarted.doubleJumpPreparing"
  | "gameStarted.doubleJumping"
  | "gameStarted.endingDoubleJump"

  //
  | "gameStarted.jumpStarted"
  | "gameStarted.jump"
  | "gameStarted.jumpGoing"
  | "gameStarted.fall"
  | "gameStarted.doubleJump"
  | "endGame"
  | "getEndScreen";

export type Action =
  | { type: "clickStartButton" }
  | { type: "jumpRequested"; payload: MoveDirection }
  | { type: "jumpStarted"; moveEffectId: number }
  | { type: "fallStarted"; moveEffectId: number }
  | { type: "rised"; payload: number }
  | { type: "riseEnded" }
  | { type: "falled"; payload: number; startLevel: number; currCatY: number }
  | { type: "grounded" }
  | { type: "effectRemoved" }
  | { type: "jumpGoing"; payload: number }
  | { type: "switchLevel" }
  | { type: "fallGoing"; payload: number }
  | { type: "endOfJump" }
  | { type: "endOfFall" }
  | { type: "catfFall" }
  | { type: "catDoubleJump" }
  //barrier
  | { type: "barrierRequested" }
  | { type: "barrierMoved"; payload: number }
  | { type: "barrierStoped" };

export type KindMoveEffect =
  | { kind: "!prepare-jump" }
  | { kind: "!prepare-doubleJump" }
  | {
      kind: "!removeEffect";
      moveEffectId?: number | null;
      /*  moveEffectId?: number | null; */
    }
  | { kind: "!prepare-fall" }
  | null;

export type CatMove = "jump" | "doubleJump" | "fall" | "run";

export type Level = {
  name: "empty" | "ground";
  startCoord: number;
  endCoord: number;
  levelItem: { cat?: CatItem; barrier?: BarrierItem };
};

export type CatItem = {
  y: number;
  health: number;
};
export type BarrierItem = {
  y: number;
  x: number;
};

export type GameLevelList = Map<string, Level>;

export type State = {
  gameState: GameState;
  moveEffectId: number | null;
  /* moveEffectId: number | null; */
  y: number;
  levelList: GameLevelList;
  levelOfMove: number;
  doMoveEffect: KindMoveEffect;
  doubleJumpPossible: Boolean;
  barrierPhase: BarrierPhase;
};

const getInitialState = (): State => {
  return {
    gameState: "waitingStart",
    moveEffectId: null,
    /* moveEffectId: null, */
    y: 100,
    levelList: getLevelList(),
    levelOfMove: levelWithCat,
    doMoveEffect: null,
    doubleJumpPossible: false,
    barrierPhase: "waitingStartGame",
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
      //рисовка барьера будет на любой стадии!!
      //смотрим на дефолт??!
      //будто нам нужен параллельный флоу!
      /* barrierRequesting(action, state); */
      switch (action.type) {
        case "barrierRequested": {
          return barrierRequesting(action, state);
        }
        case "barrierMoved": {
          return barrierRequesting(action, state);
        }
        case "barrierStoped": {
          return barrierRequesting(action, state);
        }
        /*  default:
          return state; */
      }

      switch (phaseInner) {
        case "running": {
          return running(action, state);
        }
        case "jumpPreparing": {
          return jumping(action, state);
        }
        case "doubleJumpPreparing": {
          return doubleJumping(action, state);
        }
        /* case "jumpStarted": {
          return jumping(action, state);
        } */

        case "jumping": {
          return jumping(action, state);
        }
        case "doubleJumping": {
          return doubleJumping(action, state);
        }
        case "endingJump": {
          return jumping(action, state);
        }
        case "endingDoubleJump": {
          return doubleJumping(action, state);
        }

        case "fallPreparing": {
          return falling(action, state);
        }
        case "falling": {
          return falling(action, state);
        }
        case "grounding":
          return falling(action, state);

        default:
          return state;
      }
    }

    default:
      return state;
  }
};

function App() {
  const [
    gameState,
    levelList,
    levelOfMove,
    doMoveEffect,
    moveEffectId,
    barrierPhase,
  ] = useSelector((state: State) => [
    state.gameState,
    state.levelList,
    state.levelOfMove,
    state.doMoveEffect,
    state.moveEffectId,
    state.barrierPhase,
  ]);
  const dispatch = useDispatch();

  const level = levelList.get(`${levelOfMove}`);
  const currentYCoord =
    level && level.levelItem.cat ? level.levelItem.cat?.y : 0;

  useEffect(() => {
    switch (barrierPhase) {
      case "waitingRequest": {
        /*    console.error("создать таймаут для бега"); */
        /*   const barrierTimeOut = setTimeout(function requestBarrier() {
          dispatch({
            type: "barrierRequested",
          });
        }, 2000); */
        dispatch({
          type: "barrierRequested",
        });
        break;
      }

      case "barrierRequesting": {
        dispatch({
          type: "barrierRequested",
        });
        break;
      }

      case "movingBarrier": {
        const Path = 600;
        const movingTime = 5000;
        const tickTime = 20;
        const moveTicks = movingTime / tickTime;
        const moveInc = Path / moveTicks;

        let tickTracker = 0;
        const moveBarrierId = setInterval(function moveBarrier() {
          tickTracker += 1;

          switch (true) {
            case tickTracker < moveTicks + 1:
              console.log("Inc", moveInc);
              dispatch({
                type: "barrierMoved",
                payload: moveInc,
              });
              break;
            default:
              clearInterval(moveBarrierId);
              dispatch({
                type: "barrierStoped",
              });
            //очистить moveBarrierId
          }
        }, tickTime);

        /*создаем тай-аут
        через 3-5 секунд создадим интервал
        который через время T будет запрашивать 
        пересоздать барьер(список барьеров)
         */
        /*нам не важна внутренняя фаза
        эффект проще вызвать на начале бегаи убить после завершения игры 
        - окончания количества жизней
         */
        break;
      }
      default:
        break;
    }
  }, [barrierPhase]);

  useEffect(() => {
    switch (doMoveEffect?.kind) {
      case "!prepare-jump": {
        // докуда прыгает
        const risingTo = levelHeight + addJumpHeight;
        const risingTime = duration;
        const tickTime = deltaDuration;
        const riseTicks = risingTime / tickTime;
        const riseInc = risingTo / riseTicks;

        let tickTracker = 0;
        const moveEffectId = setInterval(function riseAndFall() {
          tickTracker += 1;

          switch (true) {
            // rised

            case tickTracker < riseTicks:
              dispatch({
                type: "rised",
                payload: riseInc,
              }); /*  */
              break;

            default:
              dispatch({
                type: "riseEnded",
              });
              break;
          }
        }, tickTime);

        dispatch({ type: "jumpStarted", moveEffectId });
        break;
      }

      case "!prepare-fall": {
        const fallingTo = levelHeight;
        const fallingTime = durationFall;
        const tickTime = deltaDuration;
        const fallTicks = fallingTime / tickTime;
        const fallInc = fallingTo / fallTicks;

        const moveEffectId = setInterval(function fall() {
          dispatch({
            type: "falled",
            payload: fallInc,
            startLevel: levelOfMove,
            currCatY: currentYCoord,
          });
        }, tickTime);
        dispatch({ type: "fallStarted", moveEffectId });
        break;
      }

      case "!removeEffect": {
        clearInterval(doMoveEffect.moveEffectId || 0);
        /* dispatch({ type: "grounded" }); */
        dispatch({ type: "effectRemoved" });
        break;
      }
    }
  }, [doMoveEffect]);

  const effectRefJump = React.useRef<number | null>(null);
  effectRefJump.current = moveEffectId;

  /* const effectRefFall = React.useRef<number | null>(null);
  effectRefFall.current = moveEffectId; */

  React.useEffect(function onMount() {
    // do once when mounted
    console.log("mount");
    return function onUnMount() {
      // do once when un-mounted
      console.log("unmount");
      clearInterval(effectRefJump.current || 0);
      /*       clearInterval(effectRefFall.current || 0); */
    };
  }, []);

  const refCat = useRef<HTMLDivElement>(null);
  const refBarrier = useRef<HTMLDivElement>(null);

  const getGameScreen = () => {
    switch (gameState) {
      case "waitingStart":
        return <StartScreen />;

      default:
        return (
          <>
            <>
              <Grid
                refBarrier={refBarrier}
                refCat={refCat}
                levelHeight={levelHeight}
              />

              <Arrows />
            </>
          </>
        );
    }
  };
  return (
    <FieldWrap>
      <EmptyColumn />
      <Field>{getGameScreen()}</Field>
    </FieldWrap>
  );
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
