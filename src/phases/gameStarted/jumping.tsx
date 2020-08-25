import { State, Action } from "../../app";

function jumping(action: Action, state: State): State {
  switch (action.type) {
    case "jumpStarted": {
      return {
        ...state,
        gameState: "gameStarted.jumping",
        jumpEffectId: action.jumpEffectId,
      };
    }
    case "rised": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);

      const catLevel = newLevelList.get(`${levelOfMove}`);
      if (catLevel && catLevel.levelItem.cat) {
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

        return {
          ...state,
          /*  y: action.payload, */
          levelList: newLevelList,
        };
      } else return state;
    }

    case "falled": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);
      /* до тех пор пока catY  не станет мин*/
      const catLevel = newLevelList.get(`${levelOfMove}`);
      if (catLevel && catLevel.levelItem.cat) {
        const minY = catLevel.startCoord;
        const catY = catLevel.levelItem.cat.y;
        /*  const fallTo = minY - action.payload;
        const goingUnderGround = fallTo < 0; */
        const goingUnderGround = catY <= minY;

        const newCatLevel = {
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

        if (goingUnderGround) {
          return {
            ...state,
            gameState: "gameStarted.grounding",
            doEffect: { kind: "!ground", jumpEffectId: state.jumpEffectId },
          };
        } else
          return {
            ...state,
            levelList: newLevelList,
          };
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
