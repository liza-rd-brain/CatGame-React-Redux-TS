import { State, Action } from "../../app";

const barrierStartX = 0;
function barrierRequesting(action: Action, state: State): State {
  switch (action.type) {
    case "barrierRequested": {
      console.error("новый барьер!");
      const barrierLevelNumber = Math.floor(Math.random() * 4) + 1;
      console.log(barrierLevelNumber);

      const newLevelList = new Map(state.levelList);
      const barrierLevel = newLevelList.get(`${barrierLevelNumber}`);
      if (barrierLevel) {
        const newBarrierLevel = {
          ...barrierLevel,
          levelItem: {
            ...barrierLevel.levelItem,
            barrier: { y: barrierLevel.startCoord, x: barrierStartX },
          },
        };

        newLevelList.set(`${barrierLevelNumber}`, newBarrierLevel);
        console.log(newLevelList);

        return {
          ...state,
          levelList: newLevelList,
          barrierPhase: "movingBarrier",
        };
      } else return state;
    }
    case "barrierMoved": {
      const newLevelList = new Map(state.levelList);
      /*нужно найти уровень с барьером и помеять его x
      если уровенй будет несколько, то всем назначаем инкрементированный х*/
      newLevelList.forEach((item, key) => {
        if (item.levelItem.barrier) {
          item.levelItem.barrier.x = item.levelItem.barrier.x + action.payload;
        }
      });

      /* const levelArray = Array.from(newLevelList); */
      console.log(newLevelList);

      return {
        ...state,
        levelList: newLevelList,
        barrierPhase: "movingBarrier",
      };
    }
  }
  return state;
  /*из state вытаскиваем уровень и кладем туда барьер */
  /* return state; */
}
export default barrierRequesting;