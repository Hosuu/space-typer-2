import BaseParticle from './BaseParticle.js';
export default class CircleParticle extends BaseParticle {
    constructor(options) {
        super(options);
    }
    draw(ctx) {
        if (this.dead)
            return;
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1 - this.lifeFraction;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
//# sourceMappingURL=CircleParticle.js.map