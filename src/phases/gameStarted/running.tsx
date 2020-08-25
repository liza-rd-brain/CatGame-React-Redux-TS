import { State, Action } from "../../app";

function running(action: Action, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      switch (direction) {
        case "top":
          return {
            ...state,
            gameState: "gameStarted.jumpPreparing",
            doEffect: { kind: "!prepare-jump" },
          };
        /*  case "bottom": {
          return {
            ...state,
            gameState: "gameStarted.fall",
          };
        } */
      }
    }

    default:
      return state;
  }
}

export default running;
