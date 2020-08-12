import { State, Action } from "../../app";

function fall(action: Action, state: State): State {
  switch (action.type) {
    case "fallGoing": {
      return { ...state, y: action.payload };
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
