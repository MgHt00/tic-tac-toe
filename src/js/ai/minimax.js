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

function _minimax(param, depth, isMaximizingPlayer) {
  const score = _evaluateBoard(param);

  // Terminal state check
  if (score !== null) {
    if (score === 10) return score - depth; // AI wins, prioritize faster wins
    if (score === -10) return score + depth; // Opponent wins, prioritize delaying losses
    if (score === 0) return 0; // Draw
  }

  const { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame } = param;
  const validMoves = getValidMoves(gameBoard, currentGame);

  if (validMoves.length === 0) {
    return 0; // No moves left, it's a draw.
  }

  if (isMaximizingPlayer) { // AI's turn
    let bestScore = -Infinity;
    for (const [row, col] of validMoves) {
      gameBoard[row][col] = aiPlayerSymbol; // AI makes a move
      const newParam = { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame, row, col };
      const currentScore = _minimax(newParam, depth + 1, false); // It's now minimizer's turn
      gameBoard[row][col] = null; // Undo the move
      bestScore = Math.max(bestScore, currentScore);
    }
    return bestScore;
  } else { // Opponent's turn
    let bestScore = Infinity;
    for (const [row, col] of validMoves) {
      gameBoard[row][col] = opponentPlayerSymbol; // Opponent
      const newParam = { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame, row, col };
      const currentScore = _minimax(newParam, depth + 1, true); // It's now maximizer's turn
      gameBoard[row][col] = null; // Undo the move
      bestScore = Math.min(bestScore, currentScore);
    }
    return bestScore;
  }
}

export function minimaxMove(initialBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame) {
  let bestScore = -Infinity;
  let isMaximizingPlayer = true;
  let depth = 1;
  let bestNextMove = null;

  const gameBoard = deepCopyGameBoard(initialBoard); // Create a mutable copy, so the original isn't changed.
  const validMoves = getValidMoves(gameBoard, currentGame); // For Connect Four(lowest empty cell per column), For Tic-Tac-Toe, all empty squares

  if (validMoves.length === 0) {
    return null; // No moves left, should be a draw or win, handled by _evaluateBoard
  }

  for (const [row, col] of validMoves) {
    gameBoard[row][col] = aiPlayerSymbol;
    const param = { gameBoard, aiPlayerSymbol, opponentPlayerSymbol, currentGame, row, col };
    
    // After AI's move, it's opponent's (minimizer's) turn.
    const score = _minimax(param, depth, !isMaximizingPlayer);

    gameBoard[row][col] = null; // Undo the move

    if (score > bestScore) {
      bestScore = score;
      bestNextMove = {row, col};
    }
  }

  return bestNextMove;
}