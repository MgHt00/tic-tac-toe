import { selectors } from "../services/selectors.js";
import { AI_LEVELS } from "../constants/appConstants.js";

export function inputManager() {
  function _setHTMLAttributes_AILevelRange() {
  const minRange = 0;
  const maxRange = Object.entries(AI_LEVELS).length-1;
  
  selectors.AILevelInput.setAttribute('min', minRange);
  selectors.AILevelInput.setAttribute('max', maxRange);
  }

  function _setDefaultAILevel() {
    selectors.AILevelInput.value = 1;
  }

  function _setAILevelLabel() {
    const selectedLevel = selectors.AILevelInput.value;
    selectors.AILevelLabel.innerHTML = AI_LEVELS[selectedLevel];
  }

  function _addAILevelListener() {
    selectors.AILevelInput.addEventListener('input', _setAILevelLabel);
  }

  function initializeInput() {
    _setHTMLAttributes_AILevelRange();
    _setDefaultAILevel();
    _setAILevelLabel();
    _addAILevelListener();
  }

  return {
    initializeInput,
  }
}