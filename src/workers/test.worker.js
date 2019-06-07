//setInterval(() => postMessage({id: 'jau'}),2000)

let oldTouches = null;
let currentAction = null;
let timers = {};
let pressTimers = {};

const setPress = (id) => {
  delete timers[id];
  let pTimer = setInterval(() => postMessage({action: 'press',id:id}),1000/60);
  pressTimers[id] = pTimer;
}

const start = (t) => {
  // init timers to check if it's click or press event
  for(let i=0;i<t.length;t++){
    let timer = setTimeout(setPress.bind(this,t[i].id),200);
    timers[t[i].id] = timer;
  }
}

const move = (t,inacT) => {
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
    postMessage({action: 'pinch',id:t[0].id});
  }
}

const end = (t) => {
  for(let i=0;i<t.length;t++){
    if(timers[t[i].id]){
      //click
      postMessage({action: 'click',id:t[i].id});
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
  //console.log(`--> ${e.type} | ${e.touches.reduce((a,b) => {return a + b.id} ,'')}`)
  currentAction = 'none';

  const touches = e.touches;
  const inactiveTouches = e.inactiveTouches;
  const NUM_TOUCHES = e.touches.length;

  switch(e.type){
    case 'start':
      start(touches);
      break;
    case 'move':
      move(touches,inactiveTouches) ;
      break;
    case 'end':
      end(touches);
      break;
    default: console.log('ERROR');
  }

  oldTouches = e.touches;
}

onmessage = function (event) {
  processEvent(event.data)
  //postMessage("--> " + JSON.stringify(event));
};