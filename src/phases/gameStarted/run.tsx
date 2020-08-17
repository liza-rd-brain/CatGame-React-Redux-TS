import { State, Action } from "./../../app";

function run(action: Action, state: State): State {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      switch (direction) {
        case "top":
          /* return {
            ...state,
            gameState: "gameStarted.jump",
          }; */
          return {
            ...state,
            gameState: "gameStarted.jumpStarted",
            testAnimation: true,
          };
        case "bottom": {
          return {
            ...state,
            gameState: "gameStarted.fall",
          };
        }
      }
    }
    default:
      return state;
  }
}

export default run;
