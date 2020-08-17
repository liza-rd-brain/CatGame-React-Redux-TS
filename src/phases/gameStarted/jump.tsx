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
      if (catLevel && catLevel.cat) {
        catLevel.cat = { ...catLevel.cat, y: action.payload };
      }
      /* console.log(catLevel); */
      return {
        ...state,
        /* gameState: "gameStarted.jump", */
        y: action.payload,
        levelList: newLevelList,
      };
    }
    case "endOfJump": {
      return {
        ...state,
        gameState: "gameStarted.fall",
        /* gameState: "gameStarted.run", */
        /*     y: action.payload, */
      };
    }
    default:
      return state;
  }
}

export default jump;
