import { State, Action } from "../../app";

function jump(action: Action, state: State): State {
  switch (action.type) {
    case "jumpGoing": {
      return {
        ...state,
        gameState: "gameStarted.jump",
        y: action.payload,
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
