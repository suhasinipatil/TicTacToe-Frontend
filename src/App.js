import React, { useEffect } from "react";
import { useState } from "react";

function Square({value, onSquareClick}){
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({xIsNext, squares, onPlay}) {
  const winner = calculateWinner(squares);
  let status;

  if(winner){
    status = "Winner: " + winner;
  }else{
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i){
    if(squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = 'X';
    }else{
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  return (
    <React.Fragment>
      <div className="status">{status}</div>
      <div className="board-row">
       <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
       <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
       <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </React.Fragment>
  );
}

function Player(){
  const [response, setResponse] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
  });

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name] : event.target.name,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault(); 
    const name = event.target.elements.name.value;
    const symbol = event.target.elements.symbol.value;

    const res = await fetch('http://localhost:8080/players', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        name,
        symbol
      })
    });
    const data = await res.json();
    setResponse(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name : 
          <input type="text" name="name" value={formData.name} onChange={handleChange}/>
        </label>
        <label>
          Symbol : 
          <input type="radio" name="symbol" value="X" checked={formData.symbol === 'X'} onChange={handleChange}/>
          X
          <input type="radio" name="symbol" value="O" checked={formData.symbol === 'O'} onChange={handleChange}/>
          O
        </label>
        <br/>
        <br/>
        <button type="submit">Create Player</button>
      </form>  
    <p>{JSON.stringify(response)}</p>
    </div>
  )
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080')
    .then(Response => Response.text())
    .then(ResponseData => setMessage(ResponseData));
  });

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove +1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0) {
      description = 'Go to move #' + move;
    }else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <h1 className="h1">{message}</h1>
      <br></br>
      <Player></Player>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}></Board>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i = 0; i < lines.length; i++){
    const[a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}