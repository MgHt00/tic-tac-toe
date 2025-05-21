import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { PLAYERS, INTERACTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";

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
    console.info(globals.appState.currentPlayer, globals.appState.filledSquares);
  }

  function _displayCurrentPlayer(){
    selectors.gameInfo.textContent = `${globals.appState.currentPlayer} ${INTERACTIONS.PLAYER_TURN}`;
  }

  function _flipPlayer() {
    globals.appState.currentPlayer = globals.appState.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  }

  function _areAllSquaresFilled() {
    return globals.appState.filledSquares.length === INTERACTIONS.TOTAL_SQUARES;
  }

  function _findRandomEmptySquare() {
    let targetElement;
    do {
      const row = generateRandomNumber(1, 3);
      const col = generateRandomNumber(1, 3);
      targetElement = document.getElementById(`square-${row}-${col}`);
    } while (!_areAllSquaresFilled() && _isSquareFilled(targetElement)); // loop as long as the board is not full AND the square is filled
    return targetElement;
  }

  function _playAI() {
    switch (globals.appState.opponentLevel) {
      case 0:
        const targetElement = _findRandomEmptySquare();
        _fillSquare(targetElement, globals.appState.currentPlayer);
        _markSquareAsFilled(targetElement);
        _flipPlayer();
        _displayCurrentPlayer();
        break;

      case 1:
        break;
    
      default:
        break;
    }

  }

  function _handleSquareClick(targetElement) {
    if (!_isSquareFilled(targetElement)) {
      _fillSquare(targetElement, globals.appState.currentPlayer);
      _markSquareAsFilled(targetElement);
      _flipPlayer();
      _displayCurrentPlayer();
      setTimeout(() => { // to give time to show _displayCurrentPlayer() on screen
        _playAI();
      }, 1000);
    } 
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