import {
  restoreDefaults,
  updateGameBoardState,
  getCurrentGame,
  setCurrentGame,
  getStartingPlayer,
  setStartingPlayer,
  getCurrentPlayer,
  setCurrentPlayer,
  getGameBoard,
  isGameOverState,
  setGameOverState,
  getWinner,
  setWinner,
  isGameInProgressState,
  setGameInProgressState,
  getOpponentLevel,
  getPlayerXScore,
  setPlayerXScore,
  getPlayerOScore,
  setPlayerOScore } from "../services/globalDataManager.js";
import { selectors } from "../services/selectors.js";
import { PLAYERS, INTERACTIONS, GAME } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES} from "../constants/cssClassNames.js";
import { 
  checkWinCondition as _checkWinCondition,
  checkConnectFourWinCondition as _checkConnectFourWinCondition,
  isSquareFilled as _isSquareFilled,
  disableBoardInteractions as _disableBoardInteractions,
  enableBoardInteractions as _enableBoardInteractions,
  flipPlayer as _flipPlayer,
  isBelowSquareFilled as _isBelowSquareFilled,
  areAllSquaresFilled as _areAllSquaresFilled,
  accumulateScore as _accumulateScore,
 } from "../utils/boardUtils.js";
import { 
  addHighlight, 
  removeHighlight, 
  makeRestartButtonFilled, 
  makeRestartButtonOutlined, 
  blackoutScreen, 
  unBlackoutScreen, 
  updateScoreOnScreen, 
  showWinnerOnScreen, 
  displayCurrentPlayer, 
  highlightCurrentPlayer,
  changeGameTitle,
  namePlayers,
  convertPlayerBoxToCircle,
  convertPlayerBoxToSquare,
  hideConnectFourBoard,
  showConnectFourBoar,
  showTTTBoard,
  hideTTTBoard,
  clearAllSquares,
  changeGameInfoContent,
  fillAndDecorateSquare,
  strikeThroughCells,
  highlightWinningCells,
  } from "../utils/domHelpers.js";
  
/**
 * Manages all game interactions on the Tic-Tac-Toe board.
 * This includes handling player moves, AI turns, win/draw conditions, and game resets.
 * @param {function} getAILevel0Move - Function to get a move for AI level 0.
 * @param {function} getAILevel1Move - Function to get a move for AI level 1.
 * @param {function} getAILevel2Move - Function to get a move for AI level 2.
 * @returns {object} An object containing `initializeGameInteraction` and `resetGameBoard` functions.
 */
