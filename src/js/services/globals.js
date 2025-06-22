import { PLAYERS, STATE_KEYS, GAME } from "../constants/appConstants.js";

const defaults = {
  [STATE_KEYS.CURRENT_GAME]: GAME.CONNECT_FOUR, // Default: GAME.TIC_TAC_TOE,
  [STATE_KEYS.STARTING_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.CURRENT_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.OPPONENT_LEVEL]: 0, // Default AI level
  [STATE_KEYS.GAME_BOARD_TTT]: [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ],
  [STATE_KEYS.GAME_BOARD_CF]: [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
  ],
  [STATE_KEYS.GAME_OVER]: false,
  [STATE_KEYS.WINNER]: null,
  [STATE_KEYS.GAME_IN_PROGRESS]: false,
  [STATE_KEYS.PLAYER_X_SCORE]: 0,
  [STATE_KEYS.PLAYER_O_SCORE]: 0,
}

const appState = {
  [STATE_KEYS.CURRENT_GAME]: GAME.CONNECT_FOUR,
  [STATE_KEYS.STARTING_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.CURRENT_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.OPPONENT_LEVEL]: 3, // Default AI level
  [STATE_KEYS.GAME_BOARD_TTT]: [[null, null, null], [null, null, null], [null, null, null]],
  [STATE_KEYS.GAME_BOARD_CF]: [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
  ],
  [STATE_KEYS.GAME_OVER]: false,
  [STATE_KEYS.WINNER]: null,
  [STATE_KEYS.GAME_IN_PROGRESS]: false, 
  [STATE_KEYS.PLAYER_X_SCORE]: 0,
  [STATE_KEYS.PLAYER_O_SCORE]: 0,
}

export const globals = {
  defaults,
  appState,
}