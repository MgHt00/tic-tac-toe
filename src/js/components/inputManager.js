import { selectors } from "../services/selectors.js";
import { AI_LEVELS, PLAYERS } from "../constants/appConstants.js";

export function inputManager() {
  function _setAIRange() {
  const minRange = 0;
  const maxRange = Object.entries(AI_LEVELS).length-1;
  
  selectors.AILevelInput.setAttribute('min', minRange);
  selectors.AILevelInput.setAttribute('max', maxRange);
  }

  function _setDefaultAI() {
    selectors.AILevelInput.value = 1;
  }

  function _nameAI() {
    const selectedLevel = selectors.AILevelInput.value;
    selectors.AILevelLabel.innerHTML = AI_LEVELS[selectedLevel];
  }

  function _namePlayers() {
    selectors.playerXButton.innerHTML = PLAYERS.PLAYER_X;
    selectors.playerOButton.innerHTML = PLAYERS.PLAYER_O;
  }

  function _addAILevelListener() {
    selectors.AILevelInput.addEventListener('input', _nameAI);
  }

  function initializeInput() {
    _setAIRange();
    _setDefaultAI();
    _nameAI();
    _namePlayers();
    _addAILevelListener();
  }

  return {
    initializeInput,
  }
}