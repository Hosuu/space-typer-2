import Easing from '../Easing.js';
import Settings from '../Settings.js';
import BaseParticle from './BaseParticle.js';
export default class WordParticle extends BaseParticle {
    constructor(opt) {
        super(opt);
        this.text = opt.text;
        this.size = opt.size ?? 1;
    }
    draw(ctx) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${Settings.wordFontSize * this.size}px ${Settings.wordFont}, Comfortaa, sans-serif`;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1 - Easing.easeOutCirc(this.lifeTime / this.duration);
        ctx.fillText(this.text, this.position.x, this.position.y);
        ctx.restore();
    }
}
//# sourceMappingURL=WordParticle.js.map