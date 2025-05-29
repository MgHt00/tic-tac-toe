import { getEmptySquares, checkWinCondition, constructVirtualGameBoard } from "../utils/boardUtils.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";
import { minimaxMove } from "./minimax.js";

/**
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

/**
 * AI Level 0: Chooses a random empty square.
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @returns {{row: number, col: number} | null} Coordinates for the AI's move, or null.
 */
export function getAILevel0Move(gameBoard) {
  return _findRandomEmptySquareCoordinates(gameBoard);
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
export function getAILevel1Move(gameBoard, aiPlayer, opponentPlayer) {
  const emptySquares = getEmptySquares(gameBoard); // Array of [row, col]

  for (const [row, col] of emptySquares) { // Check for AI win
    const virtualGameBoard = constructVirtualGameBoard(gameBoard, row, col, aiPlayer);
    if (checkWinCondition(virtualGameBoard, aiPlayer)) {
      console.warn(`AI Level 1: Found winning move at [${row}, ${col}]`);
      return { row, col };
    }
  }
  for (const [row, col] of emptySquares) { // Check for opponent win to block
    const virtualGameBoard = constructVirtualGameBoard(gameBoard, row, col, opponentPlayer);
    if (checkWinCondition(virtualGameBoard, opponentPlayer)) {
      console.warn(`AI Level 1: Blocking opponent's winning move at [${row}, ${col}]`);
      return { row, col };
    }
  }
  console.warn("AI Level 1: No immediate strategic move. Picking a random empty square.");
  return _findRandomEmptySquareCoordinates(gameBoard);
}

export function getAILevel2Move(gameBoard, aiPlayer, opponentPlayer) {
  return minimaxMove(gameBoard, aiPlayer, opponentPlayer);
}