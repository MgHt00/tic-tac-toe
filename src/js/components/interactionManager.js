import { selectors } from "../services/selectors.js";
import { INTERACTIONS } from "../constants/appConstants.js";

export function interactionManager() {
  function _hightlightSquare() {
    
  }

  function _addSquareListeners() {
    const gameBoard = selectors.TTTBoard;
    const matchingID = INTERACTIONS.SQUARES_GENERAL_ID;

    gameBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(matchingID)) {
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