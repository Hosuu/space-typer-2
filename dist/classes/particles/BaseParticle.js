import ParticlesManager from '../managers/ParticlesManager.js';
import Vector2 from '../Vector2.js';
export default class BaseParticle {
    constructor(opt) {
        const manager = ParticlesManager.getInstance();
        manager.registerParticle(this);
        this.position = opt.position.clone();
        this.dead = false;
        this.velocity = opt.velocity?.clone() ?? Vector2.Zero;
        this.velocityDelta = opt.velocityDelta?.clone() ?? Vector2.Zero;
        this.velocityScaling = opt.velocityScaling ?? 1;
        this.size = opt.size ?? 2;
        this.sizeDelta = opt.sizeDelta ?? 0;
        this.sizeScaling = opt.sizeScaling ?? 1;
        this.duration = opt.duration ?? 1000;
        this.lifeTime = 0;
        this.color = opt.color ?? '#fff';
    }
    update(dt) {
        if (this.dead)
            return;
        this.lifeTime += dt;
        if (this.lifeTime > this.duration) {
            this.dead = true;
            return;
        }
        this.velocity.multiply(this.velocityScaling ** dt);
        this.velocity.add(this.velocityDelta.clone().multiply(dt));
        this.position.add(this.velocity.clone().multiply(dt));
        this.size *= this.sizeScaling;
        this.size += this.sizeDelta;
    }
    isDead() {
        return this.dead;
    }
}
//# sourceMappingURL=BaseParticle.js.map