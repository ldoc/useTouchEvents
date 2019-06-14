
// Auxiliar variables
let oldTouches = [];
let timers = {};
let pressTimers = {};
let cfg = {}
let listen = {};

// Messages from hooks that listen basic touch events
onmessage = function (event) {
  if(!event.data.config) processEvent(event.data);
  else initializeConfig(event.data.config)
};

const initializeConfig = (config) => {
  const l = config.listen;
  cfg = config;
  listen = {...l,
    c_or_p: !!l.click || !!l.press, // click or press events
    p_or_s: !!l.pan || !!l.swipe,
    move: !!l.pan || !!l.pinch || !!l.rotate, // actions that need move event
    move2t: !!l.pinch || !!l.rotate // actions that need two move events
  }
}

// Dispatch a concrete event
const processEvent = (e) => {

  const t = e.touches;

  // console.log('EVENT -> ' + e.type)
  // console.log('OLD -> ' + JSON.stringify(oldTouches))
  // console.log('NOW -> ' + JSON.stringify(e.touches))

  switch(e.type){
    case 'start':
      start(t.filter((t) => !t.event));
      oldTouches = t;
      break;
    case 'move':
      move(t);
      oldTouches = t.map(to => {return !to.inactive ?  {...to,moving:true} : to});
      break;
    case 'end':
      end(t);
      oldTouches = t;
      break;
    default: console.log('ERROR');


  }
}



// START event
const start = (t) => {
  // init timers to check if it's click or press event
  if(listen.c_or_p){
    for(let i=0;i<t.length;t++){
      let timer = setTimeout(listen.press ? setPress.bind(this,t[i].id,t[i].x,t[i].y) : null,200);
      timers[t[i].id] = timer;
    }
  }
}

// MOVE event
const move = (t) => {

  // Remove click or press events associated to this touch events
  for(let i=0 ; i<t.length ; i++){
    const ot = oldTouches.find(ot => ot.id === t[i].id);
    const dx = ot.x - t[i].x;
    const dy = ot.y - t[i].y;
    const inc = Math.sqrt(dx*dx + dy*dy);
    // console.log(inc);
    if(!ot.moving && listen.c_or_p){

      if( inc > 5.0){
        if(timers[t[i].id]){
          // console.log('CANCEL CLICK')
          clearTimeout(timers[t[i].id]);
          delete timers[t[i].id];
        }
        else if(pressTimers[t[i].id]){
          // console.log('CANCEL PRESS')
          clearInterval(pressTimers[t[i].id]);
          delete pressTimers[t[i].id];
        }
      }
    }

    if(listen.move){
      if(listen.p_or_s){
        if(!ot.moving){
          timers[ot.id] = setTimeout(listen.swipe ? () => postMessage({action: 'swipe',id:t[i].id,x: t[i].x, y:t[i].y}) : null,200);
        }
        else if(!timers[ot.id] && ot.moving){
          postMessage({action: 'pan',id:t[i].id,x: t[i].x, y:t[i].y})
        }
      }
    }
  }

  // if(listen.move){
  //   if(listen.p_or_s){
  //     for(let i=0 ; i<t.length ; i++){

  //       if(t.moving){
  //         timers[t[i].id] = setTimeout(listen.press ? setPress.bind(this,t[i].id,t[i].x,t[i].y) : null,200);
  //       }

  //       const ot = oldTouches.find(ot => ot.id === t[i].id);
  //       const dx = ot.x - t[i].x;
  //       const dy = ot.y - t[i].y;
  //       const inc = Math.sqrt(dx*dx + dy*dy);
  //       console.log(inc);
  //       if(inc > 2.0){
  //         if(listen.pan && inc > 2.0 && inc < 20.0) postMessage({action: 'pan',id:t[i].id,x: t[i].x, y:t[i].y});
  //         else if(listen.swipe && inc >= 20.0) postMessage({action: 'swipe',id:t[i].id,x: t[i].x, y:t[i].y});
  //       }
  //     }
  //   }

  // }



  // console.log('move')
  // if(listen.c_or_p){
  //   if(timers[t[0].id]){
  //     console.log('CANCELADO CLICK')
  //     clearTimeout(timers[t[0].id]);
  //     delete timers[t[0].id];
  //   }
  //   else if(pressTimers[t[0].id]){
  //     clearInterval(pressTimers[t[0].id]);
  //     delete pressTimers[t[0].id];
  //   }
  // }
  // if(listen.move){
  //   if(t.length === 1){
  //     if(!listen.move2t){
  //       for(let i=0;i<t.length;t++) postMessage({action: 'pan',id:t[i].id,x: t[i].x, y:t[i].y});
  //     }
  //     else if(listen.move2t && inacT.length === 0 && oldTouches.length === 1 && listen.pan) postMessage({action: 'pan',id:t[0].id,x: t[0].x, y:t[0].y});

  //   }
  //   else if(t.length === 2 && oldTouches.length === 2 && listen.move2t){

  //     const oldA = oldTouches.find((oT) => oT.id === t[0].id);
  //     const dAx = t[0].x - (oldA ? oldA.x : 0);
  //     const dAy = t[0].y - (oldA ? oldA.y : 0);
  //     console.log(oldA)
  //     console.log(t[0])
  //     const oldB = oldTouches.find((oT) => oT.id === t[1].id);
  //     const dBx = t[1].x - (oldB ? oldB.x : 0);
  //     const dBy = t[1].y - (oldB ? oldB.y : 0);
  //     console.log(oldB)
  //     console.log(t[1])
  //     console.log(`${dAx} - ${dAy} # ${dBx} - ${dBy}`)
  //     const action2t = dAx * dBx < 0.0 && dAy * dBy < 0.0 ? 'pinch' : 'rotate';
  //     console.log(action2t)
  //     postMessage({action: action2t,id:t[0].id,dAx,dAy,dBx,dBy});
  //   }
  // }
}

// END event
const end = (t) => {
  for(let i=0;i<t.length;t++){
    if(timers[t[i].id]){
      //click
      postMessage({action: 'click',id:t[i].id,x: t[i].x, y:t[i].y});
      clearTimeout(timers[t[i].id]);
      delete timers[t[i].id];
      postMessage({action: 'none'});
    }
    else if(pressTimers[t[i].id]){
      postMessage({action: 'none'});
      clearInterval(pressTimers[t[i].id]);
      delete pressTimers[t[i].id];
    }
    else{
      postMessage({action: 'none'});
    }
  }
}

// Recursively make a press action
const setPress = (id,x,y) => {
  delete timers[id];
  let pTimer = setInterval(() => postMessage({action: 'press',id:id,x,y}),1000/60);
  pressTimers[id] = pTimer;
}