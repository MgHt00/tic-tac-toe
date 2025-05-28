import { checkWinCondition, getEmptySquares, deepCopyGameBoard } from "../utils/boardUtils.js";

function _evaluateBoard(board, aiPlayerSymbol, opponentPlayerSymbol) {
  if (checkWinCondition(board, aiPlayerSymbol)) {
    return 10;
  }

  if (checkWinCondition(board, opponentPlayerSymbol)) {
    return -10;
  }

  const emptySquares = getEmptySquares(board);
  return emptySquares.length === 0 ? 0 : null;
}

function _minimax(board, depth, isMaximizingPlayer, aiPlayerSymbol, opponentPlayerSymbol) {
  // Pre-checks
  const score = _evaluateBoard(board, aiPlayerSymbol, opponentPlayerSymbol);
    if (score === 10) return score - depth; // AI wins, prioritize faster wins
    if (score === -10) return score + depth; // Opponent wins, prioritize delaying losses
    if (score === 0) return 0; // Draw

  const emptySquares = getEmptySquares(board);

  // If it is a Maximizer's move
  if (isMaximizingPlayer) {
    let bestScore = -Infinity;

    for (const coordinates of emptySquares) {
      const [row, col] = coordinates;
      
      board[row][col] = aiPlayerSymbol; // AI makes a move
      const currentScore = _minimax(board, depth + 1, !isMaximizingPlayer, aiPlayerSymbol, opponentPlayerSymbol);
      board[row][col] = null; // Undo the move

      bestScore = Math.max(currentScore, bestScore);
    }

    return bestScore;
  }

  // If it is a Minimizer's move
  else { 
    let bestScore = Infinity;

    for (const coordinates of emptySquares) {
      const [row, col] = coordinates;
      
      board[row][col] = opponentPlayerSymbol; // Opponent
      const currentScore = _minimax(board, depth + 1, !isMaximizingPlayer, aiPlayerSymbol, opponentPlayerSymbol);
      board[row][col] = null; // Undo the move

      bestScore = Math.min(currentScore, bestScore);
    }

    return bestScore;
  }
}

export function minimaxMove(initialBoard, aiPlayerSymbol, opponentPlayerSymbol) {
  let bestScore = -Infinity;
  let isMaximizingPlayer = true;
  let depth = 1;
  let bestNextMove = null;

  const gameBoard = deepCopyGameBoard(initialBoard); // Create a mutable copy, so the original isn't changed.

  const emptySquares = getEmptySquares(gameBoard);
  if (emptySquares.length === 0) {
    return null;
  }

  for (const coordinates of emptySquares) {
    const [row, col] = coordinates;

    gameBoard[row][col] = aiPlayerSymbol;
    const score = _minimax(gameBoard, depth, !isMaximizingPlayer, aiPlayerSymbol, opponentPlayerSymbol);

    gameBoard[row][col] = null; // Undo the move

    if (score > bestScore) {
      bestScore = score;
      bestNextMove = {row, col};
    }
  }

  return bestNextMove;
}