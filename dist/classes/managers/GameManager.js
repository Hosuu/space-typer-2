import { wordsDB } from '../../WordsDB.js';
import Star from '../particles/Star.js';
import QuadTree from '../QuadTree.js';
import Settings from '../Settings.js';
import SpaceTyperEngine from '../SpaceTyperEngine.js';
import GoldenWord from '../words/GoldenWord.js';
import Word from '../words/Word.js';
import BackgroundManager from './BackgroundManager.js';
import PromptManager from './PromptManager.js';
import RenderManager from './RenderManager.js';
import UiManager from './UiManager.js';
export default class GameManager {
    static _instance;
    static getInstance() {
        return this._instance;
    }
    spawnerTimer;
    isStarted;
    startTimeStamp;
    score;
    lives;
    scoreMultiplier;
    combo;
    words;
    quadTree;
    constructor() {
        if (GameManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        GameManager._instance = this;
        this.isStarted = false;
        this.startTimeStamp = 0;
        this.spawnerTimer = 0;
        this.score = 0;
        this.lives = 3;
        this.scoreMultiplier = 1;
        this.combo = 0;
        this.words = new Array();
    }
    wordSubmit(submitValue) {
        if (!this.isStarted) {
            if (submitValue === 'start')
                return this.newGame();
        }
        else if (submitValue === 'letmeout')
            return this.endGame();
        const words = this.words
            .sort((a, b) => a.getProgess() - b.getProgess())
            .filter((w) => !w.isDead())
            .reverse();
        let didHit = false;
        for (const word of words) {
            if (word.submit(submitValue)) {
                this.combo++;
                didHit = true;
                this.scoreMultiplier = this.combo ? 1 + Math.log10(this.combo) : 1;
                BackgroundManager.getInstance().setShineChanceMultiplier(1 + Math.pow(this.combo, 1 / 1.15));
                break;
            }
        }
        if (!didHit) {
            this.combo = 0;
            this.scoreMultiplier = 1;
        }
    }
    addScore(amount) {
        this.score += amount * this.scoreMultiplier;
        UiManager.getInstance().scoreCounter.setCount(this.score, 2500);
    }
    update() {
        const dt = SpaceTyperEngine.getDeltaTime();
        this.quadTree = new QuadTree(SpaceTyperEngine.getGameArea(), 5, 4);
        for (const word of this.words)
            this.quadTree.insert(word, word.getCollider());
        if (this.isStarted)
            this.spawnerTimer += dt;
        const spawnDelay = 500;
        if (this.spawnerTimer > spawnDelay) {
            this.spawnerTimer -= spawnDelay;
            this.words.push(new Word(wordsDB[Math.floor(Math.random() * wordsDB.length)], 60 * 1000));
            if (Math.random() < Settings.goldenWordChance)
                this.words.push(new GoldenWord(wordsDB[Math.floor(Math.random() * wordsDB.length)], 30 * 1000));
        }
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
            const comboString = `COMBO: ${this.combo}, score multiplier: x${this.scoreMultiplier.toFixed(2)}`;
            const shineChance = Star.SHINE_BASE_CHANCE * (1 + Math.pow(this.combo, 1 / 1.15));
            const shineStr = 'shine chance every 100ms: ' + (shineChance * 100).toFixed(2) + '%';
            ctx.fillText(mainLoopString, 5, window.innerHeight - 5 - Settings.drawFpsFontSize);
            ctx.fillText(bgLoopString, 5, window.innerHeight - 5 - Settings.drawFpsFontSize * 2 - 1);
            ctx.fillText(comboString, 5, window.innerHeight - 5 - Settings.drawFpsFontSize * 3 - 2);
            ctx.fillText(shineStr, 5, window.innerHeight - 5 - Settings.drawFpsFontSize * 4 - 3);
            ctx.restore();
        }
        if (Settings.drawQuadTree)
            this.quadTree.renderAt(ctx);
        this.words.forEach((w) => w.draw(ctx));
    }
    queryQuadTree(query) {
        return this.quadTree.query(query);
    }
    subtractLife() {
        this.lives--;
        UiManager.getInstance().setLives(this.lives);
        if (this.lives === 0) {
            this.endGame();
            PromptManager.getInstance().setPlaceholder(`GAMEOVER! score: ${Math.round(this.score)}`);
            alert(`GAMEOVER! score: ${Math.round(this.score)}`);
        }
    }
    registerWord(word) {
        this.words.push(word);
    }
    getStartTimeStamp() {
        return this.startTimeStamp;
    }
    newGame() {
        this.score = 0;
        this.lives = 3;
        this.words = new Array();
        this.isStarted = true;
        this.spawnerTimer = 0;
        this.startTimeStamp = Date.now();
        UiManager.getInstance().show();
    }
    endGame() {
        UiManager.getInstance().hide();
        this.isStarted = false;
        this.spawnerTimer = 0;
        this.words = new Array();
    }
}
//# sourceMappingURL=GameManager.js.map