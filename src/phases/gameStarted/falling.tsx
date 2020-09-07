import { State, Action } from "../../app";

function falling(action: Action, state: State): State {
  switch (action.type) {
    case "fallStarted": {
      return {
        ...state,
        gameState: "gameStarted.falling",
        moveEffectId: action.moveEffectId,
      };
    }

    case "falled": {
      /*  console.log(" need fall"); */
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);
      /* до тех пор пока catY  не станет мин*/
      const catLevel = newLevelList.get(`${levelOfMove}`);
      const nextLevel = newLevelList.get(`${levelOfMove - 1}`) || 0;
      if (catLevel && catLevel.levelItem.cat) {
        //minY - земля
        const groundingLevel = catLevel.name === "ground";
        const minY = catLevel.startCoord;
        const catY = catLevel.levelItem.cat.y;
        //20 - погрешность на лапки
        const needSwitchLevel = catY + 30 <= minY;
        const startLevel = action.startLevel;
        const startCatY = action.currCatY;
        /*  const isNotStartLevel = startLevel != levelOfMove; */
        const isNotStartLevel = startCatY != catY;
        const isBottomLevel = catY === 0;
        /*  console.log(startLevel); */

        const goingUnderGround =
          isNotStartLevel && groundingLevel && catY <= minY;

        if (goingUnderGround || isBottomLevel) {
          return {
            ...state,
            gameState: "gameStarted.grounding",
            doMoveEffect: {
              kind: "!removeEffect",
              moveEffectId: state.moveEffectId,
            },
          };
        } /* else console.log(newLevelList); */

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
              /*   console.log("switch fall"); */
              const catItem = { ...newCatLevel.levelItem.cat };
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
      } else return state;
    }
    case "effectRemoved": {
      return {
        ...state,
        gameState: "gameStarted.running",
        doMoveEffect: null,
        moveEffectId: null,
      };
    }

    default:
      return state;
  }
}

export default falling;
