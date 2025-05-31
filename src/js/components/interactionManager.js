import { globals } from "../services/globals.js";
import { restoreDefaults, updateGameBoardState } from "../services/globalDataManager.js";
import { selectors } from "../services/selectors.js";
import { PLAYERS, INTERACTIONS, STATE_KEYS, WIN_LINE_DIRECTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES} from "../constants/cssClassNames.js";
import { checkWinCondition } from "../utils/boardUtils.js";
import { addHighlight, removeHighlight, makeRestartButtonFilled, makeRestartButtonOutlined, removeWinningLineStyles, removePlayerMarkStyles, blackoutScreen, unBlackoutScreen } from "../utils/domHelpers.js";

export function interactionManager(getAILevel0Move, getAILevel1Move, getAILevel2Move) {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

  function _fillAndDecorateSquare(targetElement, player) {
    targetElement.textContent = player;
    const cssClass = player === PLAYER_X ? CSS_CLASS_NAMES.PLAYER_X_COLOR : CSS_CLASS_NAMES.PLAYER_O_COLOR;
    targetElement.classList.add(cssClass);
  }

  function _isSquareFilled(targetElement) {
    return targetElement.textContent !== "";
  }

  function _disableBoardInteractions() {
    if (selectors.TTTBoard) {
      selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  }

  function _enableBoardInteractions() {
    if (selectors.TTTBoard) {
      selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  }

  function _flipPlayer() {
    globals.appState[STATE_KEYS.CURRENT_PLAYER] = globals.appState[STATE_KEYS.CURRENT_PLAYER] === PLAYER_X ? PLAYER_O : PLAYER_X;
  }

  function _displayCurrentPlayer(){
    selectors.gameInfo.textContent = `${globals.appState[STATE_KEYS.CURRENT_PLAYER]} ${INTERACTIONS.PLAYER_TURN}`;
  }

  function _highlightCurrentPlayer() {
    const currentPlayerButton = globals.appState[STATE_KEYS.CURRENT_PLAYER] === PLAYER_X ? selectors.playerXButton : selectors.playerOButton;
    const otherPlayerButton = globals.appState[STATE_KEYS.CURRENT_PLAYER] === PLAYER_X ? selectors.playerOButton : selectors.playerXButton;

    removeHighlight(otherPlayerButton);
    addHighlight(currentPlayerButton);
  }

  function _areAllSquaresFilled() {
    const squaresNodeList = document.querySelectorAll(_matchingID);
    for (const square of squaresNodeList) {
      if (square.textContent === "") {
        return false;
      }
    }
    return true;
  }

  function resetGameBoard() {
    blackoutScreen();
    restoreDefaults(); // reset global's appState

    selectors.gameInfo.textContent = PLAYERS.INITIAL_MESSAGE;
    
    const squaresNodeList = document.querySelectorAll(_matchingID);
    squaresNodeList.forEach(square => {
      square.textContent = "";
      removeWinningLineStyles(square);
      removePlayerMarkStyles(square);
    });

    selectors.playerXButton.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
    selectors.playerOButton.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);

    makeRestartButtonOutlined();
    _enableBoardInteractions(); 

    setTimeout(() => {
      unBlackoutScreen();
    }, INTERACTIONS.AI_THINKING_TIME_MS);
    
    console.warn("Game board reset.");
  }

  function _strikeThroughCells(winningCombinationDetails, winningPlayer) {
    if (!winningCombinationDetails || !winningCombinationDetails.key || !winningCombinationDetails.indices) {
      console.error("Invalid winningCombinationDetails for strikeThroughCells:", winningCombinationDetails);
      return;
    }

    const { key, indices } = winningCombinationDetails;
    let baseWinType; // Will be "ROW", "COLUMN", "DIAGONAL_MAIN", or "DIAGONAL_SECONDARY"

    if (key.startsWith("row")) {
      baseWinType = WIN_LINE_DIRECTIONS.ROW;
    } else if (key.startsWith("col")) {
      baseWinType = WIN_LINE_DIRECTIONS.COLUMN;
    } else if (key === "diag1") {
      baseWinType = WIN_LINE_DIRECTIONS.DIAGONAL_MAIN;
    } else if (key === "diag2") {
      baseWinType = WIN_LINE_DIRECTIONS.DIAGONAL_SECONDARY;
    } else {
      console.error("Unknown winning combination key:", key);
      return;
    }

    // Construct the key for CSS_CLASS_NAMES, e.g., "X_WIN_ROW" or "O_WIN_DIAGONAL_MAIN"
    const cssClassKey = `${winningPlayer}_WIN_${baseWinType}`;
    const cssClass = CSS_CLASS_NAMES[cssClassKey];

    if (!cssClass) {
      console.error(`CSS class not found for key: ${cssClassKey}. Ensure PLAYERS constants ('${PLAYER_X}', '${PLAYER_O}') align with CSS_CLASS_NAMES prefixes.`);
      return;
    }

    indices.forEach(index => {
      const domRow = Math.floor(index / 3); // Result is 0, 1, or 2
      const domCol = (index % 3);      // Result is 0, 1, or 2
      const cellId = `${INTERACTIONS.SQUARES_ID_INITIAL}${domRow}-${domCol}`; 
      const cellElement = document.getElementById(cellId);

      if (cellElement) {
        cellElement.classList.add(cssClass);
      } else {
        console.error(`Cell element not found for ID: ${cellId}`);
      }
    });
  }

  function _handleWin(winningPlayer, winningCombinationDetails) {
    console.info(`Player ${winningPlayer} wins!`);
    globals.appState[STATE_KEYS.GAME_OVER] = true;
    globals.appState[STATE_KEYS.WINNER] = winningPlayer;
    selectors.gameInfo.textContent = `${winningPlayer} ${INTERACTIONS.PLAYER_WIN}`;
    _strikeThroughCells(winningCombinationDetails, winningPlayer);
    _disableBoardInteractions();
    makeRestartButtonFilled();
  }

  function _handleDraw() { 
    console.info("Game is a draw!");
    _disableBoardInteractions();
    globals.appState[STATE_KEYS.GAME_OVER] = true;
    globals.appState[STATE_KEYS.WINNER] = PLAYERS.PLAYER_DRAW;
    selectors.gameInfo.textContent = INTERACTIONS.PLAYER_DRAW;
    makeRestartButtonFilled();
  }
    
  function _handleAITurn() {
    if (globals.appState[STATE_KEYS.GAME_OVER]) return; // Don't proceed if game is over
    _disableBoardInteractions();
    setTimeout(() => {
      _playAI();
    }, INTERACTIONS.AI_THINKING_TIME_MS);
    globals.appState[STATE_KEYS.GAME_IN_PROGRESS] = true;
  }

  function _playAI() {
    _enableBoardInteractions();
    let moveCoordinates; // Will be {row, col} or null
    const aiPlayerSymbol = globals.appState[STATE_KEYS.CURRENT_PLAYER];
    const opponentPlayerSymbol = aiPlayerSymbol === PLAYER_X ? PLAYER_O : PLAYER_X;

    switch (globals.appState[STATE_KEYS.OPPONENT_LEVEL]) {
      case 0:
        moveCoordinates = getAILevel0Move(globals.appState[STATE_KEYS.GAME_BOARD]);
        break;
      case 1:
        moveCoordinates = getAILevel1Move(globals.appState[STATE_KEYS.GAME_BOARD], aiPlayerSymbol, opponentPlayerSymbol);
        break;
      case 2:
        moveCoordinates = getAILevel2Move(globals.appState[STATE_KEYS.GAME_BOARD], aiPlayerSymbol, opponentPlayerSymbol);
        break; 
      default:
        console.error("Unknown AI opponent level:", globals.appState[STATE_KEYS.OPPONENT_LEVEL], "AI will not move.");
        _enableBoardInteractions();
        return;
    }

    if (!moveCoordinates) {
      console.error("AI failed to select a move (no coordinates returned). Re-enabling board.");
      _enableBoardInteractions();
      return;
    }

    const targetElementId = `${INTERACTIONS.SQUARES_ID_INITIAL}${moveCoordinates.row}-${moveCoordinates.col}`;
    const targetElement = document.getElementById(targetElementId);

    _fillAndDecorateSquare(targetElement, aiPlayerSymbol);
    updateGameBoardState(targetElement, aiPlayerSymbol);

    // Check for win using the AI's move
    const winningBoardCombination = checkWinCondition(globals.appState[STATE_KEYS.GAME_BOARD], aiPlayerSymbol);
    
    if (winningBoardCombination) {
      _handleWin(aiPlayerSymbol, winningBoardCombination);
      return;
    }
    
    if (_areAllSquaresFilled()) {
      _handleDraw(); 
      return;
    }

    _flipPlayer(); // Switch back to human player
    _displayCurrentPlayer();
    _highlightCurrentPlayer();
  }

  function _handleSquareClick(targetElement) {
    if (globals.appState[STATE_KEYS.GAME_OVER]) {
      console.info("Game is already over.");
      return;
    }

    if (_isSquareFilled(targetElement)) {
      console.info("Square is already filled");
      return; 
    }

    const playerMakingMove = globals.appState[STATE_KEYS.CURRENT_PLAYER];

    globals.appState[STATE_KEYS.GAME_IN_PROGRESS] = true;

    _fillAndDecorateSquare(targetElement, playerMakingMove);
    updateGameBoardState(targetElement, playerMakingMove);

    // Check for win using the player's move    
    const winningBoardCombination = checkWinCondition(globals.appState[STATE_KEYS.GAME_BOARD], playerMakingMove);

    if (winningBoardCombination) {
      _handleWin(playerMakingMove, winningBoardCombination); 
      return;
    }

    if (_areAllSquaresFilled()) {
      _handleDraw(); 
      return;
    }

    // Prepare for AI turn
    _flipPlayer();
    _displayCurrentPlayer();
    _highlightCurrentPlayer();

    _handleAITurn();
  }
  
  function _addSquareListeners() {
    const gameBoard = selectors.TTTBoard;

    gameBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(_matchingID) && !globals.appState[STATE_KEYS.GAME_OVER] && !_isSquareFilled(event.target)) { // Only highlight if game not over and square not filled
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
        _highlightCurrentPlayer();
      }
    });
  }
  
  function initializeGameInteraction() {
    _addSquareListeners();
    resetGameBoard();
    _highlightCurrentPlayer();
  }

  return {
    initializeGameInteraction,
    resetGameBoard,
  }
}