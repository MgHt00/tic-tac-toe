import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { STATE_KEYS, WIN_LINE_DIRECTIONS } from "../constants/appConstants.js";
import { PLAYERS, INTERACTIONS, GAME, BOARD_CONSTANTS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js"; // Import BOARD_CONSTANTS

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

export function checkConnectFourWinCondition(gameBoard, targetElement, currentPlayer) {
  const row = parseInt(targetElement.dataset.row, 10);
  const col = parseInt(targetElement.dataset.col, 10);

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

  const maxRowIndex = gameBoard.length - 1;
  const maxColIndex = gameBoard[0].length - 1;

  function _isCellValidAndMatch(row, col, player) {
    return row >= 0 && row <= maxRowIndex && 
           col >= 0 && col <= maxColIndex &&
           gameBoard[row][col] === player;
  }

  const row1Indices = [ [row, col], [row, col - 1], [row, col - 2], [row, col - 3] ]; // current square to left
  if (row1Indices.every(index => _isCellValidAndMatch(index[0], index[1], currentPlayer))) {
    return { key: WIN_LINE_DIRECTIONS.ROW, indices: row1Indices };
  }

  const row2Indices = [ [row, col], [row, col + 1], [row, col + 2], [row, col + 3] ]; // current square to right
  if (row2Indices.every(index => _isCellValidAndMatch(index[0], index[1], currentPlayer))) {
    return { key: WIN_LINE_DIRECTIONS.ROW, indices: row2Indices };
  }

  const columnIndices = [ [row, col], [row + 1, col], [row + 2, col], [row + 3, col] ]; // current square to bottom
  if (columnIndices.every(index => _isCellValidAndMatch(index[0], index[1], currentPlayer))) {
      return { key: WIN_LINE_DIRECTIONS.COLUMN, indices: columnIndices };
  }

  const diagonal1Indices = [ [row, col], [row - 1, col - 1], [row - 2, col - 2], [row - 3, col - 3] ]; // Top-left to bottom-right (e.g., \)
  if (diagonal1Indices.every(index => _isCellValidAndMatch(index[0], index[1], currentPlayer))) {
    return { key: WIN_LINE_DIRECTIONS.DIAGONAL_MAIN, indices: diagonal1Indices };
  }

  const diagonal2Indices = [ [row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3] ]; // Top-right to bottom-left (e.g., /)
  if (diagonal2Indices.every(index => _isCellValidAndMatch(index[0], index[1], currentPlayer))) {
    return { key: WIN_LINE_DIRECTIONS.DIAGONAL_SECONDARY, indices: diagonal2Indices };
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

// Checks if a given square element is already filled with a player's mark.
export function isSquareFilled(targetElement) {
  return targetElement.textContent !== "";
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

// Checks whether the square below is filled. For Connect Four board
export function isBelowSquareFilled(targetElement) {
  const row = parseInt(targetElement.dataset.row, 10);
  const col = parseInt(targetElement.dataset.col, 10);
  if (row === BOARD_CONSTANTS.CONNECT_FOUR_MAX_ROW_INDEX) { // checking whether it is the bottom most row
    return true;
  };

  const elementToCheck = document.getElementById(`${INTERACTIONS.CF_SQUARES_ID_INITIAL}${row + 1}-${col}`);
  return elementToCheck && elementToCheck.textContent !== "";
}

// Checks if all squares on the board are filled.
export function areAllSquaresFilled(currentGame) {
  const selector = currentGame === GAME.TIC_TAC_TOE ? selectors.TTTBoard : selectors.CFBoard;
  const squaresNodeList = selector.querySelectorAll(_matchingID);
  for (const square of squaresNodeList) {
    if (square.textContent === "") {
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
