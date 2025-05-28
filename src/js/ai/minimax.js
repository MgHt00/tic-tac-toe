import { getEmptySquares } from "../utils/boardUtils.js";
import { PLAYERS } from "../constants/appConstants.js";

function minimax(board, depth, isMaximizingPlayer) {
  // Pre-checks will be here

  // If Maximizer or Minimizer has won the game
  if (score === 10) return score - depth; // Prioritize faster wins
  if (score === -10) return score + depth; // Prioritize delaying losses

  // any move left?

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    let emptySquares = getEmptySquares(board);

    for (const coordinates of emptySquares) {
      const [row, col] = coordinates;
      board[row][col] = PLAYERS.PLAYER_X; 
      const score = minimax(board, depth + 1, !isMaximizingPlayer);
      board[row][col] = ''; // Undo the move
      bestScore = Math.max(score, bestScore);
    }
  }

  else {
    let bestScore = Infinity;
  }

  return bestScore;

}