import { selectors } from "../services/selectors.js";
import { AI_LEVELS } from "../constants/appConstants.js";

export function inputManager() {
  function _setHTMLAttributes_AILevelRange() {
  const minRange = 0;
  const maxRange = Object.entries(AI_LEVELS).length;
  
  selectors.AILevelInput.setAttribute('min', minRange);
  selectors.AILevelInput.setAttribute('max', maxRange);

  }

  function _setHTMLAttributes_AILevelLabel() {
    const selectedLevel = selectors.AILevelInput.value;
    console.info(selectedLevel);
  }

  function _addAILevelListner() {

  }

  function initializeInput() {
    _setHTMLAttributes_AILevelRange();
    _setHTMLAttributes_AILevelLabel();
    _addAILevelListner();
  }

  return {
    initializeInput,
  }
}