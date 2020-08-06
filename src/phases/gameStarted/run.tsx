import { State, Action } from "./../../app";

function run(action: Action, state: State): State {
  switch (action.type) {
    default:
      return state;
  }
}

export default run;
