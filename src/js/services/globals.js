import { PLAYERS, STATE_KEYS } from "../constants/appConstants.js";

const defaults = {
  [STATE_KEYS.STARTING_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.CURRENT_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.OPPONENT_LEVEL]: 1, // Default AI level
  [STATE_KEYS.GAME_BOARD]: [[null, null, null], [null, null, null], [null, null, null]],
  [STATE_KEYS.GAME_OVER]: false,
  [STATE_KEYS.WINNER]: null,
  [STATE_KEYS.GAME_IN_PROGRESS]: false,

}

const appState = {
  [STATE_KEYS.STARTING_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.CURRENT_PLAYER] : PLAYERS.PLAYER_X,
  [STATE_KEYS.OPPONENT_LEVEL]: 1,
  [STATE_KEYS.GAME_BOARD]: [[null, null, null], [null, null, null], [null, null, null]],
  [STATE_KEYS.GAME_OVER]: false,
  [STATE_KEYS.WINNER]: null,
  [STATE_KEYS.GAME_IN_PROGRESS]: false, 
}

export const globals = {
  defaults,
  appState,
}