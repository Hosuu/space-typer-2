import Settings from '../Settings.js';
export default class ParticlesManager {
    enabled;
    canvas;
    particlesLimit;
    particles;
    static _instance;
    static getInstance() {
        return this._instance;
    }
    constructor() {
        if (ParticlesManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        ParticlesManager._instance = this;
        this.canvas = document.querySelector('canvas#particles_renderer');
        this.enabled = Settings.particlesEnabled;
        this.setBlur(Settings.particlesBlur);
        this.setOpacity(Settings.particlesOpacity);
        this.particlesLimit = Settings.particlesLimit;
        this.particles = new Array();
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
            this.particles = this.particles.filter((_, index) => index < this.particlesLimit - 1);
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
    update(dt) {
        if (!this.enabled)
            return;
        this.particles.forEach((p) => p.update(dt));
        this.particles = this.particles.filter((p) => !p.isDead());
    }
    draw() {
        if (!this.enabled)
            return;
        const ctx = this.canvas.getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.particles.forEach((p) => p.draw(ctx));
        ctx.restore();
    }
    getCanvas() {
        return this.canvas;
    }
}
//# sourceMappingURL=ParticlesManager.js.map