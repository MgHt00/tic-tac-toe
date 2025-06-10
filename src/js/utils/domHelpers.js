import { selectors } from "../services/selectors.js";

import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { GAME, PLAYERS, INTERACTIONS, STATE_KEYS } from "../constants/appConstants.js";
import { globals } from "../services/globals.js";

const { PLAYER_X, PLAYER_O } = PLAYERS;

function _showOverlay() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

function _hideOverlay() {
  selectors.overlay.classList.add(CSS_CLASS_NAMES.INVISIBLE);
}

export function _showLoadingSpinner() {
  selectors.loadingWrapper.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

export function _hideLoadingSpinner() {
  selectors.loadingWrapper.classList.add(CSS_CLASS_NAMES.INVISIBLE);
}

export function addHighlight(targetElement) {
  targetElement.classList.add(CSS_CLASS_NAMES.HIGHLIGHT);
}

/*export function removeHighlight(targetElement) {
  targetElement.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
}*/

export function removeHighlight(targetElements) {
  targetElements = Array.isArray(targetElements) ? targetElements : [targetElements];
  targetElements.forEach(element => {
    element.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
  });
}

export function showRecentMove(targetElement) {
  console.log("move");
  addHighlight(targetElement);
  setTimeout(() => {
      removeHighlight(targetElement);
    }, INTERACTIONS.AI_THINKING_TIME_MS);
}

export function makeRestartButtonFilled() {
  selectors.restartButton.classList.remove(CSS_CLASS_NAMES.OUTLINED_BUTTON);
  selectors.restartButton.classList.add(CSS_CLASS_NAMES.FILLED_BUTTON);
}

export function makeRestartButtonOutlined() {
  selectors.restartButton.classList.remove(CSS_CLASS_NAMES.FILLED_BUTTON);
  selectors.restartButton.classList.add(CSS_CLASS_NAMES.OUTLINED_BUTTON);
}

export function removeWinningLineStyles(squareElement) {
  squareElement.classList.remove(
    CSS_CLASS_NAMES.X_WIN_ROW,
    CSS_CLASS_NAMES.X_WIN_COLUMN,
    CSS_CLASS_NAMES.X_WIN_DIAGONAL_MAIN,
    CSS_CLASS_NAMES.X_WIN_DIAGONAL_SECONDARY,
    CSS_CLASS_NAMES.O_WIN_ROW,
    CSS_CLASS_NAMES.O_WIN_COLUMN,
    CSS_CLASS_NAMES.O_WIN_DIAGONAL_MAIN,
    CSS_CLASS_NAMES.O_WIN_DIAGONAL_SECONDARY
  );
}

export function removePlayerMarkStyles(squareElement) {
  squareElement.classList.remove(
    CSS_CLASS_NAMES.PLAYER_X_COLOR, 
    CSS_CLASS_NAMES.PLAYER_O_COLOR  
  );
}

export function blackoutScreen() {
  _showOverlay();
  _showLoadingSpinner();
}

export function unBlackoutScreen() {
  _hideOverlay();
  _hideLoadingSpinner();
}

export function showConfirmationAlert() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
  selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.confirmationAlert.classList.remove(CSS_CLASS_NAMES.INVISIBLE); 
}

export function hideConfirmationAlert() {
  selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.confirmationAlert.classList.add(CSS_CLASS_NAMES.INVISIBLE); 
}

export function displayCurrentPlayer(currentPlayer) {
  if (globals.appState[STATE_KEYS.GAME_IN_PROGRESS]) { // shows default message if the game is new
      selectors.gameInfo.textContent = `${currentPlayer} ${INTERACTIONS.PLAYER_TURN}`;
  }
}

export function highlightCurrentPlayer(currentPlayer) {
  const currentPlayerButton = currentPlayer === PLAYER_X ? selectors.playerXButton : selectors.playerOButton;
  const otherPlayerButton = currentPlayer === PLAYER_X ? selectors.playerOButton : selectors.playerXButton;

  removeHighlight(otherPlayerButton);
  addHighlight(currentPlayerButton);
}

export function updateScoreOnScreen(playerXScore, playerOScore) {
  selectors.playerXScore.textContent = playerXScore;
  selectors.playerOScore.textContent = playerOScore;
}

export function showWinnerOnScreen(winningPlayer) {
  selectors.gameInfo.textContent = `${winningPlayer} ${INTERACTIONS.PLAYER_WIN}`;
}

export function changeGameTitle(game) {
  if (game !== GAME.TIC_TAC_TOE && game !== GAME.CONNECT_FOUR) {
    console.error("Invalid game:", game);
    return;
  }

  const htmlElement = game === GAME.TIC_TAC_TOE ? GAME.TIC_TAC_TOE_TITLE_ELEMENT : GAME.CONNECT_FOUR_TITLE_ELEMENT;
  selectors.gameTitle.innerHTML = htmlElement;
}

export function checkGameRadioInput(game) {
  if (game !== GAME.TIC_TAC_TOE && game !== GAME.CONNECT_FOUR) {
    console.error("Invalid game:", game);
    return;
  }
  if (game === GAME.TIC_TAC_TOE) {
    selectors.radioTTT.checked = true;
    selectors.radioTTT.focus();

  } else if (game === GAME.CONNECT_FOUR) {
    selectors.radioCF.checked = true; 
    selectors.radioCF.focus();
  } 
}

// Sets the display names for the player X and player O buttons.
export function namePlayers(currentGame) {
  if (currentGame === GAME.TIC_TAC_TOE) {
    selectors.playerXButton.textContent = PLAYERS.PLAYER_X;
    selectors.playerOButton.textContent = PLAYERS.PLAYER_O;
  } else if (currentGame === GAME.CONNECT_FOUR) {
    selectors.playerXButton.innerHTML = PLAYERS.CONNECT_FOUR_PLAYER_X;
    selectors.playerOButton.innerHTML = PLAYERS.CONNECT_FOUR_PLAYER_O;
  } else {
    console.error("Invalid game:", currentGame);
  }
}

export function convertPlayerBoxToCircle() {
  selectors.playerXButton.classList.add(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
  selectors.playerOButton.classList.add(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
}

export function convertPlayerBoxToSquare() {
  selectors.playerXButton.classList.remove(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
  selectors.playerOButton.classList.remove(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
}