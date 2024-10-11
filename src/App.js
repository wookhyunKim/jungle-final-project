//실질적인 javascript 구동부(적어도 실습에서는)
import React from 'react';

//클릭하면 onSquareClick 이벤트를 통해 value값을 적어놓고 리턴하는 함수
function Square({value,onSquareClick}){
  return(
    <button className = "square" onClick = {onSquareClick}>
      {value}
    </button>
  );
}

function MyButton(){
  return (
    <button>I'm a button</button>
  );
}

function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <MyButton />
    </div>
  );
}

export default App;