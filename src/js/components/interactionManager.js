import { selectors } from "../services/selectors.js";
import { INTERACTIONS } from "../constants/appConstants.js";

export function interactionManager() {
  function _addSquareListeners() {
    const TTTBoard = selectors.TTTBoard

    TTTBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(INTERACTIONS.SQUARE_GENERAL_ID)) {
        console.info(event.target);
      }
    });

    TTTBoard.addEventListener("click", (event) => {
      if(event.target.matches(INTERACTIONS.SQUARE_GENERAL_ID)) {
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