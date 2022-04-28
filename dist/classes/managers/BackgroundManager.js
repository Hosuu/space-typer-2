import Settings from '../Settings.js';
import Vector2 from '../Vector2.js';
export default class BackgroundManager {
    enabled;
    canvas;
    worker;
    workerDeltaTime;
    starsCount;
    static _instance;
    static getInstance() {
        return this._instance;
    }
    constructor() {
        BackgroundManager._instance = this;
        const canvasHook = document.querySelector('#background_renderer');
        this.canvas = canvasHook;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const offscreenCanv = this.canvas.transferControlToOffscreen();
        this.enabled = Settings.backgroundEnabled;
        this.setBlur(Settings.backgroundBlur);
        this.setOpacity(Settings.backgroundOpacity);
        this.starsCount = Settings.backgroundStarsCount;
        this.worker = new Worker('../dist/BackgroundWorkerManager.js', { type: 'module' });
        this.workerDeltaTime = 0;
        this.worker.postMessage(['init', offscreenCanv], [offscreenCanv]);
        this.worker.postMessage(['setStarsCount', this.starsCount]);
        if (!this.enabled)
            this.worker.postMessage(['pauseLoop']);
        window.addEventListener('mousemove', ({ x, y, movementX, movementY }) => {
            const position = new Vector2(x, y);
            const movement = new Vector2(movementX, movementY);
            this.worker.postMessage(['updateMousePosition', [position, movement]]);
        });
        this.worker.addEventListener('message', this.messageHandler.bind(this));
        window.addEventListener('resize', this.resizeHandler.bind(this));
        this.resizeHandler();
    }
    messageHandler(event) {
        const [message, data] = event.data;
        switch (message) {
            case 'deltaTime':
                this.workerDeltaTime = data;
                break;
        }
    }
    resizeHandler() {
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.worker.postMessage(['resizeCanvas', { width, height }]);
    }
    getWorkerDeltaTime() {
        return this.workerDeltaTime;
    }
    clearCanvas() {
        this.worker.postMessage(['clearScreen']);
    }
    isEnabled() {
        return this.enabled;
    }
    setEnabled(value) {
        if (this.enabled != value) {
            this.enabled = value;
            this.worker.postMessage([value ? 'resumeLoop' : 'pauseLoop']);
        }
    }
    getStarsCount() {
        return this.starsCount;
    }
    setStarCount(count) {
        if (this.starsCount != count) {
            this.starsCount = count;
            this.worker.postMessage(['setStarsCount', count]);
        }
    }
    getBlur() {
        return parseFloat(this.canvas.style.getPropertyValue('--blur'));
    }
    setBlur(value) {
        this.canvas.style.setProperty('--blur', value + 'px');
    }
    getGrayScale() {
        return parseFloat(this.canvas.style.getPropertyValue('--gray'));
    }
    setGrayScale(value) {
        this.canvas.style.setProperty('--gray', value.toString());
    }
    getOpacity() {
        return parseFloat(this.canvas.style.getPropertyValue('opacity'));
    }
    setOpacity(value) {
        this.canvas.style.setProperty('opacity', value.toString());
    }
}
//# sourceMappingURL=BackgroundManager.js.map