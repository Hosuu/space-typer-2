import Settings from '../Settings.js';
import SpaceTyperEngine from '../SpaceTyperEngine.js';
import RenderManager from './RenderManager.js';
export default class ParticlesManager {
    constructor() {
        if (ParticlesManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        ParticlesManager._instance = this;
        this.canvas = RenderManager.getInstance().particle.canvas;
        this.ctx = RenderManager.getInstance().particle.context;
        this.enabled = Settings.particlesEnabled;
        this.setBlur(Settings.particlesBlur);
        this.setOpacity(Settings.particlesOpacity);
        this.particlesLimit = Settings.particlesLimit;
        this.particles = new Array();
    }
    static getInstance() {
        return this._instance;
    }
    isEnabled() {
        return this.enabled;
    }
    getParticlesCount() {
        return this.particles.length;
    }
    getParticlesLimit() {
        return this.particlesLimit;
    }
    setParticlesLimit(value) {
        this.particlesLimit = value;
        if (this.particles.length > this.particlesLimit)
            this.particles = this.particles.filter((particle, index) => index < this.particlesLimit - 1);
    }
    registerParticle(p) {
        if (this.particles.length + 1 >= this.particlesLimit)
            return false;
        this.particles.push(p);
        return true;
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
        this.particles.forEach((p) => p.update(dt));
        this.particles = this.particles.filter((p) => !p.isDead());
    }
    draw() {
        if (!this.enabled)
            return;
        const ctx = RenderManager.getInstance().particle.context;
        ctx.save();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.particles.forEach((p) => p.draw(ctx));
        ctx.restore();
    }
}