export function interactionManager(getAILevel0Move, getAILevel1Move, getAILevel2Move) {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

  // To store references to the event handlers for easy removal.
  let _boundMouseOverHandler = null;
  let _boundMouseOutHandler = null;
  let _boundMouseClickHandler = null;
 
  function resetGameBoard({ resetScore = false, resetStartingPlayer = false }) {
    blackoutScreen();

    restoreDefaults({ resetScore, resetStartingPlayer });
    changeGameInfoContent(PLAYERS.INITIAL_MESSAGE);    
    clearAllSquares();
    removeHighlight([selectors.playerXButton, selectors.playerOButton]);
    makeRestartButtonOutlined();
    _enableBoardInteractions(); 

    setTimeout(() => {
      unBlackoutScreen();
    }, INTERACTIONS.GAME_RESET_TIME_MS);
    
    console.warn("Game board reset.");
  }

  /**
   * Handles the game win scenario.
   * @param {string} winningPlayer - The player who won.
   * @param {object} winningCombinationDetails - Details of the winning line.
   */
  function _handleWin(winningPlayer, winningCombinationDetails) {
    console.info(`Player ${winningPlayer} wins!`);
    const currentGame = getCurrentGame();
    
    setGameOverState(true);
    setWinner(winningPlayer);
    _accumulateScore(winningPlayer);
    updateScoreOnScreen(getPlayerXScore(), getPlayerOScore());
    showWinnerOnScreen(winningPlayer);
    _disableBoardInteractions();
    
    if (currentGame === GAME.TIC_TAC_TOE) {
      strikeThroughCells(winningCombinationDetails, winningPlayer, currentGame);  
    } else if (currentGame === GAME.CONNECT_FOUR) {
      highlightWinningCells(winningCombinationDetails, winningPlayer, currentGame);
    } else {
      console.error("Invalid game:", currentGame);
    }
    
    makeRestartButtonFilled();
  }

  // Handles the game draw scenario.
  function _handleDraw() { 
    console.info("Game is a draw!");
    _disableBoardInteractions();
    setGameOverState(true);
    setWinner(PLAYERS.PLAYER_DRAW);
    changeGameInfoContent(INTERACTIONS.PLAYER_DRAW);
    makeRestartButtonFilled();
  }

  // Handles UI updates and enables board for 2-player mode turns.
  function _handle2PlayerMode() {
    _enableBoardInteractions();
    displayCurrentPlayer(getCurrentPlayer());
    highlightCurrentPlayer(getCurrentPlayer());
  }

  // Executes the AI's move based on the selected difficulty level.
  function _playAI() {
    _enableBoardInteractions();
    let moveCoordinates; // Will be {row, col} or null
    const aiPlayerSymbol = getCurrentPlayer();
    const currentGame = getCurrentGame();
    const opponentPlayerSymbol = aiPlayerSymbol === PLAYER_X ? PLAYER_O : PLAYER_X;

    switch (getOpponentLevel()) {
      case 0:
        moveCoordinates = getAILevel0Move(getGameBoard(currentGame), currentGame);
        break;
      case 1:
        moveCoordinates = getAILevel1Move(getGameBoard(currentGame), aiPlayerSymbol, opponentPlayerSymbol);
        break;
      case 2:
        moveCoordinates = getAILevel2Move(getGameBoard(currentGame), aiPlayerSymbol, opponentPlayerSymbol);
        break; 
      default:
        console.error("Unknown AI opponent level:", getOpponentLevel(), "AI will not move.");
        _enableBoardInteractions();
        return;
    }

    if (!moveCoordinates) {
      console.error("AI failed to select a move (no coordinates returned). Re-enabling board.");
      _enableBoardInteractions();
      return;
    }
    const squareInitial = currentGame === GAME.TIC_TAC_TOE ? INTERACTIONS.SQUARES_ID_INITIAL : INTERACTIONS.CF_SQUARES_ID_INITIAL;
    const targetElementId = `${squareInitial}${moveCoordinates.row}-${moveCoordinates.col}`;
    const targetElement = document.getElementById(targetElementId);

    fillAndDecorateSquare(targetElement, aiPlayerSymbol);
    updateGameBoardState(targetElement, aiPlayerSymbol, currentGame);

    // Check for win using the AI's move
    let winningBoardCombination;
    if (currentGame === GAME.TIC_TAC_TOE) {
      winningBoardCombination = _checkWinCondition(getGameBoard(currentGame), aiPlayerSymbol);
    } else if (currentGame === GAME.CONNECT_FOUR) {
      winningBoardCombination = _checkConnectFourWinCondition(getGameBoard(currentGame), targetElement, aiPlayerSymbol);
    }
    
    if (winningBoardCombination) {
      _handleWin(aiPlayerSymbol, winningBoardCombination);
      return;
    }
    
    if (_areAllSquaresFilled(currentGame)) {
      _handleDraw(); 
      return;
    }

    _flipPlayer(); // Switch back to human player
    displayCurrentPlayer(getCurrentPlayer());
    highlightCurrentPlayer(getCurrentPlayer());
  }

  // Manages the TTT AI's turn, including thinking time and invoking the AI move logic.
  function _handleTicTacToeAITurn() {
    if (isGameOverState()) return; // Don't proceed if game is over

    _disableBoardInteractions();

    if (getOpponentLevel() === 3) { // 2-Player mode for TTT
      _handle2PlayerMode(); // enables the board for the next human player.
      return;
    }

    setTimeout(() => { // AI turn for Tic-Tac-Toe
      _playAI();
    }, INTERACTIONS.AI_THINKING_TIME_MS);
    setGameInProgressState(true);
  }

  // Processes a player's move for Tic-Tac-Toe.
  function _processTicTacToeMove(targetElement, playerMakingMove, currentGame) {
    fillAndDecorateSquare(targetElement, playerMakingMove);

    // Check for win using the player's move    
    const winningBoardCombination = _checkWinCondition(getGameBoard(currentGame), playerMakingMove);
    if (winningBoardCombination) {
      _handleWin(playerMakingMove, winningBoardCombination);
      return true; // Game ended
    }
    return false; // Game continues
  }

  // Manages the Connect Four AI's turn
  function _handleConnectFourAITurn() {
    console.log("Connect Four AI is thinking...");
    if (isGameOverState()) return; // Don't proceed if game is over

    _disableBoardInteractions();

    if (getOpponentLevel() === 3) { // 2-Player mode
      _handle2PlayerMode(); // enables the board for the next human player.
      return;
    }

    setTimeout(() => { // AI turn for Tic-Tac-Toe
      _playAI();
    }, INTERACTIONS.AI_THINKING_TIME_MS);
    setGameInProgressState(true);
  }

  // Processes a player's move for Connect Four
  function _processConnectFourMove(targetElement, playerMakingMove, currentGame) {
    if (!_isBelowSquareFilled(targetElement)) {
      //console.info("Connect Four move invalid: square below is empty.");
      return null;
    }

    fillAndDecorateSquare(targetElement, playerMakingMove);

    // Check for win using the player's move
    const winningBoardCombination = _checkConnectFourWinCondition(getGameBoard(currentGame), targetElement, playerMakingMove);
    if (winningBoardCombination) {
      _handleWin(playerMakingMove, winningBoardCombination, currentGame);
      return true; // game ended
    }
    return false; // game continues
  }

  // Handles a click event on a square of the game board.
  function _handleSquareClick(targetElement) {
    if (isGameOverState()) {
      console.info("Game is already over.");
      return;
    }

    if (_isSquareFilled(targetElement)) {
      console.info("Square is already filled");
      return; 
    }

    const currentGame = getCurrentGame();
    const playerMakingMove = getCurrentPlayer();
    let gameEnded = false;
    let validMoveMade = true;

    setGameInProgressState(true);
    updateGameBoardState(targetElement, playerMakingMove, currentGame);

    if (currentGame === GAME.TIC_TAC_TOE) {
      gameEnded = _processTicTacToeMove(targetElement, playerMakingMove, currentGame);
    }
    
    if (currentGame === GAME.CONNECT_FOUR) {
      const connectFourResult = _processConnectFourMove(targetElement, playerMakingMove, currentGame);
      if (connectFourResult === null) { // If the move was invalid (e.g., C4 piece dropped in air), don't proceed to next turn.
        validMoveMade = false;
      } else {
        gameEnded = connectFourResult;
      }
    }

    // If the game ended due to a win in the game-specific logic, return.
    if (gameEnded) {
      return;
    }

    // Check for a draw if the game hasn't already ended with a win.
    if (_areAllSquaresFilled(currentGame)) {
      _handleDraw(); 
      return;
    }

    // Prepare for AI turn
    if (validMoveMade) {
      _flipPlayer();
    }
    displayCurrentPlayer(getCurrentPlayer());
    highlightCurrentPlayer(getCurrentPlayer());

    if (currentGame === GAME.TIC_TAC_TOE) {
      _handleTicTacToeAITurn();
    }

    if (validMoveMade && currentGame === GAME.CONNECT_FOUR) {
      _handleConnectFourAITurn();
    }
  }

  // Attempt to remove listeners from both boards.
  function _removeSquareListeners() {
    if (_boundMouseOverHandler) {
       selectors.TTTBoard.removeEventListener("mouseover", _boundMouseOverHandler);
       selectors.CFBoard.removeEventListener("mouseover", _boundMouseOverHandler);
       _boundMouseOverHandler = null;
    }
    if (_boundMouseOutHandler) {
      selectors.TTTBoard.removeEventListener("mouseout", _boundMouseOutHandler);
      selectors.CFBoard.removeEventListener("mouseout", _boundMouseOutHandler);
      _boundMouseOutHandler = null;
    }
    if (_boundMouseClickHandler) {
      selectors.TTTBoard.removeEventListener("click", _boundMouseClickHandler);
      selectors.CFBoard.removeEventListener("click", _boundMouseClickHandler);
      _boundMouseClickHandler = null;
    }
  }
  
  // Adds event listeners to the squares on the Tic-Tac-Toe board for mouseover, mouseout, and click events.
  function _addSquareListeners() {
    const currentGame = getCurrentGame();
    const gameBoard = currentGame === GAME.TIC_TAC_TOE ? selectors.TTTBoard : selectors.CFBoard;
    
    if (currentGame === GAME.TIC_TAC_TOE) {
      _boundMouseClickHandler = (event) => {
        if (event.target.matches(_matchingID)) {
          _handleSquareClick(event.target);
          highlightCurrentPlayer(getCurrentPlayer());
        }
      }
    }

    if (currentGame === GAME.CONNECT_FOUR) {
      _boundMouseClickHandler = (event) => {
        if (event.target.matches(_matchingID)) {
          _handleSquareClick(event.target);
          highlightCurrentPlayer(getCurrentPlayer());
        }
      }
    }

    _boundMouseOverHandler = (event) => {
      if (event.target.matches(_matchingID) && !isGameOverState() && !_isSquareFilled(event.target) && _isBelowSquareFilled(event.target)) { // Only highlight if game not over and square not filled
        addHighlight(event.target);
      }
    }

    _boundMouseOutHandler = (event) => {
      if (event.target.matches(_matchingID)) {
        removeHighlight(event.target);
      }
    }

    gameBoard.addEventListener("mouseover", _boundMouseOverHandler);
    gameBoard.addEventListener("mouseout", _boundMouseOutHandler);
    gameBoard.addEventListener("click", _boundMouseClickHandler);
  }

  function _enableConnectFour() {
    const connectFour = GAME.CONNECT_FOUR;

    blackoutScreen();
    changeGameTitle(connectFour);
    convertPlayerBoxToCircle();
    namePlayers(connectFour);
    hideTTTBoard();
    showConnectFourBoar();

    setTimeout(() => {
      unBlackoutScreen();
    }, INTERACTIONS.GAME_CHANGE_TIME_MS);
  }

  function _enableTTT(){
    const ticTacToe = GAME.TIC_TAC_TOE;

    blackoutScreen();
    changeGameTitle(ticTacToe);
    convertPlayerBoxToSquare();
    namePlayers(ticTacToe);
    hideConnectFourBoard();
    showTTTBoard();

    setTimeout(() => {
      unBlackoutScreen();
    }, INTERACTIONS.GAME_CHANGE_TIME_MS);
  }
  
  // Initializes the game interactions, sets up event listeners, and handles the initial game state.
  function initializeGameInteraction() {
    const gameToPlay = getCurrentGame();
    const startingPlayer = getStartingPlayer();
    const opponentLevel = getOpponentLevel();

    // Ensure startingPlayer and gameToPlay is aligned with the starting state.
    // This is especially important on initial load or if resetGameBoard wasn't just called.
    setCurrentGame(gameToPlay);
    setCurrentPlayer(startingPlayer); 
    _removeSquareListeners();

    if (gameToPlay === GAME.CONNECT_FOUR) {
      _enableConnectFour();
      _addSquareListeners();
    } 
    
    else if (gameToPlay === GAME.TIC_TAC_TOE) {
      _enableTTT();
      _addSquareListeners();
      displayCurrentPlayer(getCurrentPlayer()); 
      highlightCurrentPlayer(getCurrentPlayer()); 
      // If the current player is O (AI) and it's not 2-player mode, AI makes the first move.
      if (getCurrentPlayer() === PLAYER_O && opponentLevel < 3) { 
        _handleTicTacToeAITurn();
      }
    } 
    
    else {
      console.error("Unknown game type in initializeGameInteraction:", gameToPlay);
    }
  }

  return {
    initializeGameInteraction,
    resetGameBoard,
  }
}