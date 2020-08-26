import { State, Action } from "../../app";

function falling(action: Action, state: State): State {
  switch (action.type) {
    case "grounded": {
      return {
        ...state,
        gameState: "gameStarted.running",
        doEffect: null,
        moveEffectId: null,
      };
    }

    case "falled": {
      //
      /* падение до тех пор,пока не встретим ground=>grounding */
      break;
    }
    //
    case "fallGoing": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);
      const catLevel = newLevelList.get(`${levelOfMove}`);
      if (catLevel && catLevel.levelItem.cat) {
        catLevel.levelItem = {
          ...catLevel.levelItem,
          cat: { ...catLevel.levelItem.cat, y: action.payload },
        };
      }
      return {
        ...state,
        y: action.payload,
        levelList: newLevelList,
      };
    }
    case "switchLevel": {
      console.log("switch", state.levelOfMove - 1);

      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);

      const prevCatLevel = newLevelList.get(`${levelOfMove}`);
      const nextLevel = newLevelList.get(`${levelOfMove - 1}`);

      if (prevCatLevel && prevCatLevel.levelItem.cat && nextLevel) {
        const catItem = { ...prevCatLevel.levelItem.cat };
        const newCatLevel = {
          ...nextLevel,
          levelItem: { ...nextLevel.levelItem, cat: catItem },
        };
        delete prevCatLevel.levelItem.cat;

        newLevelList.set(`${levelOfMove}`, prevCatLevel);
        newLevelList.set(`${levelOfMove - 1}`, newCatLevel);
        return {
          ...state,
          levelOfMove: state.levelOfMove - 1,
          levelList: newLevelList,
        };
      } else return { ...state };
    }
    case "endOfFall": {
      console.log(state);
      return {
        ...state,
        gameState: "gameStarted.running",
      };
    }
    default:
      return state;
  }
}

export default falling;
