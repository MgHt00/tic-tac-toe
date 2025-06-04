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

// Defines all possible winning combinations on a 3x3 Tic-Tac-Toe board.
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

/* Checks if the current player has won the game. */
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

/* Creates a deep copy of the game board. */
export function deepCopyGameBoard(gameBoard) {
  return gameBoard.map(innerRow => [...innerRow]);
}

/* Creates a virtual game board with a hypothetical move applied. */
export function constructVirtualGameBoard(gameBoard, row, col, player) {
  // 1. Deep clone gameBoard
  const virtualGameBoard = deepCopyGameBoard(gameBoard);

  // 2. Apply the hypothetical move to the virtual board
  virtualGameBoard[row][col] = player;

  return virtualGameBoard;
}