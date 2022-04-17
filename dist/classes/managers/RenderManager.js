﻿import BackgroundManager from './BackgroundManager.js';
export default class RenderManager {
    constructor() {
        if (RenderManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        RenderManager._instance = this;
        const bgCanvHook = document.querySelector('#background_renderer');
        const partCanvHook = document.querySelector('#particles_renderer');
        const gameCanvHook = document.querySelector('#game_renderer');
        if (!bgCanvHook || !partCanvHook || !gameCanvHook)
            throw new Error('RENDERER HOOK ERROR');
        this.backgroundCanvas = bgCanvHook;
        this.particleCanvas = partCanvHook;
        this.gameCanvas = gameCanvHook;
        window.addEventListener('resize', this.resizeEventHandler.bind(this));
        window.dispatchEvent(new Event('resize'));
    }
    static getInstance() {
        return this._instance;
    }
    resizeEventHandler() {
        const height = window.innerHeight;
        const width = window.innerWidth;
        BackgroundManager.getInstance()?.randomizeStarPositions();
        this.backgroundCanvas.width = width;
        this.backgroundCanvas.height = height;
        this.particleCanvas.width = width;
        this.particleCanvas.height = height;
        this.gameCanvas.width = width;
        this.gameCanvas.height = height;
    }
    get background() {
        const canvas = this.backgroundCanvas;
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