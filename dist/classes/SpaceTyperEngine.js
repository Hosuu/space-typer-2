import BackgroundManager from './managers/BackgroundManager.js';
import GameManager from './managers/GameManager.js';
import ParticlesManager from './managers/ParticlesManager.js';
import PromptManager from './managers/PromptManager.js';
import RenderManager from './managers/RenderManager.js';
import UiManager from './managers/UiManager.js';
import Settings from './Settings.js';
import Rect from './shapes/Rect.js';
import Vector2 from './Vector2.js';
export default class SpaceTyperEngine {
    renderManager;
    uiManager;
    gameManager;
    particlesManager;
    backgroundManager;
    promptManager;
    isRunning;
    lastUpdateTimeStamp;
    lastRequestedFrameId;
    frameCount;
    deltaTime;
    timeElapsed;
    static _instance;
    static getInstance() {
        return this._instance;
    }
    constructor() {
        if (SpaceTyperEngine._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        SpaceTyperEngine._instance = this;
        this.isRunning = true;
        this.lastUpdateTimeStamp = performance.now();
        this.lastRequestedFrameId = 0;
        this.frameCount = 0;
        this.deltaTime = 0;
        this.timeElapsed = 0;
        this.renderManager = new RenderManager();
        this.uiManager = new UiManager();
        this.gameManager = new GameManager();
        this.particlesManager = new ParticlesManager();
        this.backgroundManager = new BackgroundManager();
        this.promptManager = new PromptManager();
        window.addEventListener('focus', this.resume.bind(this));
        window.addEventListener('blur', this.pause.bind(this));
        this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this));
        if (document.visibilityState === 'hidden')
            this.pause();
    }
    mainLoop(timeStamp) {
        const dt = timeStamp - this.lastUpdateTimeStamp;
        this.deltaTime = dt;
        this.timeElapsed += dt;
        this.gameManager.update();
        this.particlesManager.update();
        this.uiManager.update();
        this.gameManager.draw();
        this.particlesManager.draw();
        this.uiManager.draw();
        this.lastUpdateTimeStamp = timeStamp;
        this.frameCount += 1;
        this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this));
    }
    pause() {
        if (!this.isRunning)
            return;
        window.cancelAnimationFrame(this.lastRequestedFrameId);
        this.isRunning = false;
        this.backgroundManager.setGrayScale(1);
        this.backgroundManager.setBlur(3);
        this.backgroundManager.setEnabled(false);
        this.renderManager.particle.canvas.style.setProperty('--gray', '1');
        this.renderManager.game.canvas.classList.add('animateCanv');
        this.renderManager.game.canvas.style.setProperty('--gray', '1');
        this.renderManager.game.canvas.style.setProperty('--blur', '6px');
    }
    resume() {
        if (this.isRunning)
            return;
        this.lastUpdateTimeStamp = performance.now();
        this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this));
        this.isRunning = true;
        this.backgroundManager.setGrayScale(0);
        this.backgroundManager.setBlur(Settings.backgroundBlur);
        this.backgroundManager.setEnabled(Settings.backgroundEnabled);
        this.renderManager.game.canvas.classList.remove('animateCanv');
        this.renderManager.game.canvas.style.setProperty('--gray', '0');
        this.renderManager.game.canvas.style.setProperty('--blur', '0px');
    }
    static getDeltaTime() {
        return this.getInstance().deltaTime;
    }
    static getTimeElapsed() {
        return this.getInstance().timeElapsed;
    }
    getAvgFps() {
        return 1000 / (this.timeElapsed / this.frameCount);
    }
    static getGameArea() {
        const topPadding = 64;
        const bottomPadding = 80;
        const position = new Vector2(0, 64);
        const height = window.innerHeight - topPadding - bottomPadding;
        const width = window.innerWidth;
        return new Rect(position, width, height);
    }
}
//# sourceMappingURL=SpaceTyperEngine.js.map