import SpaceTyperEngine from '../SpaceTyperEngine.js';
import Word from '../words/Word.js';
import RenderManager from './RenderManager.js';
import UiManager from './UiManager.js';
export default class GameManager {
    constructor() {
        if (GameManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        GameManager._instance = this;
        this.score = 0;
        this.words = new Array();
        this.words.push(new Word('abc', 60 * 1000));
        this.words.push(new Word('test', 60 * 1000));
        this.words.push(new Word('dom', 60 * 1000));
        this.words.push(new Word('a', 60 * 1000));
        this.words.push(new Word('pies', 60 * 1000));
        this.words.push(new Word('test', 10 * 1000));
        this.words.push(new Word('test', 3 * 1000));
        this.words.push(new Word('test', 4 * 1000));
        this.words.push(new Word('test', 2 * 1000));
        this.words.push(new Word('test', 4 * 1000));
        this.words.push(new Word('test', 4 * 1000));
    }
    static getInstance() {
        return this._instance;
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
        ctx.save();
        ctx.fillStyle = '#0f0';
        ctx.font = '16px System, monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(Math.floor(SpaceTyperEngine.getInstance().getFps()).toString() + ' FPS', 5, 5);
        ctx.restore();
        this.words.forEach((w) => w.draw(ctx));
    }
}
