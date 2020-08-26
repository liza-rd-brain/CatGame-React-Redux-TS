import { State, Action } from "../../app";
import { Level } from "../../app";
function jumping(action: Action, state: State): State {
  switch (action.type) {
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
        const needSwitchLevel = catY >= maxY;

        if (needSwitchLevel) {
          console.log("switch");
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
          console.log(newLevelList);
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

    case "falled": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);
      /* до тех пор пока catY  не станет мин*/
      const catLevel = newLevelList.get(`${levelOfMove}`);
      const nextLevel = newLevelList.get(`${levelOfMove - 1}`);
      if (catLevel && catLevel.levelItem.cat && nextLevel) {
        //minY - земля
        const groundingLevel = catLevel.name === "ground";
        const minY = catLevel.startCoord;
        const catY = catLevel.levelItem.cat.y;
        const needSwitchLevel = catY <= minY;

        const goingUnderGround = groundingLevel && catY <= minY;

        if (goingUnderGround) {
          // для ускорения возвращаем y к уровню котика
          {
            /* const newCatLevel = {
            ...catLevel,
            levelItem: {
              ...catLevel.levelItem,
              cat: {
                ...catLevel.levelItem.cat,
                y: minY,
              },
            },
          };
          newLevelList.set(`${levelOfMove}`, newCatLevel);
          console.log(newLevelList) */
          }
          return {
            ...state,
            gameState: "gameStarted.grounding",
            doEffect: { kind: "!ground", moveEffectId: state.moveEffectId },
          };
        } else console.log(newLevelList);

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
            console.log("switch fall");
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
            console.log(newLevelList);
            return {
              ...state,
              levelOfMove: state.levelOfMove - 1,
              levelList: newLevelList,
            };
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
    case "jumpGoing": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);

      const catLevel = newLevelList.get(`${levelOfMove}`);

      if (catLevel && catLevel.levelItem.cat) {
        const newCatLevel = {
          ...catLevel,
          levelItem: {
            ...catLevel.levelItem,
            cat: { ...catLevel.levelItem.cat, y: action.payload },
          },
        };
        newLevelList.set(`${levelOfMove}`, newCatLevel);

        return {
          ...state,
          y: action.payload,
          levelList: newLevelList,
        };
      } else return state;
    }
    case "switchLevel": {
      console.log("switch", state.levelOfMove + 1);

      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);

      const prevCatLevel = newLevelList.get(`${levelOfMove}`);
      const nextLevel = newLevelList.get(`${levelOfMove + 1}`);

      if (prevCatLevel && prevCatLevel.levelItem.cat && nextLevel) {
        const catItem = { ...prevCatLevel.levelItem.cat };
        const newCatLevel = {
          ...nextLevel,
          levelItem: { ...nextLevel.levelItem, cat: catItem },
        };
        delete prevCatLevel.levelItem.cat;

        newLevelList.set(`${levelOfMove}`, prevCatLevel);
        newLevelList.set(`${levelOfMove + 1}`, newCatLevel);
        return {
          ...state,
          levelOfMove: state.levelOfMove + 1,
          levelList: newLevelList,
        };
      } else return { ...state };
    }
    case "endOfJump": {
      return {
        ...state,
        gameState: "gameStarted.fall",
      };
    }
    default:
      return state;
  }
}

export default jumping;
