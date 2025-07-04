import { GAME } from "../constants/appConstants.js";
import { getEmptySquares, getValidConnectFourMoves, checkWinCondition, checkConnectFourWinCondition, constructVirtualGameBoard, getValidMoves, getConnectFourSquareElement } from "../utils/boardUtils.js";
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

function _getConnectFourRandomCoordinates(gameBoard) {
  const validMoves = getValidConnectFourMoves(gameBoard);
  if (validMoves.length === 0) {
    console.error("_getConnectFourRandomCoordinates: No valid moves found.");
    return null;
  }
  const randomIndex = generateRandomNumber(0, validMoves.length - 1);
  const [row, col] = validMoves[randomIndex];
  return { row, col };
}

/**
 * Checks for immediate strategic moves: a winning move for the AI or a blocking move against the opponent.
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @param {string} aiPlayer - The symbol of the AI player.
 * @param {string} opponentPlayer - The symbol of the opponent player.
 * @param {string} currentGame - The current game being played.
 * @returns {{move: {row: number, col: number}, type: string} | null} An object with the move and its type ('win' or 'block'), or null if no immediate move is found.
 */
function _findImmediateStrategicMove(gameBoard, aiPlayer, opponentPlayer, currentGame) {
  const validMoves = getValidMoves(gameBoard, currentGame);

  // Check for AI win
  for (const [row, col] of validMoves) {
    const virtualGameBoard = constructVirtualGameBoard(gameBoard, row, col, aiPlayer);
    const winningCombination = currentGame === GAME.TIC_TAC_TOE
      ? checkWinCondition(virtualGameBoard, aiPlayer)
      : checkConnectFourWinCondition(virtualGameBoard, row, col, aiPlayer);

    if (winningCombination) {
      return { move: { row, col }, type: 'win' };
    }
  }

  // Check for opponent win to block
  for (const [row, col] of validMoves) {
    const virtualGameBoard = constructVirtualGameBoard(gameBoard, row, col, opponentPlayer);
    const winningCombination = currentGame === GAME.TIC_TAC_TOE
      ? checkWinCondition(virtualGameBoard, opponentPlayer)
      : checkConnectFourWinCondition(virtualGameBoard, row, col, opponentPlayer);
    if (winningCombination) {
      return { move: { row, col }, type: 'block' };
    }
  }
  return null; // No immediate strategic move
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
 * Determines the move for AI Level 1 ("Smart").
 * This strategy follows a simple hierarchy:
 * 1. Checks for an immediate winning move for the AI.
 * 2. If no winning move is found, it checks for an immediate winning move for the opponent and blocks it.
 * 3. If neither of the above, it makes a random valid move.
 *
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @param {string} aiPlayer - The symbol of the AI player (e.g., 'X' or 'O').
 * @param {string} opponentPlayer - The symbol of the opponent player.
 * @param {string} currentGame - The current game being played (e.g., 'Tic-Tac-Toe' or 'Connect Four').
 * @returns {{row: number, col: number} | null} Coordinates for the AI's move, or null if no moves are possible.
 */
export function getAILevel1Move(gameBoard, aiPlayer, opponentPlayer, currentGame) {
  const strategicMoveResult = _findImmediateStrategicMove(gameBoard, aiPlayer, opponentPlayer, currentGame);
  if (strategicMoveResult) {
    const { move, type } = strategicMoveResult;
    const { row, col } = move;
    if (type === 'win') {
      console.info(`AI Level 1: Found winning move at [${row}, ${col}]`);
    } else {
      console.info(`AI Level 1: Blocking opponent's winning move at [${row}, ${col}]`);
    }
    return { row, col };
  }

  // No immediate strategic move, so pick a random valid move.
  console.info("AI Level 1: No immediate strategic move. Picking a random empty square.");
  const validMoves = getValidMoves(gameBoard, currentGame);
  if (validMoves.length === 0) {
    return null;
  }
  const randomIndex = generateRandomNumber(0, validMoves.length - 1);
  const [row, col] = validMoves[randomIndex];
  return { row, col };
}

/**
 * Determines the move for AI Level 2 ("Brilliant").
 * This strategy enhances Level 1 by incorporating the Minimax algorithm for long-term planning.
 * 1. It first performs a quick check for immediate winning or blocking moves, just like Level 1.
 *    This is an optimization to avoid running the more complex Minimax algorithm unnecessarily.
 * 2. If no immediate move is found, it employs the Minimax algorithm to find the optimal move
 *    by looking several steps ahead.
 * 3. As a fallback, if Minimax doesn't return a move, it defaults to a random move.
 *
 * @param {Array<Array<string|null>>} gameBoard - The current game board state.
 * @param {string} aiPlayer - The symbol of the AI player (e.g., 'X' or 'O').
 * @param {string} opponentPlayer - The symbol of the opponent player.
 * @param {string} currentGame - The current game being played (e.g., 'Tic-Tac-Toe' or 'Connect Four').
 * @returns {{row: number, col: number} | null} Coordinates for the AI's move, or null if no moves are possible.
 */
export function getAILevel2Move(gameBoard, aiPlayer, opponentPlayer, currentGame) {
  // First, check for any immediate winning or blocking moves.
  const strategicMoveResult = _findImmediateStrategicMove(gameBoard, aiPlayer, opponentPlayer, currentGame);
  if (strategicMoveResult) {
    const { move, type } = strategicMoveResult;
    const { row, col } = move;
    if (type === 'win') {
      console.info(`AI Level 2: Found immediate winning move at [${row}, ${col}].`);
    } else {
      console.info(`AI Level 2: Blocking opponent's winning move at [${row}, ${col}].`);
    }
    return { row, col };
  }

  // If no immediate threats, use Minimax for the optimal long-term move.
  const minimaxBestMove = minimaxMove(gameBoard, aiPlayer, opponentPlayer, currentGame);
  if (minimaxBestMove) {
    const { row, col } = minimaxBestMove;
    console.info(`AI Level 2: Make a minimax move at [${row}, ${col}]`);
    return { row, col };
  }
  
  // Fallback in case minimax returns null (e.g., no moves left).
  console.warn("AI Level 2: Minimax returned no move. This shouldn't happen if there are valid moves. Falling back to random move.");
  return getAILevel0Move(gameBoard, currentGame);
}