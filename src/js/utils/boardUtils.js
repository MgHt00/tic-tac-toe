import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { STATE_KEYS, WIN_LINE_DIRECTIONS } from "../constants/appConstants.js";
import { PLAYERS, INTERACTIONS, GAME } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";

import { 
  getCurrentGame, 
  setCurrentGame, 
  getCurrentPlayer, 
  setCurrentPlayer, 
  setPlayerXScore, 
  getPlayerXScore, 
  setPlayerOScore, 
  getPlayerOScore } from "../services/globalDataManager.js";

const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
const { PLAYER_X, PLAYER_O } = PLAYERS;

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

/**
 * Determines valid moves for Connect Four from the board state.
 * This is more efficient than checking every empty square, as it only identifies
 * the lowest available cell in each column.
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @returns {Array<[number, number]>} An array of [row, col] coordinates for valid moves.
 */
export function getValidConnectFourMoves(gameBoard) {
  const validMoves = [];
  if (!gameBoard || gameBoard.length === 0 || !gameBoard[0] || gameBoard[0].length === 0) {
    return validMoves;
  }
  const numCols = gameBoard[0].length;
  const numRows = gameBoard.length;

  for (let col = 0; col < numCols; col++) {
    // Find the lowest empty row in the current column by iterating from the bottom up.
    for (let row = numRows - 1; row >= 0; row--) {
      if (gameBoard[row][col] === null) {
        validMoves.push([row, col]);
        break; // Move to the next column once the valid move is found. [le002]
      }
    }
  }
  return validMoves;
}

/* Checks if the current player has won the game. */
export function checkWinCondition(gameBoard, currentPlayer) {
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

  const _flatGameBoard = gameBoard.flat();
  for (const key in _winningCombinationsByBoard) {
    const indices = _winningCombinationsByBoard[key];
    if (indices.every(index => _flatGameBoard[index] === currentPlayer)) {
      return { key, indices }; // Return key and indices for strike-through
    }
  }
  return false; // No win after checking all combinations
}

export function checkConnectFourWinCondition(gameBoard, row, col, currentPlayer) {
  const numRows = gameBoard.length;
  if (numRows === 0) {
    console.error("checkConnectFourWinCondition: gameBoard has no rows.");
    return false;
  }
  const numCols = gameBoard[0] ? gameBoard[0].length : 0;
  if (numCols === 0) {
    console.error("checkConnectFourWinCondition: gameBoard rows are empty.");
    return false;
  }

  function _isCellValidAndMatch(r, c, player) {
    return r >= 0 && r < numRows &&
           c >= 0 && c < numCols &&
           gameBoard[r][c] === player;
  }

  // Directions to check: horizontal, vertical, diagonal down-right, diagonal down-left
  const directions = [
    { dRow: 0, dCol: 1, key: WIN_LINE_DIRECTIONS.ROW }, // Horizontal
    { dRow: 1, dCol: 0, key: WIN_LINE_DIRECTIONS.COLUMN }, // Vertical
    { dRow: 1, dCol: 1, key: WIN_LINE_DIRECTIONS.DIAGONAL_MAIN }, // Diagonal \
    { dRow: 1, dCol: -1, key: WIN_LINE_DIRECTIONS.DIAGONAL_SECONDARY } // Diagonal /
  ];

  for (const { dRow, dCol, key } of directions) {
    let count = 1;
    let winningIndices = [[row, col]];

    // Check in the positive direction (e.g., right, down, down-right, down-left)
    for (let i = 1; i < 4; i++) {
      const r = row + i * dRow;
      const c = col + i * dCol;
      if (_isCellValidAndMatch(r, c, currentPlayer)) {
        count++;
        winningIndices.push([r, c]);
      } else {
        break;
      }
    }

    // Check in the negative direction (e.g., left, up, up-left, up-right)
    for (let i = 1; i < 4; i++) {
      const r = row - i * dRow;
      const c = col - i * dCol;
      if (_isCellValidAndMatch(r, c, currentPlayer)) {
        count++;
        winningIndices.push([r, c]);
      } else {
        break;
      }
    }

    if (count >= 4) {
      return { key, indices: winningIndices };
    }
  }

  return false; // No win found
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

// Checks if a given square element is already filled with a player's mark.
export function isSquareFilled(targetElement) {
  // A square is filled if it has a child element (Connect Four piece)
  // or if it has non-empty text content (Tic-Tac-Toe mark).
  return targetElement.children.length > 0 || targetElement.textContent.trim() !== "";
}

// Disables interactions with the Tic-Tac-Toe and Connect Four board.
export function disableBoardInteractions() {
  if (selectors.TTTBoard) {
    selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
  }
  if (selectors.CFBoard) {
    selectors.CFBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
  }
}

// Enables interactions with the Tic-Tac-Toe and Connect Four board.
export function enableBoardInteractions() {
  const currentGame = getCurrentGame();
  if (currentGame === GAME.TIC_TAC_TOE) {
    if (selectors.TTTBoard) {
      selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  } else if (currentGame === GAME.CONNECT_FOUR) {
    if (selectors.CFBoard) {
      selectors.CFBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  } else {
    console.error("Invalid game:", currentGame);
  }
}

// Switches the current player.
export function flipPlayer() {
  const newPlayer = getCurrentPlayer() === PLAYER_X ? PLAYER_O : PLAYER_X;
  setCurrentPlayer(newPlayer);
}

// This is used to determine where a piece should be placed when a column is clicked.
export function findLowestAvailableRowInColumn(gameBoard, col) {
  if (!gameBoard || !gameBoard[0] || col < 0 || col >= gameBoard[0].length) { // !gameBoard[0] checks whether gameBoard is an empty array.
    return -1; // Invalid input
  }
  const maxRow = gameBoard.length - 1;
  for (let row = maxRow; row >= 0; row--) {
    if (gameBoard[row][col] === null) {
      return row; // This is the lowest empty spot
    }
  }
  return -1; // Column is full
}

/**
 * Generates a top-to-bottom path of cell coordinates for the drop animation.
 * @param {number} row - The final row of the piece.
 * @param {number} col - The column of the piece.
 * @returns {Array<[number, number]>} An array of [row, col] coordinates.
 */
export function getAnimatableCells(row, col) {
  let animatableCells = [];
  for (let r = 0; r <= row; r++) {
    animatableCells.push([r, col]);
  }
  return animatableCells;
}

// Checks if all squares on the board are filled.
export function areAllSquaresFilled(currentGame) {
  const boardSelector = currentGame === GAME.TIC_TAC_TOE ? selectors.TTTBoard : selectors.CFBoard;
  const squaresNodeList = boardSelector.querySelectorAll(_matchingID);
  for (const square of squaresNodeList) {
    if (!isSquareFilled(square)) {
      return false;
    }
  }
  return true;
}

// Increments the score for the winning player.
export function accumulateScore(winningPlayer) {
  if (winningPlayer === PLAYER_X) {
    setPlayerXScore(getPlayerXScore() + 1);
  }
  if (winningPlayer === PLAYER_O) {
    setPlayerOScore(getPlayerOScore() + 1);
  }
}

export function getConnectFourSquareElement(row, col) {
  return document.getElementById(`${INTERACTIONS.CF_SQUARES_ID_INITIAL}${row}-${col}`);
}

export function getValidMoves(gameBoard, currentGame){
  // For Connect Four, get only valid moves (lowest empty cell per column).
  // For Tic-Tac-Toe, all empty squares are valid.
  return currentGame === GAME.CONNECT_FOUR
    ? getValidConnectFourMoves(gameBoard)
    : getEmptySquares(gameBoard);
}
