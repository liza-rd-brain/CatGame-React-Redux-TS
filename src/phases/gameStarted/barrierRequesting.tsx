import { State, Action, Level } from "../../app";

const barrierStartX = 0;

//разнести потом методы на отдельные фазы
function barrierRequesting(action: Action, state: State): State {
  switch (action.type) {
    case "barrierRequested": {
      /*  console.error("новый барьер!"); */
      const barrierLevelNumber = Math.floor(Math.random() * 4) + 1;
   /*    const barrierLevelNumber = 1; */
      /*       console.log(barrierLevelNumber); */

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
        /*    console.log("лист с барьером", newLevelList); */

        return {
          ...state,
          levelList: newLevelList,
          barrierPhase: "movingBarrier",
          needChekCollision: true,
        };
      } else return state;
    }
    case "barrierMoved": {
      const newLevelList = new Map(state.levelList);

      //вариант как перебрать без мутации
      newLevelList.forEach((item, key) => {
        if (item.levelItem.barrier) {
          /*  item.levelItem.barrier.x = item.levelItem.barrier.x + action.payload; */
          item = {
            ...item,
            levelItem: {
              ...item.levelItem,
              barrier: {
                ...item.levelItem.barrier,
                x: item.levelItem.barrier.x + action.payload,
              },
            },
          };
          newLevelList.set(key, item);
        }
      });
      /*   console.log(state.levelList);
      console.log(newLevelList); */
      //10 - погрешность на голову
      //60 погрешность на хвост
      const deltaCheckCollision =
        state.barrierXCoord <= 340 + 60 && state.barrierXCoord + 2 >= 340 + 10;

      const needCheckColision = deltaCheckCollision && state.needChekCollision;
      switch (needCheckColision) {
        case true: {
          /*
           */
          const chekingLevel = newLevelList.get(`${state.levelOfMove}`);
          const hasLevelBarrier = chekingLevel?.levelItem.barrier
            ? true
            : false;
          switch (true) {
            case hasLevelBarrier:
              // тут проверка по y
              {
                console.log("столкнулись с котом");
              }
              return {
                ...state,
                levelList: newLevelList,
                barrierPhase: "movingBarrier",
                barrierXCoord: state.barrierXCoord + action.payload,
                // за один цил движения барьера проверка на столкновение одноразовая
                needChekCollision: false,
              };
          }
        }
        default:
          return {
            ...state,
            levelList: newLevelList,
            barrierPhase: "movingBarrier",
            barrierXCoord: state.barrierXCoord + action.payload,
          };
      }
    }
    case "barrierStoped": {
      const newLevelList = new Map(state.levelList);
      newLevelList.forEach((item, key) => {
        if (item.levelItem.barrier) {
          delete item.levelItem.barrier;
        }
      });
      /*   console.log(newLevelList, state.levelList);
       */
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
