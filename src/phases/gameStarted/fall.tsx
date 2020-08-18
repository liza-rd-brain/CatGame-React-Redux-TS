import { State, Action } from "../../app";

function fall(action: Action, state: State): State {
  switch (action.type) {
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
      /*  const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);
      const catLevel = newLevelList.get(`${levelOfMove}`);
      if (catLevel && catLevel.levelItem.cat) {
        const yCoord = catLevel.startCoord;
        const newCatLevel = {
          ...catLevel,
          levelItem: {
            ...catLevel.levelItem,
            cat: { ...catLevel.levelItem.cat, y: yCoord },
          },
        };

        newLevelList.set(`${levelOfMove}`, newCatLevel);
      } */
      /* y котика привести к кратному уровням */
      console.log(state);
      return {
        ...state,
        gameState: "gameStarted.run",
      };
    }
    default:
      return state;
  }
}

export default fall;
