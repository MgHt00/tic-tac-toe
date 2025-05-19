import '../lib/bootstrap.bundle.js';

import { inputManager } from './components/inputManager.js';
import { loadingManager } from './components/loadingManager.js';
import { interactionManager } from './components/interactionManager.js';

const input = inputManager();
const { initializeInput } = input;

const load = loadingManager(initializeInput);
const { preLoad } = load;

const interaction = interactionManager();
const { initializeGameInteraction } = interaction;

(async function() {
  preLoad();
  initializeGameInteraction();
})();