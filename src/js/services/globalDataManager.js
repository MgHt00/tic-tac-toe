import { globals } from "./globals.js";
import { STATE_KEYS, PLAYERS, AI_LEVELS } from "../constants/appConstants.js";

export function restoreDefaults({ resetScore = false, resetStartingPlayer = false }) {
  // Iterate over the keys in globals.defaults to correctly reset globals.appState
  // This ensures that mutable objects like arrays are properly re-initialized
  // and globals.defaults itself is not mutated.
  for (const key in globals.defaults) {
    if (Object.prototype.hasOwnProperty.call(globals.defaults, key)) { // [le002]
      // Skip resetting opponentLevel to preserve the user's chosen difficulty
      if (key === STATE_KEYS.OPPONENT_LEVEL) {
        continue;
      }

      // Preserve scores only if resetScore is false
      if ((key === STATE_KEYS.PLAYER_X_SCORE || key === STATE_KEYS.PLAYER_O_SCORE) && !resetScore) {
        continue;
      } 

      // Preserve startingPlaer if resetStartPlayer is false
      if ((key === STATE_KEYS.STARTING_PLAYER) && !resetStartingPlayer) {
        continue;
      }

      const defaultValue = globals.defaults[key];
      if (Array.isArray(defaultValue)) {
        // Check if it's an array of arrays (e.g., a 2D array like `gameBoard`)
        // by seeing if its first element is also an array.
        if (defaultValue.length > 0 && Array.isArray(defaultValue[0])) { // [le003]
          // Perform a deep copy for 2D arrays
          globals.appState[key] = defaultValue.map(row => [...row]);
        } else {
          // For 1D arrays (like filledSquares or empty arrays), a shallow copy is sufficient
          globals.appState[key] = [...defaultValue];
        }
      } else {
        // Assign primitive values or shallow copy simple objects (if any)
        globals.appState[key] = defaultValue;
      }
    }
  }
  // After defaults are restored, if startingPlayer was preserved (not reset to default),
  // ensure currentPlayer matches the (potentially preserved) startingPlayer.
  if (!resetStartingPlayer) {
    globals.appState[STATE_KEYS.CURRENT_PLAYER] = globals.appState[STATE_KEYS.STARTING_PLAYER];
  }
}

export function updateGameBoardState(targetElement, player) {
  // data-row and data-col are 0-indexed strings, parse them to integers.
  const row = parseInt(targetElement.dataset.row, 10);
  const col = parseInt(targetElement.dataset.col, 10);

  globals.appState.gameBoard[row][col] = player;
}

export function getStartingPlayer() {
  return globals.appState[STATE_KEYS.STARTING_PLAYER];
}

export function setStartingPlayer(newPlayer) {
  if (newPlayer !== PLAYERS.PLAYER_X && newPlayer !== PLAYERS.PLAYER_O) {
    console.error("Invalid starting player value:", newPlayer);
    return; // Or throw an error
  }
  globals.appState[STATE_KEYS.STARTING_PLAYER] = newPlayer;
}

export function getCurrentPlayer() {
  return globals.appState[STATE_KEYS.CURRENT_PLAYER];
}

export function setCurrentPlayer(newPlayer) {
  return globals.appState[STATE_KEYS.CURRENT_PLAYER] =  newPlayer;
}

export function getOpponentLevel() {
  return globals.appState[STATE_KEYS.OPPONENT_LEVEL];
}

export function setOpponentLevel(newLevel) {
  const level = parseInt(newLevel, 10); // Ensure it's a number
  if (isNaN(level) || AI_LEVELS[level] === undefined) {
    console.error("Invalid opponent level value:", newLevel);
    return; // Or throw an error
  }
  globals.appState[STATE_KEYS.OPPONENT_LEVEL] = level;
}

export function isGameInProgressState() {
  return globals.appState[STATE_KEYS.GAME_IN_PROGRESS];
}

export function setGameInProgressState(isInProgress) {
  if (typeof isInProgress !== 'boolean') {
    console.error("Invalid value for game in progress state:", isInProgress);
    return;
  }
  globals.appState[STATE_KEYS.GAME_IN_PROGRESS] = isInProgress;
}

export function getGameBoard() {
  // Return a deep copy to prevent direct modification of the state array from outside
  // if that's a desired level of encapsulation.
  // For this project, direct reference might be fine if mutations are controlled.
  // Let's start with direct reference for simplicity, can be changed if needed.
  return globals.appState[STATE_KEYS.GAME_BOARD];
}

export function isGameOverState() {
  return globals.appState[STATE_KEYS.GAME_OVER];
}

export function setGameOverState(isOver) {
  if (typeof isOver !== 'boolean') {
    console.error("Invalid value for game over state:", isOver);
    return;
  }
  globals.appState[STATE_KEYS.GAME_OVER] = isOver;
}

export function getWinner() {
  return globals.appState[STATE_KEYS.WINNER];
}

export function setWinner(player) {
  // Allow null, PLAYERS.PLAYER_X, PLAYERS.PLAYER_O, or PLAYERS.PLAYER_DRAW
  if (player !== null && player !== PLAYERS.PLAYER_X && player !== PLAYERS.PLAYER_O && player !== PLAYERS.PLAYER_DRAW) {
    console.error("Invalid winner value:", player);
    return;
  }
  globals.appState[STATE_KEYS.WINNER] = player;
}

export function getPlayerXScore() {
  return globals.appState[STATE_KEYS.PLAYER_X_SCORE];
}

export function getPlayerOScore() {
  return globals.appState[STATE_KEYS.PLAYER_O_SCORE];
}

export function setPlayerXScore(score) {
  const newScore = parseInt(score, 10);
  if (isNaN(newScore) || newScore < 0) {
    console.error("Invalid Player X score:", score);
    return;
  }
  globals.appState[STATE_KEYS.PLAYER_X_SCORE] = newScore;
}

export function setPlayerOScore(score) {
  const newScore = parseInt(score, 10);
  if (isNaN(newScore) || newScore < 0) {
    console.error("Invalid Player O score:", score);
    return;
  }
  globals.appState[STATE_KEYS.PLAYER_O_SCORE] = newScore;
}