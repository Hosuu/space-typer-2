export default class RenderManager {
    particleCanvas;
    gameCanvas;
    static _instance;
    static getInstance() {
        return this._instance;
    }
    constructor() {
        if (RenderManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        RenderManager._instance = this;
        const partCanvHook = document.querySelector('#particles_renderer');
        const gameCanvHook = document.querySelector('#game_renderer');
        if (!partCanvHook || !gameCanvHook)
            throw new Error('RENDERER HOOK ERROR');
        this.particleCanvas = partCanvHook;
        this.gameCanvas = gameCanvHook;
        window.addEventListener('resize', this.resizeEventHandler.bind(this));
        window.dispatchEvent(new Event('resize'));
    }
    get particle() {
        const canvas = this.particleCanvas;
        const context = canvas.getContext('2d');
        return {
            get canvas() {
                return canvas;
            },
            get context() {
                return context;
            },
        };
    }
    get game() {
        const canvas = this.gameCanvas;
        const context = canvas.getContext('2d');
        return {
            get canvas() {
                return canvas;
            },
            get context() {
                return context;
            },
        };
    }
}
//# sourceMappingURL=RenderManager.js.map