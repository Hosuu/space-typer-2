import BackgroundManager from '../managers/BackgroundManager.js';
import Settings from '../Settings.js';
import Vector2 from '../Vector2.js';
export default class Star {
    constructor(options) {
        const randX = Math.random() * window.innerWidth;
        const randY = Math.random() * window.innerHeight;
        this.position = options?.position ?? new Vector2(randX, randY);
        this.size = options?.size ?? 1 + Math.random() * 4;
        const randVelocity = Vector2.RandomDirection.multiply((1 / this.size) * 0.005);
        this.velocity = options?.velocity ?? randVelocity;
        this.hue = options?.hue ?? Math.random() * 360;
        this.stauration = options?.stauration ?? 6 + Math.random() * 6;
        this.lightness = options?.lightness ?? 25 + Math.random() * 60;
    }
    update(dt) {
        this.position.add(this.velocity.clone().multiply(dt));
        const offset = 50;
        const vWidth = window.innerWidth;
        const vHeight = window.innerHeight;
        if (this.position.x > vWidth + offset)
            this.position.x -= vWidth + offset;
        if (this.position.x < -offset)
            this.position.x += vWidth + offset;
        if (this.position.y > vHeight + offset)
            this.position.y -= vHeight + offset;
        if (this.position.y < -offset)
            this.position.y += vHeight + offset;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `hsl(${this.hue}deg, ${this.stauration}%, ${this.lightness}%)`;
        ctx.beginPath();
        const widnowCenter = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
        const mousePosFromCenter = BackgroundManager.getInstance()
            .getMousePos()
            .subtract(widnowCenter);
        const distFromCenter = Vector2.distance(this.position, widnowCenter) / window.innerWidth;
        const parallaxX = (mousePosFromCenter.x / (500 * this.size)) * distFromCenter * this.size ** 3;
        const parallaxY = (mousePosFromCenter.y / (500 * this.size)) * distFromCenter * this.size ** 3;
        const x = Settings.starsParalax ? this.position.x - parallaxX : this.position.x;
        const y = Settings.starsParalax ? this.position.y - parallaxY : this.position.y;
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    randomizePosition() {
        const randX = Math.random() * window.innerWidth;
        const randY = Math.random() * window.innerHeight;
        this.position = new Vector2(randX, randY);
    }
}
//# sourceMappingURL=Star.js.map