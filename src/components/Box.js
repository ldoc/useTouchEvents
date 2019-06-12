import React, {useState,useRef,useEffect} from 'react';
import useTouchEvents from "../hooks/useTouchEvents";

const Box = (props) => {

  const [box,setBox] = useState({x:props.x,y:props.y,s:100,c:'red',a:0})
  const elRef = useRef(null);
  const action = useTouchEvents(elRef, { listen: {click:true}});

  useEffect(()=>{
    if(action.action === 'click') setBox((b) => {return {...b,c: b.c === 'red' ? 'yellow' : 'red'}})
    else if (action.action === 'press') setBox((b) => {return {...b,s: b.s + (b.c === 'red' ? 1 : -1)}})
    else if (action.action === 'pan') setBox((b) => {return {...b,x: action.x,y:action.y}})
    else if (action.action === 'pinch') setBox((b) => {return {...b,a: b.a + 1}})
  },[action])

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
    {JSON.stringify(action)}
  </div>
}

export default Box;