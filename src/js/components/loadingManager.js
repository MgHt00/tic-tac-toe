import { restoreDefaults } from "../services/globalDataManager.js";
import { blackoutScreen, unBlackoutScreen } from "../utils/domHelpers.js";

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
    const _restoreDefaults = _asyncWrapper(restoreDefaults);

    blackoutScreen();
    await _restoreDefaults();
    await _initializeInput();
    // Following Promise is just for the decoration purpose
    await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay (use this if necessary)
    unBlackoutScreen();
  }

  return {
    preLoad,
  };

}