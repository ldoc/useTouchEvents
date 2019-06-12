import React,{useEffect,useRef,useState} from 'react';
import Worker from '../workers/test.worker.js';

const useTouchEvents = (ref,config) => {
  const worker = useRef(null);
  const touches = useRef(null);

  const [action,setAction] = useState({action:'none'});

  const processEvent = (event) => {
    worker.current.postMessage({...event,...config});
  }

  const eventData = (e,t) => {

    touches.current = [...Array.from(e.touches),...Array.from(e.changedTouches)];

    const changedTouches = Array.from(e.changedTouches).map(t => {return {x:t.clientX, y:t.clientY, id: t.identifier}});
    const inactiveTouches = Array.from(e.touches).map(t => {return {x:t.clientX, y:t.clientY, id: t.identifier}}).filter(t => changedTouches.map(t => t.id).indexOf(t.id) === -1);

    return {
      touches: changedTouches,//[...changedTouches,...inactiveTouches],
      inactiveTouches: inactiveTouches,
      type: t
    }

  }

  const start = e =>  {processEvent(eventData(e,"start")); e.preventDefault();}
  const move  = e =>  {processEvent(eventData(e,"move")); e.preventDefault();}
  const end   = e =>  {processEvent(eventData(e,"end")); e.preventDefault();}
  const leave = e =>  {processEvent(eventData(e,"leave")); e.preventDefault();}


  useEffect(() => {
    worker.current = new Worker();

    worker.current.onmessage = function (oEvent) {
      //if(oEvent.data.action !== 'none') requestAnimationFrame(config.handler.bind(this, {...oEvent.data,target: touches.current.find((t) => t.identifier === oEvent.data.id).target}));
      if(oEvent.data.action !== action.action) setAction(oEvent.data);
    };

    const t = ref.current;
    t.addEventListener("touchstart", start, false);
    t.addEventListener("touchmove", move, false);
    t.addEventListener("touchend", end, false);
    t.addEventListener("touchleave", leave, false);

    return function cleanup() {
      t.removeEventListener("touchstart", start, false);
      t.removeEventListener("touchmove", move, false);
      t.removeEventListener("touchend", end, false);
      t.removeEventListener("touchleave", leave, false);
    };
  },[])

  return action
}

export default useTouchEvents;