import { State, Action } from "../../app";

function grounding(action: Action, state: State): State {
  switch (action.type) {
    case "grounded": {
      return {
        ...state,
        gameState: "gameStarted.running",
        doEffect: null,
        moveEffectId: null,
      };
    }

    default:
      return state;
  }
}

export default grounding;
