import { State, Action } from "../../app";

const barrierStartX = 0;

//разнести потом методы на отдельные фазы
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
        console.log("лист с барьером", newLevelList);

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
      /*проверка на столкновение
      1.проверяем x барьера
      2. если он = catPositionX
      3. проверяем есть ли на levelOfMove barrier
      4.если есть = столкновение!!!
      */
      //вынести наружу X барьера
      //4 - приращение движения барьера по горизонтали
      // учесть длину котика
      //проверка на коллизию - одноразовая!
      //дать флажок в стейт, который будет меняться с каждой перерисовкой.
      //проверено столкновение или нет!!
      const needCheckCollision =
        state.barrierXCoord <= 340 && state.barrierXCoord + 4 >= 340;

      switch (needCheckCollision) {
        case true: {
         /* 
          */
          const chekingLevel = newLevelList.get(`${state.levelOfMove}`);
          const hasLevelBarrier = chekingLevel?.levelItem.barrier ? true : false;
          switch (true) {
            case hasLevelBarrier: {
              console.log("столкнулись с котом");
            }
          }
        }
        default:
          break;
      }
      return {
        ...state,
        levelList: newLevelList,
        barrierPhase: "movingBarrier",
        barrierXCoord: state.barrierXCoord + action.payload,
      };
    }
    case "barrierStoped": {
      const newLevelList = new Map(state.levelList);
      newLevelList.forEach((item, key) => {
        if (item.levelItem.barrier) {
          delete item.levelItem.barrier;
        }
      });
      console.log(newLevelList, state.levelList);
      console.log(newLevelList, state.levelList);
      return {
        ...state,
        levelList: newLevelList,
        barrierPhase: "barrierRequesting",
        barrierXCoord: 0,
      };

      /*  вытащить барьер удалить!!! */
    }
  }
  return state;
  /*из state вытаскиваем уровень и кладем туда барьер */
  /* return state; */
}
export default barrierRequesting;
