import ParticlesManager from '../managers/ParticlesManager.js';
import Vector2 from '../Vector2.js';
export default class BaseParticle {
    dead;
    position;
    velocity;
    acceleration;
    duration;
    lifeTime;
    lifeFraction;
    color;
    size;
    constructor(opt) {
        const manager = ParticlesManager.getInstance();
        manager.registerParticle(this);
        this.dead = false;
        this.position = opt.position.clone();
        this.velocity = opt.velocity?.clone() ?? Vector2.Zero;
        this.acceleration = opt.acceleration?.clone() ?? Vector2.Zero;
        this.duration = opt.duration ?? 1000;
        this.lifeTime = 0;
        this.lifeFraction = this.lifeTime / this.duration;
        this.size = opt.size ?? 2;
        this.color = opt.color ?? '#fafafa';
    }
    update(dt) {
        if (this.dead)
            return;
        this.lifeTime += dt;
        this.lifeFraction = this.lifeTime / this.duration;
        if (this.lifeFraction > 1) {
            this.dead = true;
            return;
        }
        this.velocity.add(this.acceleration.clone().multiply(dt));
        this.position.add(this.velocity.clone().multiply(dt));
    }
    isDead() {
        return this.dead;
    }
}
//# sourceMappingURL=BaseParticle.js.map