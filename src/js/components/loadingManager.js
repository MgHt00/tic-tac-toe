import { restoreDefaults } from "../services/globalDataManager.js";
import { unBlackoutScreen, blackoutScreen } from "../utils/domHelpers.js";
import { selectors } from "../services/selectors.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { GAME, PLAYERS } from "../constants/appConstants.js";
import { globals } from "../services/globals.js";

export function loadingManager(initializeInput) {
  function _initializeGameDisplay(currentGame) {
    if (currentGame === GAME.TIC_TAC_TOE) {
      selectors.gameTitle.innerHTML = GAME.TIC_TAC_TOE_TITLE_ELEMENT;
      selectors.playerXButton.textContent = PLAYERS.PLAYER_X;
      selectors.playerOButton.textContent = PLAYERS.PLAYER_O;
      selectors.CFBoard.classList.add(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
      selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
    } else if (currentGame === GAME.CONNECT_FOUR) {
      selectors.gameTitle.innerHTML = GAME.CONNECT_FOUR_TITLE_ELEMENT;
      selectors.playerXButton.innerHTML = PLAYERS.CONNECT_FOUR_PLAYER_X;
      selectors.playerOButton.innerHTML = PLAYERS.CONNECT_FOUR_PLAYER_O;
      selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
      selectors.CFBoard.classList.remove(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
    } else {
      console.error("Invalid game:", currentGame);
    }
  }

  function _asyncWrapper(fn) {
    return async (...args) => {
      try {
        await fn(...args);
      } catch (error) {
        console.error(error);
      }
    };
  }

  async function preLoad(){
    _initializeGameDisplay(globals.appState.currentGame);
    
    const _initializeInput = _asyncWrapper(initializeInput);
    const _restoreDefaults = _asyncWrapper(() => restoreDefaults({  resetScore: true, resetStartingPlayer: true, resetGameType: true })); // [le004]

    blackoutScreen();

    try {
      await _restoreDefaults();
      await _initializeInput();

      // Wait for all fonts specified in CSS to be loaded and applied by the browser.
      await document.fonts.ready;
    } catch (error) {
      console.error("Error during application pre-load phase:", error);
    } finally {
      unBlackoutScreen(); // hide the loading screen
    }
  }

  return {
    preLoad,
  };
}