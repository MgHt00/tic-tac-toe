import { selectors } from "../services/selectors.js";
import {
  getCurrentGame,
  setCurrentGame,
  getStartingPlayer,
  setStartingPlayer,
  getOpponentLevel,
  setOpponentLevel,
  isGameInProgressState,
  getPlayerXScore,
  getPlayerOScore,
} from "../services/globalDataManager.js";
import { AI_LEVELS, GAME, PLAYERS } from "../constants/appConstants.js";
import { 
  showConfirmationAlert, 
  hideConfirmationAlert, 
  unBlackoutScreen, 
  updateScoreOnScreen,
  changeGameTitle,
  checkGameRadioInput,
  namePlayers, } from "../utils/domHelpers.js";
import { globals } from "../services/globals.js";

/**
 * Manages user input for game settings like AI difficulty and starting player,
 * as well as the restart button functionality.
 * @param {function} resetGameBoard - Function to reset the game board and state.
 * @param {function} initializeGameInteraction - Function to initialize or re-initialize game interactions.
 */
export function inputManager(resetGameBoard, initializeGameInteraction) {
  let _confirmedOpponentLevel = null; // Stores the AI level that is currently active.
  let _confirmedStartingPlayer = null; // Stores the starting player that is currently active.
  let _confirmedGame = null; // Stores the game that is currently active.
  
  // To store references to the event handlers for easy removal.
  let _boundAlertOKHandler = null;
  let _boundAlertCancelHandler = null;
  let _boundEscHandler = null;

  // Sets the min and max attributes for the AI difficulty range input based on available AI_LEVELS.
  function _setOpponentRange() {
    const minRange = 0;
    const maxRange = Object.keys(AI_LEVELS).length - 1;
    
    selectors.AILevelInput.setAttribute('min', minRange.toString());
    selectors.AILevelInput.setAttribute('max', maxRange.toString());
  }

  // Updates the AI difficulty label based on the current slider value.
  function _updateOpponentLabelFromSlider() {
    selectors.AILevelLabel.innerHTML = AI_LEVELS[selectors.AILevelInput.value];
  }

  // Initializes the current Game from global state on page load.
  function _initializeCurrentGame() {
    _confirmedGame = getCurrentGame();
  }

  // Initializes the opponent level settings from global state on page load.
  function _initializeOpponentSettings() {
    const initialLevel = getOpponentLevel();
    selectors.AILevelInput.value = initialLevel.toString();
    _confirmedOpponentLevel = initialLevel;
    _updateOpponentLabelFromSlider();
  }

  // Initializes the starting player from global state on page load.
  function _initializeStartingPlayer() {
    _confirmedStartingPlayer = getStartingPlayer();
  }

  // Removes listeners from the confirmation alert buttons.
  function _removeConfirmationAlertListeners() {
    if (_boundAlertOKHandler) {
      selectors.confirmationAlertOK.removeEventListener('click', _boundAlertOKHandler);
      _boundAlertOKHandler = null;
    }
    if (_boundAlertCancelHandler) {
      selectors.confirmationAlertCancel.removeEventListener('click', _boundAlertCancelHandler);
      _boundAlertCancelHandler = null;
    }
    if (_boundEscHandler) {
      document.removeEventListener('keydown', _boundEscHandler);
      _boundEscHandler = null;
    }
  }

  /**
   * Adds listeners to the confirmation alert buttons for an opponent level change.
   * @param {number} newLevelAttempted - The AI level the user tried to select.
   * @param {number} levelToRevertTo - The AI level to revert to if the change is cancelled.
   */
  function _addOpponentChangeConfirmationListeners(newLevelAttempted, levelToRevertTo) {
    _removeConfirmationAlertListeners(); // Ensure no duplicate listeners

    _boundAlertOKHandler = () => {
      setOpponentLevel(newLevelAttempted);
      _confirmedOpponentLevel = newLevelAttempted; // Confirm the new level
      resetGameBoard({ resetScore: true, resetStartingPlayer: false });
      updateScoreOnScreen(getPlayerXScore(), getPlayerOScore());
      hideConfirmationAlert(); 
      _removeConfirmationAlertListeners(); // Clean up after action
      console.info("%cNew opponent Level: ", "color: yellow;", _confirmedOpponentLevel);
    };

    _boundAlertCancelHandler = () => {
      selectors.AILevelInput.value = levelToRevertTo.toString();
      _updateOpponentLabelFromSlider(); // Update label to match reverted slider
      unBlackoutScreen();
      hideConfirmationAlert(); 
      _removeConfirmationAlertListeners(); // Clean up after action
    };

    _boundEscHandler = (event) => {
      if (event.key === 'Escape') {
        _boundAlertCancelHandler();
      }
    };

    selectors.confirmationAlertOK.addEventListener('click', _boundAlertOKHandler); 
    selectors.confirmationAlertCancel.addEventListener('click', _boundAlertCancelHandler);
    document.addEventListener('keydown', _boundEscHandler);
  }

  /**
   * Adds listeners to the confirmation alert buttons for a starting player change.
   * @param {string} newStartingPlayer - The player symbol (X or O) the user tried to select.
   * @param {string} startingPlayerToRevertTo - The player symbol to revert to if the change is cancelled.
   */
  function _addStartingPlayerChangeConfirmationListeners(newStartingPlayer, startingPlayerToRevertTo) {
    _removeConfirmationAlertListeners(); // Ensure no duplicate listeners

    _boundAlertOKHandler = () => {
      setStartingPlayer(newStartingPlayer);
      _confirmedStartingPlayer = newStartingPlayer; // Confirm the new starting player
      resetGameBoard({ resetScore: true, resetStartingPlayer: false });
      updateScoreOnScreen(getPlayerXScore(), getPlayerOScore());
      hideConfirmationAlert(); 
      _removeConfirmationAlertListeners(); // Clean up after action
      initializeGameInteraction();
      console.info("%cNew starting player: ", "color: yellow;", _confirmedStartingPlayer);
    }

    _boundAlertCancelHandler = () => {
      // Revert the starting player in the global state and the internal confirmed state.
      setStartingPlayer(startingPlayerToRevertTo);
      _confirmedStartingPlayer = startingPlayerToRevertTo; // Confirm the new starting player
      unBlackoutScreen();
      hideConfirmationAlert();
    };

     _boundEscHandler = (event) => {
      if (event.key === 'Escape') {
        _boundAlertCancelHandler();
      }
    };

    selectors.confirmationAlertOK.addEventListener('click', _boundAlertOKHandler); 
    selectors.confirmationAlertCancel.addEventListener('click', _boundAlertCancelHandler);
    document.addEventListener('keydown', _boundEscHandler);
  }

  function _addGameChangeConfirmationListeners(newSelectedGame, gameToRevertTo) {
    _removeConfirmationAlertListeners();

    _boundAlertOKHandler = () => {
      setCurrentGame(newSelectedGame);
      _confirmedGame = newSelectedGame;
      resetGameBoard({ resetScore: true });
      updateScoreOnScreen(getPlayerXScore(), getPlayerOScore());
      hideConfirmationAlert(); 
      _removeConfirmationAlertListeners(); // Clean up after action
      initializeGameInteraction();
      console.info("%cNew Game: ", "color: orange;", _confirmedGame);
    };

    _boundAlertCancelHandler = () => {
      setCurrentGame(gameToRevertTo);
      checkGameRadioInput(gameToRevertTo);
      _confirmedGame = gameToRevertTo;
      unBlackoutScreen();
      hideConfirmationAlert();
    };

    _boundEscHandler = (event) => {
      if (event.key === 'Escape') {
        _boundAlertCancelHandler();
      }
    };

    selectors.confirmationAlertOK.addEventListener('click', _boundAlertOKHandler); 
    selectors.confirmationAlertCancel.addEventListener('click', _boundAlertCancelHandler);
    document.addEventListener('keydown', _boundEscHandler);
  }

  // Determines if a game is considered "in progress".
  // A game is in progress if the board is not empty or if scores are not zero.
  function _isGameInProgress() {
    const gameInProgress = isGameInProgressState();
    const isScoreZero = getPlayerXScore() === 0 && getPlayerOScore() === 0;
    return gameInProgress || !isScoreZero;
  }

  // Handles the 'change' event on the AI level slider (fires when user releases mouse).
  // This is the final confirmation of the AI level selection.
  function _handleSliderChange() {
    const newSelectedLevel = parseInt(selectors.AILevelInput.value, 10);

    if (!_isGameInProgress()) {
      // Game is not in progress. If the level actually changed,
      // update the opponent level in appState and the confirmed level.
      if (newSelectedLevel !== _confirmedOpponentLevel) {
        setOpponentLevel(newSelectedLevel);
        _confirmedOpponentLevel = newSelectedLevel;
        console.info("%cNew opponent Level: ", "color: yellow;", _confirmedOpponentLevel);
        // No game reset is needed as the game is not currently running.
      }
      return;
    }

    // Game is in progress. If the level changed, show the alert.
    if (newSelectedLevel !== _confirmedOpponentLevel) { 
      showConfirmationAlert(); 
      _addOpponentChangeConfirmationListeners(newSelectedLevel, _confirmedOpponentLevel);
    }
  }

  //Handles the click event on player selection buttons (X or O).
  function _handlePlayerChange(playerSymbolToSet) {
    const newSelectedPlayer = playerSymbolToSet === PLAYERS.PLAYER_X ? PLAYERS.PLAYER_X : PLAYERS.PLAYER_O;

    if (!_isGameInProgress()){
      if (newSelectedPlayer !== _confirmedStartingPlayer) {
        setStartingPlayer(newSelectedPlayer);
        _confirmedStartingPlayer = newSelectedPlayer;
        console.info("%cNew starting player: ", "color: yellow;", _confirmedStartingPlayer);
        initializeGameInteraction();
      }
      return;
    }

    if (newSelectedPlayer !== _confirmedStartingPlayer) { 
      showConfirmationAlert();
      _addStartingPlayerChangeConfirmationListeners(newSelectedPlayer, _confirmedStartingPlayer)
    }
  }

  function _handleGameChange(gameToSet) {
    const newSelectedGame = gameToSet === GAME.TIC_TAC_TOE ? GAME.TIC_TAC_TOE : GAME.CONNECT_FOUR;

    if (!_isGameInProgress()){
      if(newSelectedGame !== _confirmedGame) {
        setCurrentGame(newSelectedGame);
        _confirmedGame = newSelectedGame;
        console.info("%cNew Game: ", "color: orange;", _confirmedGame);
        initializeGameInteraction();
      }
      return;
    }

    if (newSelectedGame !== _confirmedGame) {
      showConfirmationAlert();
      _addGameChangeConfirmationListeners(newSelectedGame, _confirmedGame);
    }
  }
  
  // Handles the 'input' event on the AI level slider (fires continuously while dragging).
  // Used to update the difficulty label in real-time.
  function _handleSliderInput() {
    _updateOpponentLabelFromSlider(); // Update label live
  }

  // Adds event listeners for the AI level range slider.
  function _addRangeListeners() {
    selectors.AILevelInput.addEventListener('input', _handleSliderInput);
    selectors.AILevelInput.addEventListener('change', _handleSliderChange);
  }

  // Adds event listener for the restart button.
  function _addRestartButtonListener() {
    selectors.restartButton.addEventListener("click", () => {
      resetGameBoard({ resetScore: false, resetStartingPlayer: false });
      initializeGameInteraction();
    });
  }

  // Adds event listeners for the player selection buttons (X and O).
  function _addPlayerButtonListeners() {
    const scoreBoard = selectors.scoreBoard;
    const playerXBtn = selectors.playerXButton;
    const playerOBtn = selectors.playerOButton;

    scoreBoard.addEventListener("click", (event) => {
      const clickedElement = event.target;
      let playerSymbolToSet = null;

      if (clickedElement === playerXBtn) {
        playerSymbolToSet = PLAYERS.PLAYER_X;
      } else if (clickedElement === playerOBtn) {
        playerSymbolToSet = PLAYERS.PLAYER_O;
      }

      if (playerSymbolToSet)  {
       _handlePlayerChange(playerSymbolToSet);
      }      
    });
  }

  function _addGameSwitchButtonListeners() {
    const gameSwitchWrapper = selectors.gameSwitchWrapper;
    const switchTTTButton = selectors.switchTTTButton;
    const switchCFButton = selectors.switchCFButton;

    gameSwitchWrapper.addEventListener("click", (event) => {
      const clickedElement = event.target;

      if (clickedElement === switchTTTButton) {
        _handleGameChange(GAME.TIC_TAC_TOE);
        
      } else if (clickedElement === switchCFButton) {
        _handleGameChange(GAME.CONNECT_FOUR);
      }
    });
  }

  // Initializes all input-related settings and event listeners.
  function initializeInput() {
    _setOpponentRange();
    _initializeCurrentGame();
    _initializeOpponentSettings();
    _initializeStartingPlayer();
    namePlayers(getCurrentGame());
    _addRangeListeners();
    _addPlayerButtonListeners();
    _addRestartButtonListener();
    _addGameSwitchButtonListeners()
  }

  return {
    initializeInput,
  }
}