import Settings from '../Settings.js';
export default class BackgroundManager {
    enabled;
    canvas;
    worker;
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
        this.worker = new Worker('../dist/WebWorker.js', { type: 'module' });
        this.worker.postMessage(['init', offscreenCanv], [offscreenCanv]);
        this.worker.postMessage(['setStarsCount', this.starsCount]);
        if (!this.enabled)
            this.worker.postMessage(['pauseLoop']);
        window.addEventListener('mousemove', ({ x, y }) => {
            this.worker.postMessage(['updateMousePosition', { x, y }]);
        });
        window.addEventListener('resize', this.resizeHandler.bind(this));
        this.resizeHandler();
    }
    resizeHandler() {
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.worker.postMessage(['resizeCanvas', { width, height }]);
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