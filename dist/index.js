import SpaceTyperEngine from './classes/SpaceTyperEngine.js';
import GoldenWord from './classes/words/GoldenWord.js';
const engine = new SpaceTyperEngine();
window.engine = engine;
engine.gameManager.newGame();
engine.gameManager.registerWord(new GoldenWord('test', 30 * 1000));
document.querySelectorAll('.nav_link').forEach((link) => {
    if (!link.hasAttribute('url'))
        return;
    link.addEventListener('click', () => window.open(link.getAttribute('url')));
});
//# sourceMappingURL=index.js.map