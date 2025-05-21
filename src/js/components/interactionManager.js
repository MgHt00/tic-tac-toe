import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { PLAYERS, INTERACTIONS } from "../constants/appConstants.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";
import { addHighlight, removeHighlight } from "../utils/domHelpers.js";

export function interactionManager() {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

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
    console.info("_areAllSquaresFilled()");
    return globals.appState.filledSquares.length === INTERACTIONS.TOTAL_SQUARES;
  }

  function _findRandomEmptySquare() {
    let targetElement;
    do {
      const row = generateRandomNumber(1, 3);
      const col = generateRandomNumber(1, 3);
      targetElement = document.getElementById(`square-${row}-${col}`);
    } while (_isSquareFilled(targetElement)); // loop as long as the square is filled
    return targetElement;
  }

  function _handleAITurn() {
    if (_areAllSquaresFilled()) {
      return; // No more moves if the board is full
    }
    setTimeout(() => {
        _playAI();
      }, 1000);
  }

  function _playAI() {
    let targetElement;

    switch (globals.appState.opponentLevel) {
      case 0:
        targetElement = _findRandomEmptySquare();
        break;
      case 1:
        break;
      default:
        break;
    }

    _fillSquare(targetElement, globals.appState.currentPlayer);
    _markSquareAsFilled(targetElement);
    _flipPlayer();
    _displayCurrentPlayer();
  }

  function _handleGameOver() {
    console.info("ALL FILLED");
    // Add game over decorations/logic here (e.g., display message, disable clicks)
  }

  function _handleSquareClick(targetElement) {
    if (_areAllSquaresFilled()) {
      _handleGameOver();
      return;
    }

    if (_isSquareFilled(targetElement)) {
      console.info("Square is already filled");
      return; // Square is already filled, do nothing
    }

    _fillSquare(targetElement, globals.appState.currentPlayer);
    _markSquareAsFilled(targetElement);
    _flipPlayer();
    _displayCurrentPlayer();
    _handleAITurn();
  }

  function _addSquareListeners() {
    const gameBoard = selectors.TTTBoard;

    gameBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(_matchingID)) {
        addHighlight(event.target);
      }
    });

    gameBoard.addEventListener("mouseout", (event) => {
      if(event.target.matches(_matchingID)) {
        removeHighlight(event.target);
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