import { selectors } from "./selectors.js";
import { PLAYERS } from "../constants/appConstants.js";

const appState = {
  startingPlayer : PLAYERS.PLAYER_X,
  currentPlayer : PLAYERS.PLAYER_X,
  filledSquares : [],
}

export const globals = {
  appState,
}