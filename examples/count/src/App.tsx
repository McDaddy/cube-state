import React from 'react';
import countStore from "./stores/count";
import socketStore from "./stores/socket";

const closeSocket = socketStore.connect('wss://echo.websocket.org/', (socket: WebSocket) => {
  setInterval(() => {
    socket.send('time: ' + Date.now());
  }, 2000);
  setTimeout(() => {
    closeSocket();
  }, 9000);
});


function App() {
  const countState = countStore.useStore(s => s);
  const socketState = socketStore.useStore(s => s);

  // countState is readOnly, should use reducer or effect
  // countState.count = 3;

  const addLater = (num: number) => {
    countStore.effects.addLater(1).then(res => {
      // return also has type
      console.log('return from effect:', res.returnType);
    })
  }

  return (
    <div className="App">
      <h3>count: {countState.count}</h3>
      <button onClick={() => countStore.reducers.addNum(1)}>+</button>
      <button onClick={() => countStore.reducers.addNum(-1)}>-</button>
      <button onClick={() => addLater(1)}>add 1 after 2 seconds</button>
      <br />
      <Child count={countState.count} />
      <h3>WebSocket status: {socketState.status}</h3>
      <ul className="socket-msg">
        {
          socketState.messages.map((msg, i) => {
            return <li key={i}>{msg.data}</li>;
          })
        }
      </ul>
    </div>
  );
}


interface IProps {
  count: typeof countStore.stateType.count // use store for typing
  addNum?: typeof countStore.reducers.addNum
  addLater?: typeof countStore.effects.addLater
}
class Child extends React.Component<IProps> {
  render() {
    const { count } = this.props
    return <h4>in child class Component: {count}</h4>
  }
}

export default App;
