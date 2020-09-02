import { State, Action } from "../../app";
import { Level } from "../../app";
function doubleJumping(action: Action, state: State): State {
  switch (action.type) {
    case "jumpStarted": {
      /* console.log(state.gameState); */
      return {
        ...state,
        gameState: "gameStarted.doubleJumping",
        moveEffectId: action.moveEffectId,
      };
    }

    case "rised": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);

      const catLevel = newLevelList.get(`${levelOfMove}`);
      const nextLevel = newLevelList.get(`${levelOfMove + 1}`);

      if (catLevel && catLevel.levelItem.cat && nextLevel) {
        const maxY = catLevel.endCoord;
        const catY = catLevel.levelItem.cat.y;
        /*   const newCatY = catLevel.levelItem.cat.y + action.payload; */
        const needSwitchLevel = catY >= maxY;

        if (needSwitchLevel) {
         /*  console.log("switch"); */
          const catItem = { ...catLevel.levelItem.cat };
          const newCatLevel = {
            ...nextLevel,
            levelItem: {
              ...nextLevel.levelItem,
              cat: {
                ...catItem,
                y: catItem.y + action.payload,
              },
            },
          };
          delete catLevel.levelItem.cat;

          newLevelList.set(`${levelOfMove}`, catLevel);
          newLevelList.set(`${levelOfMove + 1}`, newCatLevel);
          /*     console.log(newLevelList); */
          return {
            ...state,
            levelOfMove: state.levelOfMove + 1,
            levelList: newLevelList,
          };
        } else {
          const newCatLevel = {
            ...catLevel,
            levelItem: {
              ...catLevel.levelItem,
              cat: {
                ...catLevel.levelItem.cat,
                y: catLevel.levelItem.cat.y + action.payload,
              },
            },
          };
          newLevelList.set(`${levelOfMove}`, newCatLevel);
        }

        return {
          ...state,
          levelList: newLevelList,
        };
      } else return state;
    }
    case "riseEnded": {
      return {
        ...state,
        gameState: "gameStarted.endingDoubleJump",
        doMoveEffect: { kind: "!removeEffect", moveEffectId: state.moveEffectId },
      };
    }
    case "effectRemoved": {
      /*отсюда нужно падать*/
     /*  console.log("второй прыжок закончен"); */
      return {
        ...state,
        gameState: "gameStarted.fallPreparing",
        doMoveEffect: { kind: "!prepare-fall" },
      };
    }

    default:
      return state;
  }
}

export default doubleJumping;
