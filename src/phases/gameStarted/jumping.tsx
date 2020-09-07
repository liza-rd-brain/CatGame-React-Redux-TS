import { State, Action } from "../../app";
import { Level } from "../../app";
function jumping(action: Action, state: State): State {
  switch (action.type) {
    case "jumpRequested": {
      switch (action.payload) {
        case "top": {
          // если двойной прыжок запрошен, заново не запрашивать!!

          return {
            ...state,
            doubleJumpPossible: true,
          };
        }

        default: {
          return state;
        }
      }
    }

    case "jumpStarted": {
    
      return {
        ...state,
        gameState: "gameStarted.jumping",
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
        //20- погрешность на лапки
        const needSwitchLevel = catY+20 >= maxY;

        if (needSwitchLevel) {
          /* console.log("switch"); */
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
        gameState: "gameStarted.endingJump",
        doMoveEffect: { kind: "!removeEffect", moveEffectId: state.moveEffectId },
      };
    }
    case "effectRemoved": {
      /* console.log("второй прыжок или падение"); */
      if (state.doubleJumpPossible) {
    /*     console.log("запрошен двойной прыжок"); */
        return {
          ...state,
          gameState: "gameStarted.doubleJumpPreparing",
          doMoveEffect: { kind: "!prepare-jump" },
          doubleJumpPossible: false,
        };
      } else
        return {
          ...state,
          gameState: "gameStarted.fallPreparing",
          doMoveEffect: { kind: "!prepare-fall" },
        }; /* return state; */
      /*else падаем*/
    }

    case "falled": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);
      /* до тех пор пока catY  не станет мин*/
      const catLevel = newLevelList.get(`${levelOfMove}`);
      const nextLevel = newLevelList.get(`${levelOfMove - 1}`);
      if (catLevel && catLevel.levelItem.cat) {
        //minY - земля
        const groundingLevel = catLevel.name === "ground";
        const minY = catLevel.startCoord;
        const catY = catLevel.levelItem.cat.y;
        const needSwitchLevel = catY <= minY;

        const goingUnderGround = groundingLevel && catY <= minY;

        if (goingUnderGround) {
          return {
            ...state,
            gameState: "gameStarted.grounding",
            doMoveEffect: {
              kind: "!removeEffect",
              moveEffectId: state.moveEffectId,
            },
          };
        }

        let newCatLevel = {
          ...catLevel,
          levelItem: {
            ...catLevel.levelItem,
            cat: {
              ...catLevel.levelItem.cat,
              y: catLevel.levelItem.cat.y - action.payload,
            },
          },
        };
        newLevelList.set(`${levelOfMove}`, newCatLevel);

        switch (true) {
          case needSwitchLevel: {
            if (nextLevel) {
              /* console.log("switch fall"); */
              const catItem = { ...catLevel.levelItem.cat };
              newCatLevel = {
                ...nextLevel,
                levelItem: {
                  ...nextLevel.levelItem,
                  cat: {
                    ...catItem,
                  },
                },
              };
              delete catLevel.levelItem.cat;
              newLevelList.set(`${levelOfMove}`, catLevel);
              newLevelList.set(`${levelOfMove - 1}`, newCatLevel);
              /*  console.log(newLevelList); */
              return {
                ...state,
                levelOfMove: state.levelOfMove - 1,
                levelList: newLevelList,
              };
            }
          }
          case !needSwitchLevel: {
            return {
              ...state,
              levelList: newLevelList,
            };
          }
        }
      }
    }

    default:
      return state;
  }
}

export default jumping;
