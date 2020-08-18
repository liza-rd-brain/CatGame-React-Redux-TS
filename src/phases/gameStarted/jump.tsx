import { State, Action } from "../../app";

function jump(action: Action, state: State): State {
  switch (action.type) {
    case "jumpStarted": {
      return {
        ...state,
        gameState: "gameStarted.jump",
      };
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

export default jump;
