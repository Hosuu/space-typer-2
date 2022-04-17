import BackgroundManager from './managers/BackgroundManager.js';
import GameManager from './managers/GameManager.js';
import ParticlesManager from './managers/ParticlesManager.js';
import PromptManager from './managers/PromptManager.js';
import RenderManager from './managers/RenderManager.js';
import UiManager from './managers/UiManager.js';
export default class SpaceTyperEngine {
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
    static getInstance() {
        return this._instance;
    }
    mainLoop(timeStamp) {
        const dt = timeStamp - this.lastUpdateTimeStamp;
        this.deltaTime = dt;
        this.timeElapsed += dt;
        this.gameManager.update();
        this.particlesManager.update();
        this.backgroundManager.update();
        this.uiManager.update();
        this.gameManager.draw();
        this.particlesManager.draw();
        this.backgroundManager.draw();
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
        this.renderManager.background.canvas.style.setProperty('--gray', '1');
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
        this.renderManager.background.canvas.style.setProperty('--gray', '0');
        this.renderManager.particle.canvas.style.setProperty('--gray', '0');
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
    getFps() {
        return 1000 / this.deltaTime;
    }
}
//# sourceMappingURL=SpaceTyperEngine.js.map