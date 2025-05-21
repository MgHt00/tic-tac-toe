import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { PLAYERS, INTERACTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";

export function interactionManager() {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

  function _playAI() {
  }

  function _addHighlight(targetElement) {
    targetElement.classList.add(CSS_CLASS_NAMES.HIGHLIGHT);
  }

  function _removeHighlight(targetElement) {
    targetElement.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
  }

  function _isSquareFilled(targetElement) {
    return globals.appState.filledSquares.includes(targetElement.id.replace("square-", "")); // to remove the "square-" prefix from targetElement.id 
  }

  function _fillSquare(targetElement, player) {
    targetElement.textContent = player;
  }

  function _markSquareAsFilled(targetElement) {
    globals.appState.filledSquares.push(targetElement.id.replace("square-", "")); 
  }

  function _displayCurrentPlayer(){
    selectors.gameInfo.textContent = `${globals.appState.currentPlayer} ${INTERACTIONS.PLAYER_TURN}`;
  }

  function _flipPlayer() {
    globals.appState.currentPlayer = globals.appState.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    console.info(globals.appState.currentPlayer);
  }

  function _handleSquareClick(targetElement) {
    if (!_isSquareFilled(targetElement)) {
      _fillSquare(targetElement, globals.appState.currentPlayer);
      _markSquareAsFilled(targetElement);
      _flipPlayer();
      _displayCurrentPlayer();
      //_playAI();
    }
    // new game မဟုတ်ရင် ကိုယ့်အလှည့်လား ၊ အလှည့်ဆိုရင် အကွက်လွတ်လား ၊ စသဖြင့်
  }

  function _addSquareListeners() {
    const gameBoard = selectors.TTTBoard;

    gameBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(_matchingID)) {
        _addHighlight(event.target);
      }
    });

    gameBoard.addEventListener("mouseout", (event) => {
      if(event.target.matches(_matchingID)) {
        _removeHighlight(event.target);
      }
    });

    gameBoard.addEventListener("click", (event) => {
      if(event.target.matches(_matchingID)) {
        _handleSquareClick(event.target);
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