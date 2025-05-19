import { selectors } from "../services/selectors.js";
import { INTERACTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";

export function interactionManager() {
  function _addHighlight(targetElement) {
    targetElement.classList.add(CSS_CLASS_NAMES.HIGHLIGHT);
  }

  function _removeHighlight(targetElement) {
    targetElement.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
  }

  function _addSquareListeners() {
    const gameBoard = selectors.TTTBoard;
    const matchingID = INTERACTIONS.SQUARES_GENERAL_ID;

    gameBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(matchingID)) {
        _addHighlight(event.target);
      }
    });

    gameBoard.addEventListener("mouseout", (event) => {
      if(event.target.matches(matchingID)) {
        _removeHighlight(event.target);
      }
    });

    gameBoard.addEventListener("click", (event) => {
      if(event.target.matches(matchingID)) {
        console.info(event.target);
      }
    });
  }
  
  function initializeGameInteraction() {
    _addSquareListeners();
  }

  return {
    initializeGameInteraction,
  }
}