import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { AI_LEVELS, PLAYERS } from "../constants/appConstants.js";
import { showOpponentChangeAlert } from "../utils/domHelpers.js";

export function inputManager(resetGameBoard) {
  function _setOpponetRange() {
  const minRange = 0;
  const maxRange = Object.entries(AI_LEVELS).length-1;
  
  selectors.AILevelInput.setAttribute('min', minRange);
  selectors.AILevelInput.setAttribute('max', maxRange);
  }

  function _changeOpponentLabel() {
    selectors.AILevelLabel.innerHTML = AI_LEVELS[selectors.AILevelInput.value];
  }

  function _setDefaultOpponent() {
    selectors.AILevelInput.value = globals.appState.opponentLevel;
    _changeOpponentLabel();
  }

  function _handleOpponentChange() {
    globals.appState.opponentLevel = parseInt(selectors.AILevelInput.value, 10);
    _changeOpponentLabel();
    //resetGameBoard();
    showOpponentChangeAlert();
  }

  function _namePlayers() {
    selectors.playerXButton.textContent = PLAYERS.PLAYER_X;
    selectors.playerOButton.textContent = PLAYERS.PLAYER_O;
  }

  function _addRangeListener() {
    selectors.AILevelInput.addEventListener('input', _handleOpponentChange);
  }

  function initializeInput() {
    _setOpponetRange();
    _setDefaultOpponent();
    _namePlayers();
    _addRangeListener();
  }

  return {
    initializeInput,
  }
}