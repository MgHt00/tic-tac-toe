import { GAME, INTERACTIONS } from "../constants/appConstants.js";
import { getEmptySquares, checkWinCondition, checkConnectFourWinCondition, constructVirtualGameBoard } from "../utils/boardUtils.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";
import { minimaxMove } from "./minimax.js";

/**
 * Majorly for tic tac toe game, but used with connect four's random coordinate function.
 * Finds coordinates of a random empty square on the board.
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @returns {{row: number, col: number} | null} Coordinates of an empty square, or null if none.
 */
function _findRandomEmptySquareCoordinates(gameBoard) {
  const emptySquares = getEmptySquares(gameBoard); // Array of [row, col]
  if (emptySquares.length === 0) {
    console.error("_findRandomEmptySquareCoordinates: No empty squares found.");
    return null;
  }
  const randomIndex = generateRandomNumber(0, emptySquares.length - 1);
  const [row, col] = emptySquares[randomIndex];
  return { row, col };
}

function _getConnectFourSquareElement(row, col) {
  return document.getElementById(`${INTERACTIONS.CF_SQUARES_ID_INITIAL}${row}-${col}`);
}

/**
 * Determines valid moves for Connect Four from the board state.
 * This is more efficient than checking every empty square, as it only identifies
 * the lowest available cell in each column.
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @returns {Array<[number, number]>} An array of [row, col] coordinates for valid moves.
 */
function _getValidConnectFourMoves(gameBoard) {
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

function _getConnectFourRandomCoordinates(gameBoard) {
  const validMoves = _getValidConnectFourMoves(gameBoard);
  if (validMoves.length === 0) {
    console.error("_getConnectFourRandomCoordinates: No valid moves found.");
    return null;
  }
  const randomIndex = generateRandomNumber(0, validMoves.length - 1);
  const [row, col] = validMoves[randomIndex];
  return { row, col };
}

/**
 * AI Level 0: Chooses a random empty square.
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @returns {{row: number, col: number} | null} Coordinates for the AI's move, or null.
 */
export function getAILevel0Move(gameBoard, currentGame) {
  const coordinates = currentGame === GAME.CONNECT_FOUR ? 
                    _getConnectFourRandomCoordinates(gameBoard) : 
                    _findRandomEmptySquareCoordinates(gameBoard);
  console.info(`AI Level 0: Make a random move at [row; col]: [${coordinates.row}, ${coordinates.col}]`);
  return coordinates;
}

/**
 * AI Level 1:
 * 1. Checks if AI can win in the next move.
 * 2. Checks if opponent can win in the next move, and blocks them.
 * 3. Otherwise, picks a random empty square.
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @param {string} aiPlayer - The symbol of the AI player (e.g., 'X' or 'O').
 * @param {string} opponentPlayer - The symbol of the opponent player.
 * @returns {{row: number, col: number} | null} Coordinates for the AI's move, or null.
 */
export function getAILevel1Move(gameBoard, aiPlayer, opponentPlayer, currentGame) {
  // For Connect Four, get only valid moves (lowest empty cell per column).
  // For Tic-Tac-Toe, all empty squares are valid.
  const validMoves = currentGame === GAME.CONNECT_FOUR
    ? _getValidConnectFourMoves(gameBoard)
    : getEmptySquares(gameBoard);

  // Check for AI win
  for (const [row, col] of validMoves) { 
    const virtualGameBoard = constructVirtualGameBoard(gameBoard, row, col, aiPlayer);
    const winningCombination = currentGame === GAME.TIC_TAC_TOE ? 
                             checkWinCondition(virtualGameBoard, aiPlayer) : 
                             checkConnectFourWinCondition(virtualGameBoard, _getConnectFourSquareElement(row, col), aiPlayer);

    if (winningCombination) {
      console.info(`AI Level 1: Found winning move at [${row}, ${col}]`);
      return { row, col };
    }
  }
  
  // Check for opponent win to block
  for (const [row, col] of validMoves) {
    const virtualGameBoard = constructVirtualGameBoard(gameBoard, row, col, opponentPlayer);
    const winningCombination = currentGame === GAME.TIC_TAC_TOE ? 
                             checkWinCondition(virtualGameBoard, opponentPlayer) : 
                             checkConnectFourWinCondition(virtualGameBoard, _getConnectFourSquareElement(row, col), opponentPlayer);
    if (winningCombination) {
      console.info(`AI Level 1: Blocking opponent's winning move at [${row}, ${col}]`);
      return { row, col };
    }
  }

  // No immediate strategic move
  console.info("AI Level 1: No immediate strategic move. Picking a random empty square.");
  return currentGame === GAME.TIC_TAC_TOE?
                        _findRandomEmptySquareCoordinates(gameBoard) : 
                        _getConnectFourRandomCoordinates(gameBoard);
}

export function getAILevel2Move(gameBoard, aiPlayer, opponentPlayer) {
  const { row, col } =  minimaxMove(gameBoard, aiPlayer, opponentPlayer);
  console.info(`AI Level 2: Make a minimax move at [${row}, ${col}]`);
  return { row, col };
}