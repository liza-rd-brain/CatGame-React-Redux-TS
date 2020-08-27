import { State, Action } from "../../app";

function running(action: Action, state: State): State {
  switch (action.type) {
    case "jumpRequested": {
      const direction = action.payload;
      switch (direction) {
        case "top":
          return {
            ...state,
            gameState: "gameStarted.jumpPreparing",
            doEffect: { kind: "!prepare-jump" },
          };
        case "bottom": {
          return {
            ...state,
            gameState: "gameStarted.fallPreparing",
            doEffect: { kind: "!prepare-fall" },
          };
        }
      }
    }

    default:
      return state;
  }
}

export default running;
