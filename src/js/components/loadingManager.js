import { selectors } from "../services/selectors.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";

export function loadingManager(initializeInput, restoreDefaults) {
  function _showLoadingSpinner() {
    selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
    selectors.loadingWrapper.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
  }

  function _hideLoadingSpinner() {
    selectors.overlay.classList.add(CSS_CLASS_NAMES.INVISIBLE);
    selectors.loadingWrapper.classList.add(CSS_CLASS_NAMES.INVISIBLE);
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
    const _initializeInput = _asyncWrapper(initializeInput);
    const _restoreDefaults = _asyncWrapper(restoreDefaults);

    _showLoadingSpinner();
    await _restoreDefaults();
    await _initializeInput();
    //await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay (use this if necessary)
    _hideLoadingSpinner();
  }

  return {
    preLoad,
  };

}