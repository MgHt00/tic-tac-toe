import '../lib/bootstrap.bundle.js';

import { inputManager } from './components/inputManager.js';
import { loadingManager } from './components/loadingManager.js';


const input = inputManager();
const { initializeInput } = input;

const load = loadingManager(initializeInput);
const { start } = load;

(async function initialize() {
  start();
})();