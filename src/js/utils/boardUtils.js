/* Finds all empty squares on the game board. */
export function getEmptySquares(gameBoard) {
  let emptySquares = [];
  gameBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) {
        emptySquares.push([rowIndex, colIndex]);
      }
    });
  });
  return emptySquares;
}


const _winningCombinationsByBoard = {
  row1: [0, 1, 2],
  row2: [3, 4, 5],
  row3: [6, 7, 8],
  col1: [0, 3, 6],
  col2: [1, 4, 7],
  col3: [2, 5, 8],
  diag1: [0, 4, 8],
  diag2: [2, 4, 6],
};

export function checkWinCondition(gameBoard, currentPlayer) {
  const _flatGameBoard = gameBoard.flat();
  for (const key in _winningCombinationsByBoard) {
    const indices = _winningCombinationsByBoard[key];
    if (indices.every(index => _flatGameBoard[index] === currentPlayer)) {
      return { key, indices }; // Return key and indices for strike-through
    }
  }
  return false; // No win after checking all combinations
}

export function constructVirtualGameBoard(gameBoard, row, col, player) {
  // 1. Deep clone gameBoard
  const virtualGameBoard = gameBoard.map(innerRow => [...innerRow]);

  // 2. Apply the hypothetical move to the virtual board
  virtualGameBoard[row][col] = player;

  return virtualGameBoard;
}