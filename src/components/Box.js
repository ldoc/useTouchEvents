import React, {useState,useRef,useCallback} from 'react';
import useTouchEvents from "../hooks/useTouchEvents";

const Box = (props) => {

  const [box,setBox] = useState({x:props.x,y:props.y,s:100,c:'red',a:0})
  const elRef = useRef(null);

  const events = useCallback(e => {
    if(e.action === 'click') setBox((b) => {return {...b,c: b.c === 'red' ? 'yellow' : 'red'}})
    else if (e.action === 'press') setBox((b) => {return {...b,s: b.s + (b.c === 'red' ? 1 : -1)}})
    else if (e.action === 'pan') setBox((b) => {return {...b,x: e.x,y:e.y}})
    else if (e.action === 'pinch') setBox((b) => {return {...b,a: b.a + 1}})
  }, []);

  const action = useTouchEvents(elRef, { handler: events });

  return <div
    ref={elRef}
    style={{
      position: 'absolute',
      top: `${box.y-box.s/2}px`,
      left: `${box.x-box.s/2}px`,
      height: `${box.s}px`,
      width: `${box.s}px`,
      backgroundColor: box.c,
      border: 'solid 1px black',
      transform: `rotate(${box.a}deg)`
    }}>
  </div>
}

export default Box;