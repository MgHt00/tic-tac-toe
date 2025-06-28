import { GAME } from "../constants/appConstants.js";
import { 
  checkWinCondition, 
  checkConnectFourWinCondition, 
  getEmptySquares,
  deepCopyGameBoard,
  getValidMoves } from "../utils/boardUtils.js";

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

  // Add a depth limit for Connect Four to prevent performance issues (which can seem like an infinite loop).
  // A depth of 5 is a good balance of strength and speed. Tic-Tac-Toe is simple enough to search to the end.
  if (currentGame === GAME.CONNECT_FOUR && depth > 4) {
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

  return bestNextMove;
}