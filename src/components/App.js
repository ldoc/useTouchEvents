import React,{useState,useRef,useEffect} from 'react';
import Box from './Box';
import useTouchEvents from "../hooks/useTouchEvents";

function App() {
  const [log,setLog] = useState([]);
  const elRef = useRef(null);
  const action = useTouchEvents(elRef, { listen: {pan:true,click:true}});

  useEffect(() => {
    if(action.action && action.action != log[log.length-1])setLog((prev) => [...prev,action])
  },[action])

  return (
    <div
      ref={elRef}
      className="App"
      style={{
        height: "100%",
        width: "100%",
        margin: "0px",
        padding: "0px",
        textAlign: "center",
        position: "relative",
        fontSize: "1em"
      }}
    >
        {log ? log.map(a => <p>{`action: ${a.action} in x: ${a.x} - y: ${a.y}`}</p>) : ''}
      {/* <Box x={100} y={100}/>
      <Box x={200} y={200}/> */}

    </div>
  );
}


export default App;