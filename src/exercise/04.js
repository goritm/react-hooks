// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useLocalStorageState} from '../utils'

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  // console.log(`X: ${xSquaresCount}, O: ${oSquaresCount}`)
  return xSquaresCount === oSquaresCount ? 'X' : 'O' // 'X' always first and keeps rotating
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //Verifies that a line has three of the same shapes and returns the winner character
      return squares[a]
    }
  }
  return null
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `The winner is ${winner}!`
    : squares.every(Boolean)
    ? `Draw :/`
    : `Next player: ${nextValue}...`
}

function Board({squares, selectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  // These are the managed state of the component
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null), //The default value is an array with a single element, and that element is an array of 9 null elements
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    0,
  )

  // All of these are the derived states of the component
  const currentSquares = history[currentStep]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  // square is the index of the squares array, if you click the middle square, you get 4
  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return //If there is already a winner, or the selected square has a value, we do nothing so that we dont change the state
    }

    const historyCopy = history.slice(0, currentStep + 1) //Copy of the history so that we override other moves
    const squaresCopy = [...currentSquares] //We create a copy of the squares array so that we dont mutate the state
    squaresCopy[square] = nextValue //We set the value of the square that was selected
    setHistory([...historyCopy, squaresCopy]) // We append the new board to the end of the history
    setCurrentStep(historyCopy.length) //The step is the last index of the history copy
  }

  //First argument is the current value of history, second argument is the current index of the array
  const moves = history.map((stepSquares, step) => {
    const description = step === 0 ? 'Go to game start' : `Go to move #${step}`
    const isCurrentStep = step === currentStep
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {description} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} selectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function App() {
  return <Game />
}

export default App
