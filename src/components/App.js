import React,{useState,useRef,useCallback} from 'react';
import Box from './Box';

function App() {

  return (
    <div

      className="App"
      style={{
        height: "100%",
        width: "100%",
        margin: "0px",
        padding: "0px",
        textAlign: "center",
        position: "relative",
        fontSize: "3em"
      }}
    >
      <Box x={100} y={100}/>
      <Box x={200} y={200}/>

    </div>
  );
}


export default App;