import { State, Action } from "../../app";

function fall(action: Action, state: State): State {
  switch (action.type) {
    case "fallGoing": {
      const levelOfMove = state.levelOfMove;
      const newLevelList = new Map(state.levelList);
      const catLevel = newLevelList.get(`${levelOfMove}`);
      if (catLevel && catLevel.cat) {
        catLevel.cat = { ...catLevel.cat, y: action.payload };
      }
      return {
        ...state,
        y: action.payload,
        levelList: newLevelList,
      };
    }
    case "endOfFall": {
      return {
        ...state,
        gameState: "gameStarted.run",
        /*  y: action.payload, */
      };
    }
    default:
      return state;
  }
}

export default fall;
