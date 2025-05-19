import { selectors } from "../services/selectors.js";

export function loadingManager(initializeInput) {
  function _showLoadingSpinner() {
    selectors.overlay.classList.remove("invisible");
    selectors.loadingWrapper.classList.remove("invisible");
  }

  function _hideLoadingSpinner() {
    selectors.overlay.classList.add("invisible");
    selectors.loadingWrapper.classList.add("invisible");
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

    _showLoadingSpinner();
    await _initializeInput();
    //await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay (use this if necessary)
    _hideLoadingSpinner();
  }

  return {
    preLoad,
  };

}