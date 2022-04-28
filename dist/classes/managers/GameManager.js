import Settings from '../Settings.js';
import SpaceTyperEngine from '../SpaceTyperEngine.js';
import Word from '../words/Word.js';
import BackgroundManager from './BackgroundManager.js';
import RenderManager from './RenderManager.js';
import UiManager from './UiManager.js';
export default class GameManager {
    static _instance;
    static getInstance() {
        return this._instance;
    }
    score;
    words;
    constructor() {
        if (GameManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        GameManager._instance = this;
        this.score = 0;
        this.words = new Array();
        this.words.push(new Word('abc', 60 * 1000));
        this.words.push(new Word('test', 60 * 1000));
        this.words.push(new Word('testttt', 60 * 1000));
        this.words.push(new Word('a', 60 * 1000));
        this.words.push(new Word('test2', 60 * 1000));
        this.words.push(new Word('test', 10 * 1000));
        this.words.push(new Word('test', 3 * 1000));
        this.words.push(new Word('test3', 4 * 1000));
        this.words.push(new Word('test4', 2 * 1000));
        this.words.push(new Word('test', 4 * 1000));
        this.words.push(new Word('test', 4 * 1000));
    }
    wordSubmit(submitValue) {
        const words = this.words
            .sort((a, b) => a.getProgess() - b.getProgess())
            .filter((w) => !w.isDead())
            .reverse();
        let didHit = false;
        let index = 0;
        while (!didHit && index < words.length) {
            didHit = words[index].submit(submitValue);
            index++;
        }
    }
    addScore(amount) {
        this.score += amount;
        UiManager.getInstance().scoreCounter.setCount(this.score, 2500);
    }
    update() {
        const dt = SpaceTyperEngine.getDeltaTime();
        this.words.forEach((w) => w.update(dt));
        this.words = this.words.filter((w) => !w.isDead());
    }
    draw() {
        const ctx = RenderManager.getInstance().game.context;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (Settings.drawFps) {
            ctx.save();
            ctx.fillStyle = '#0f0';
            ctx.font = `${Settings.drawFpsFontSize}px System, monospace`;
            ctx.textBaseline = 'bottom';
            const mainLoopDelta = SpaceTyperEngine.getDeltaTime();
            const mainLoopFps = (1000 / mainLoopDelta).toFixed(0);
            const mainLoopString = `mainLoop: ${mainLoopFps} FPS (${mainLoopDelta.toFixed(2)}ms)`;
            const bgLoopDelta = BackgroundManager.getInstance().getWorkerDeltaTime() ?? Infinity;
            const bgLoopFPS = (1000 / bgLoopDelta).toFixed(0);
            const bgLoopString = `bgWorkerLoop: ${bgLoopFPS} FPS (${bgLoopDelta.toFixed(2)}ms)`;
            ctx.fillText(mainLoopString, 5, window.innerHeight - 5 - Settings.drawFpsFontSize);
            ctx.fillText(bgLoopString, 5, window.innerHeight - 5 - Settings.drawFpsFontSize * 2);
            ctx.restore();
        }
        this.words.forEach((w) => w.draw(ctx));
    }
}
//# sourceMappingURL=GameManager.js.map