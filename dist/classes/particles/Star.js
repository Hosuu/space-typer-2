import Vector2 from '../Vector2.js';
export default class Star {
    position;
    size;
    velocity;
    hue;
    stauration;
    lightness;
    constructor(options, parent) {
        const { width, height } = parent.getScreenSize();
        const randX = Math.random() * width;
        const randY = Math.random() * height;
        this.position = options?.position ?? new Vector2(randX, randY);
        this.size = options?.size ?? 1 + Math.random() * 4;
        const randVelocity = Vector2.RandomDirection.multiply((1 / this.size) * 0.005);
        this.velocity = options?.velocity ?? randVelocity;
        this.hue = options?.hue ?? Math.random() * 360;
        this.stauration = options?.stauration ?? 6 + Math.random() * 6;
        this.lightness = options?.lightness ?? 25 + Math.random() * 60;
    }
    update(dt, parent) {
        this.position.add(this.velocity.clone().multiply(dt));
        const offset = 50;
        const { width: vWidth, height: vHeight } = parent.getScreenSize();
        if (this.position.x > vWidth + offset)
            this.position.x -= vWidth + offset;
        if (this.position.x < -offset)
            this.position.x += vWidth + offset;
        if (this.position.y > vHeight + offset)
            this.position.y -= vHeight + offset;
        if (this.position.y < -offset)
            this.position.y += vHeight + offset;
    }
    draw(ctx, parent) {
        ctx.save();
        ctx.fillStyle = `hsl(${this.hue}deg, ${this.stauration}%, ${this.lightness}%)`;
        ctx.beginPath();
        const { width, height } = parent.getScreenSize();
        const widnowCenter = new Vector2(width / 2, height / 2);
        const mousePosFromCenter = parent.getMousePos().subtract(widnowCenter);
        const distFromCenter = Vector2.distance(this.position, widnowCenter) / width;
        const parallaxX = (mousePosFromCenter.x / (500 * this.size)) * distFromCenter * this.size ** 3;
        const parallaxY = (mousePosFromCenter.y / (500 * this.size)) * distFromCenter * this.size ** 3;
        const x = this.position.x - parallaxX;
        const y = this.position.y - parallaxY;
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
//# sourceMappingURL=Star.js.map