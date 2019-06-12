//setInterval(() => postMessage({id: 'jau'}),2000)

let oldTouches = null;
let currentAction = null;
let timers = {};
let pressTimers = {};

const setPress = (id,x,y) => {
  delete timers[id];
  let pTimer = setInterval(() => postMessage({action: 'press',id:id,x,y}),1000/60);
  pressTimers[id] = pTimer;
}

const start = (t,listen) => {
  // init timers to check if it's click or press event
  if(listen.click || listen.press){
    for(let i=0;i<t.length;t++){
      let timer = setTimeout(setPress.bind(this,t[i].id,t[i].x,t[i].y),200);
      timers[t[i].id] = timer;
    }
  }
}

const move = (t,inacT,listen) => {
  if(t.length === 1){
    if(timers[t[0].id]){
      clearTimeout(timers[t[0].id]);
      delete timers[t[0].id];
    }
    else if(pressTimers[t[0].id]){
      clearInterval(pressTimers[t[0].id]);
      delete pressTimers[t[0].id];
    }
    if(inacT.length === 0) postMessage({action: 'pan',id:t[0].id,x: t[0].x, y:t[0].y});
  }
  else if(t.length === 2){

    const oldA = oldTouches.find((oT) => oT.id === t[0].id);
    const dAx = t[0].x - (oldA ? oldA.x : 0);
    const dAy = t[0].y - (oldA ? oldA.y : 0);
    const oldB = oldTouches.find((oT) => oT.id === t[1].id);
    const dBx = t[1].x - (oldB ? oldB.x : 0);
    const dBy = t[1].y - (oldB ? oldB.y : 0);
    console.log({action: 'pinch',id:t[0].id,dAx,dAy,dBx,dBy});
    postMessage({action: 'pinch',id:t[0].id,dAx,dAy,dBx,dBy});
  }
}

const end = (t,listen) => {
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

const processEvent = (e) => {
  currentAction = 'none';

  const touches = e.touches;
  const inactiveTouches = e.inactiveTouches;

  switch(e.type){
    case 'start':
      start(touches,e.listen);
      break;
    case 'move':
      move(touches,inactiveTouches,e.listen) ;
      break;
    case 'end':
      end(touches,e.listen);
      break;
    default: console.log('ERROR');
  }

  oldTouches = e.touches;
}

onmessage = function (event) {
  processEvent(event.data)
  //postMessage("--> " + JSON.stringify(event));
};