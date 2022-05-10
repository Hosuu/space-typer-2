import Easing from '../Easing.js';
import Settings from '../Settings.js';
import BaseParticle from './BaseParticle.js';
export default class WordParticle extends BaseParticle {
    text;
    constructor(opt) {
        super(opt);
        this.text = opt.text;
        this.size = opt.size ?? 1;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 1 - Easing.easeOutCirc(this.lifeFraction);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${(1 - Easing.easeInCubic(this.lifeFraction)) * Settings.wordFontSize * this.size}px ${Settings.wordFont}, Comfortaa, sans-serif`;
        ctx.fillText(this.text, this.position.x, this.position.y);
        ctx.restore();
    }
}
//# sourceMappingURL=WordParticle.js.map