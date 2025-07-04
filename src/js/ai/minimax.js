import { GAME, INTERACTIONS } from "../constants/appConstants.js";
import { 
  checkWinCondition, 
  checkConnectFourWinCondition, 
  getEmptySquares,
  deepCopyGameBoard,
  getValidMoves } from "../utils/boardUtils.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";

function _evaluateBoard({ gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame, row, col }) {
  if (currentGame === GAME.TIC_TAC_TOE ?
    checkWinCondition(gameBoard, aiPlayerSymbol) :
    checkConnectFourWinCondition(gameBoard, row, col, aiPlayerSymbol)
  ) {
    return 10;
  }

  if (currentGame === GAME.TIC_TAC_TOE ?
    checkWinCondition(gameBoard, opponentPlayerSymbol) :
    checkConnectFourWinCondition(gameBoard, row, col, opponentPlayerSymbol)
  ) {
    return -10;
  }

  const emptySquares = getEmptySquares(gameBoard);
  return emptySquares.length === 0 ? 0 : null;
}

/**
 * The recursive Minimax function with Alpha-Beta Pruning.
 * @param {object} param - The parameters for the current game state.
 * @param {number} alpha - The best score for the Maximizer.
 * @param {number} beta - The best score for the Minimizer.
 */
function _minimax(param, depth, isMaximizingPlayer, alpha, beta) {
  const score = _evaluateBoard(param);

  // Terminal state check
  if (score !== null) {
    if (score === 10) return score - depth; // AI wins, prioritize faster wins
    if (score === -10) return score + depth; // Opponent wins, prioritize delaying losses
    if (score === 0) return 0; // Draw
  }

  const { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame } = param;

  if (currentGame === GAME.CONNECT_FOUR && depth > INTERACTIONS.MINIMAX_DEPTH) {
    return 0; // Return a neutral score because the search depth is reached.
  }

  const validMoves = getValidMoves(gameBoard, currentGame);

  if (validMoves.length === 0) {
    return 0; // No moves left, it's a draw.
  }

  if (isMaximizingPlayer) { // AI's turn
    let bestScore = -Infinity;
    for (const [row, col] of validMoves) {
      gameBoard[row][col] = aiPlayerSymbol; // AI makes a move

      const newParam = { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame, row, col };
      const currentScore = _minimax(newParam, depth + 1, false, alpha, beta); // It's now minimizer's turn
      
      gameBoard[row][col] = null; // Undo the move

      bestScore = Math.max(bestScore, currentScore);
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break; // Beta cutoff: Minimizer has a better option, so Maximizer won't choose this path.
      }
    }
    return bestScore;
  } else { // Opponent's turn
    let bestScore = Infinity;
    for (const [row, col] of validMoves) {
      gameBoard[row][col] = opponentPlayerSymbol; // Opponent

      const newParam = { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame, row, col };
      const currentScore = _minimax(newParam, depth + 1, true, alpha, beta); // It's now maximizer's turn

      gameBoard[row][col] = null; // Undo the move

      bestScore = Math.min(bestScore, currentScore);
      beta = Math.min(beta, bestScore);

      if (beta <= alpha) {
        break; // Alpha cutoff: Maximizer has a better option, so Minimizer won't choose this path.
      }
    }
    return bestScore;
  }
}

export function minimaxMove(initialBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame) {
  let bestScore = -Infinity;
  let bestNextMove = null;
  let depth = 0;
  let isMaximizingPlayer = true;
  let alpha = -Infinity;
  let beta = Infinity;

  const gameBoard = deepCopyGameBoard(initialBoard); // Create a mutable copy, so the original isn't changed.
  const validMoves = getValidMoves(gameBoard, currentGame);

  if (validMoves.length === 0) {
    return null; // No moves left, should be a draw or win, handled by _evaluateBoard
  }

  // Optimization: On the first move of the game, pick a strategic or random-but-fast move.
  // Dynamically calculate the total number of squares (rows * cols) to avoid hardcoded "magic numbers" (9 and 42).
  const totalSquares = gameBoard.length * gameBoard[0].length;
  
  if (getEmptySquares(gameBoard).length === totalSquares) {
    if (currentGame === GAME.TIC_TAC_TOE) {
      console.info("Minimax: First move, picking center.");
      return { row: 1, col: 1 }; // TTT center is a strong opening
    } else {
      // For C4, the center columns are strongest. Pick a random move from the center 3 columns.
      const centerCols = [2, 3, 4];
      const centerMoves = validMoves.filter(
        ([_row, col]) => centerCols.includes(col)
      );
      const [row, col] = centerMoves[generateRandomNumber(0, centerMoves.length - 1)];
      return { row, col };
    }
  }

  for (const [row, col] of validMoves) {
    gameBoard[row][col] = aiPlayerSymbol;
    const param = { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame, row, col };
    
    // After AI's move, it's opponent's (minimizer's) turn.
    const score = _minimax(param, depth, !isMaximizingPlayer, alpha, beta);

    gameBoard[row][col] = null; // Undo the move

    if (score > bestScore) {
      bestScore = score;
      bestNextMove = {row, col};
    }
  }

  // If no move was chosen (e.g., all moves lead to a loss),
  // and there are valid moves, pick the first one as a fallback.
  if (!bestNextMove && validMoves.length > 0) {
    console.warn("Minimax: All moves lead to a loss. Picking first available move.");
    const [row, col] = validMoves[0];
    bestNextMove = { row, col };
  }
  return bestNextMove;
}