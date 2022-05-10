import BackgroundManager from './managers/BackgroundManager.js';
import GameManager from './managers/GameManager.js';
import ParticlesManager from './managers/ParticlesManager.js';
import PromptManager from './managers/PromptManager.js';
import UiManager from './managers/UiManager.js';
import Settings from './Settings.js';
import Rect from './shapes/Rect.js';
import Vector2 from './Vector2.js';
export default class SpaceTyperEngine {
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
        this.uiManager = new UiManager();
        this.gameManager = new GameManager();
        this.particlesManager = new ParticlesManager();
        this.backgroundManager = new BackgroundManager();
        this.promptManager = new PromptManager();
        window.addEventListener('focus', this.resume.bind(this));
        window.addEventListener('blur', this.pause.bind(this));
        window.addEventListener('resize', this.resizeEventHandler.bind(this));
        window.dispatchEvent(new Event('resize'));
        this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this));
        if (document.visibilityState === 'hidden')
            this.pause();
    }
    mainLoop(timeStamp) {
        const dt = timeStamp - this.lastUpdateTimeStamp;
        this.deltaTime = dt;
        this.timeElapsed += dt;
        this.gameManager.update(dt);
        this.particlesManager.update(dt);
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
        this.particlesManager.getCanvas().style.setProperty('--gray', '1');
        this.gameManager.getCanvas().classList.add('animateCanv');
        this.gameManager.getCanvas().style.setProperty('--gray', '1');
        this.gameManager.getCanvas().style.setProperty('--blur', '6px');
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
        this.particlesManager.getCanvas().style.setProperty('--gray', '0');
        this.gameManager.getCanvas().classList.remove('animateCanv');
        this.gameManager.getCanvas().style.setProperty('--gray', '0');
        this.gameManager.getCanvas().style.setProperty('--blur', '0px');
    }
    resizeEventHandler() {
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.particlesManager.getCanvas().width = width;
        this.particlesManager.getCanvas().height = height;
        this.gameManager.getCanvas().width = width;
        this.gameManager.getCanvas().height = height;
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