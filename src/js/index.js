import '../lib/bootstrap.bundle.js';

import { getAILevel0Move, getAILevel1Move, getAILevel2Move } from './ai/aiStrategies.js';

import { inputManager } from './components/inputManager.js';
import { loadingManager } from './components/loadingManager.js';
import { interactionManager } from './components/interactionManager.js';

const interaction = interactionManager(getAILevel0Move, getAILevel1Move, getAILevel2Move);
const { initializeGameInteraction, resetGameBoard } = interaction;

const input = inputManager(resetGameBoard);
const { initializeInput } = input;

const load = loadingManager(initializeInput);
const { preLoad } = load;

(async function() {
  preLoad();
  initializeGameInteraction();
})();