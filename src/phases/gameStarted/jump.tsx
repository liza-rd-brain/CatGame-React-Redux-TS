import { State, Action } from "../../app";

function jump(action: Action, state: State): State {
  switch (action.type) {
    case "endJump": {
      return {
        ...state,
        gameState: "gameStarted.run",
      };
    }
    default:
      return state;
  }
}

export default jump;
