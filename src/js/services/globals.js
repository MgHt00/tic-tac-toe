import { selectors } from "./selectors.js";
import { PLAYERS } from "../constants/appConstants.js";

const defaults = {
  startingPlayer : PLAYERS.PLAYER_X,
  currentPlayer : PLAYERS.PLAYER_X,
  //opponentLevel: 1, // should be 1
  gameBoard: [[null, null, null], [null, null, null], [null, null, null]],
  gameOver: false, 
  winner: null,    
}

const appState = {
  startingPlayer : PLAYERS.PLAYER_X,
  currentPlayer : PLAYERS.PLAYER_X,
  opponentLevel: 1,
  gameBoard: [[null, null, null], [null, null, null], [null, null, null]],
  gameOver: false, 
  winner: null,    
}

export const globals = {
  defaults,
  appState,
}