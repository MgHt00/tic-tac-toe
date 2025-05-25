import { selectors } from "./selectors.js";
import { PLAYERS } from "../constants/appConstants.js";

const defaults = {
  startingPlayer : PLAYERS.PLAYER_X,
  currentPlayer : PLAYERS.PLAYER_X,
  opponentLevel: 0, // should be 1
  filledSquares : [],
  gameOver: false, 
  winner: null,    
}

const appState = {
  startingPlayer : PLAYERS.PLAYER_X,
  currentPlayer : PLAYERS.PLAYER_X,
  opponentLevel: 0,
  filledSquares : [],
  gameOver: false, 
  winner: null,    
}

export const globals = {
  defaults,
  appState,
}