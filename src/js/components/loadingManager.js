import { restoreDefaults } from "../services/globalDataManager.js";
import { unBlackoutScreen, blackoutScreen } from "../utils/domHelpers.js";

export function loadingManager(initializeInput) {

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
    const _initializeInput = _asyncWrapper(initializeInput);
    const _restoreDefaults = _asyncWrapper(() => restoreDefaults({ resetScore : true, resetStartingPlayer: true })); // [le004]

    blackoutScreen();

    try {
      await _restoreDefaults();
      await _initializeInput();

      // Wait for all fonts specified in CSS to be loaded and applied by the browser.
      await document.fonts.ready;
      //console.log("All fonts have been loaded and applied."); // For debugging
    } catch (error) {
      console.error("Error during application pre-load phase:", error);
    } finally {
      // Always attempt to hide the loading screen.
      unBlackoutScreen();
    }
  }

  return {
    preLoad,
  };
}