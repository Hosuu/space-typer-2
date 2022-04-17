import Star from '../particles/Star.js';
import Settings from '../Settings.js';
import SpaceTyperEngine from '../SpaceTyperEngine.js';
import Vector2 from '../Vector2.js';
import RenderManager from './RenderManager.js';
export default class BackgroundManager {
    //#endregion
    constructor() {
        BackgroundManager._instance = this;
        this.stars = new Array();
        this.canvas = RenderManager.getInstance().background.canvas;
        this.ctx = RenderManager.getInstance().background.context;
        this.mousePosition = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
        this.enabled = Settings.backgroundEnabled;
        this.setBlur(Settings.backgroundBlur);
        this.setOpacity(Settings.backgroundOpacity);
        this.starsLimit = Settings.backgroundStarsCount;
        for (let i = 0; i < this.starsLimit; i++)
            this.stars.push(new Star());
        window.addEventListener('mousemove', (e) => {
            this.mousePosition = new Vector2(e.x, e.y);
        });
    }
    static getInstance() {
        return this._instance;
    }
    isEnabled() {
        return this.enabled;
    }
    setEnabled(value) {
        this.enabled = value;
    }
    getStarLimit() {
        return this.starsLimit;
    }
    setStarLimit(limit) {
        this.starsLimit = limit;
        //Too much
        if (this.stars.length > limit)
            this.stars = this.stars.filter((star, index) => index < this.starsLimit - 1);
        //Not enough
        while (this.stars.length < limit) {
            this.stars.push(new Star());
        }
    }
    getBlur() {
        return parseFloat(this.canvas.style.getPropertyValue('--blur'));
    }
    setBlur(value) {
        this.canvas.style.setProperty('--blur', value + 'px');
    }
    getOpacity() {
        return parseFloat(this.canvas.style.getPropertyValue('opacity'));
    }
    setOpacity(value) {
        this.canvas.style.setProperty('opacity', value.toString());
    }
    update() {
        if (!this.enabled)
            return;
        const dt = SpaceTyperEngine.getDeltaTime();
        this.stars.forEach((star) => star.update(dt));
    }
    draw() {
        if (!this.enabled)
            return;
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.stars.forEach((star) => star.draw(this.ctx));
    }
    randomizeStarPositions() {
        this.stars.forEach((s) => s.randomizePosition());
    }
    getMousePos() {
        return this.mousePosition.clone();
    }
}
