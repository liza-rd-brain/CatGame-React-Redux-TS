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

      if (catLevel && catLevel.levelItem.cat) {
        catLevel.levelItem = {
          ...catLevel.levelItem,
          cat: { ...catLevel.levelItem.cat, y: action.payload },
        };
      }
      console.log(newLevelList);
      return {
        ...state,
        y: action.payload,
        levelList: newLevelList,
      };
    }
    case "switchLevel": {
      console.log("switch", state.levelOfMove + 1);

      return {
        ...state,
        levelOfMove: state.levelOfMove + 1,
      };
    }
    case "endOfJump": {
      return {
        ...state,
        /*   gameState: "gameStarted.fall", */
        /* gameState: "gameStarted.run", */
        /*     y: action.payload, */
      };
    }
    default:
      return state;
  }
}

export default jump;
