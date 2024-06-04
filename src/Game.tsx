import React, { useState, useCallback } from "react";
import "./Game.css";

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const BOARD_SIZE = 10;
const MINES_COUNT = 10;

const createBoard = (
  size: number,
  mines: number,
  initialSafeCell?: [number, number]
): Cell[][] => {
  const board: Cell[][] = Array(size)
    .fill(null)
    .map(() =>
      Array(size)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (
      !board[row][col].isMine &&
      !(
        initialSafeCell &&
        row === initialSafeCell[0] &&
        col === initialSafeCell[1]
      )
    ) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].isMine) continue;
      let adjacentMines = 0;
      for (const [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size && board[r][c].isMine) {
          adjacentMines++;
        }
      }
      board[row][col].adjacentMines = adjacentMines;
    }
  }

  return board;
};

const Game: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(() =>
    createBoard(BOARD_SIZE, MINES_COUNT)
  );
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);

  const revealCell = useCallback(
    (row: number, col: number) => {
      if (gameOver) return;

      let newBoard = board;

      if (isFirstClick) {
        newBoard = createBoard(BOARD_SIZE, MINES_COUNT, [row, col]);
        newBoard[row][col].isRevealed = true;
        setIsFirstClick(false);
      } else {
        if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged)
          return;

        const reveal = (r: number, c: number) => {
          if (
            r < 0 ||
            r >= BOARD_SIZE ||
            c < 0 ||
            c >= BOARD_SIZE ||
            newBoard[r][c].isRevealed ||
            newBoard[r][c].isFlagged
          )
            return;
          newBoard[r][c].isRevealed = true;

          if (newBoard[r][c].adjacentMines === 0) {
            const directions = [
              [-1, -1],
              [-1, 0],
              [-1, 1],
              [0, -1],
              [0, 1],
              [1, -1],
              [1, 0],
              [1, 1],
            ];
            directions.forEach(([dr, dc]) => reveal(r + dr, c + dc));
          }
        };

        reveal(row, col);

        if (newBoard[row][col].isMine) {
          setGameOver(true);
          alert("Game Over!");
        }
      }

      setBoard(newBoard);
    },
    [board, gameOver, isFirstClick]
  );

  const toggleFlag = (row: number, col: number) => {
    if (board[row][col].isRevealed || gameOver) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(createBoard(BOARD_SIZE, MINES_COUNT));
    setGameOver(false);
    setIsFirstClick(true);
  };

  return (
    <div>
      <h1>Minesweeper</h1>
      <div>Total Mines: {MINES_COUNT}</div>
      <button onClick={resetGame}>Restart</button>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.isRevealed ? "revealed" : ""}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(rowIndex, colIndex);
                }}
              >
                {cell.isRevealed &&
                  (cell.isMine
                    ? "💣"
                    : cell.adjacentMines > 0
                    ? cell.adjacentMines
                    : "")}
                {!cell.isRevealed && cell.isFlagged && "🚩"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
