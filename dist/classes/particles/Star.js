import Easing from '../Easing.js';
import Vector2 from '../Vector2.js';
export default class Star {
    position;
    positionOffest;
    velocity;
    size;
    hue;
    stauration;
    lightness;
    shineTimer;
    shineInterval;
    baseShineChance;
    isShining;
    shineScale;
    shineEasedScale;
    constructor(options, parent) {
        const { width, height } = parent.getScreenSize();
        const randX = Math.random() * width;
        const randY = Math.random() * height;
        this.position = options?.position ?? new Vector2(randX, randY);
        this.positionOffest = new Vector2();
        this.size = options?.size ?? 1 + Math.random() * 4;
        const randVelocity = Vector2.RandomDirection.multiply((1 / this.size) * 0.005);
        this.velocity = options?.velocity ?? randVelocity;
        this.hue = options?.hue ?? Math.random() * 360;
        this.stauration = options?.stauration ?? 6 + Math.random() * 6;
        this.lightness = options?.lightness ?? 25 + Math.random() * 60;
        this.shineInterval = 100;
        this.shineTimer = this.shineInterval * Math.random();
        this.baseShineChance = 0.0005;
        this.isShining = false;
        this.shineScale = 0;
        this.shineEasedScale = 0;
    }
    update(dt, parent) {
        this.position.add(this.velocity.clone().multiply(dt));
        this.positionOffest.add(parent.getMouseMovement().multiply(0.05 * Math.sqrt(this.size)));
        const positionDiff = this.position.clone();
        this.position.lerpTowards(this.position.clone().add(this.positionOffest), 0.001 * dt);
        this.positionOffest.add(positionDiff.subtract(this.position));
        this.shineTimer += dt;
        if (!this.isShining && this.shineTimer > this.shineInterval) {
            this.shineTimer -= this.shineInterval;
            if (Math.random() < this.baseShineChance * parent?.getShiningChanceMultiplier()) {
                this.isShining = true;
            }
        }
        this.shineScale = clamp01(this.shineScale + dt * (this.isShining ? 0.004 : -0.0005));
        this.shineEasedScale = Easing.easeInCubic(this.shineScale);
        if (this.shineScale == 1)
            this.isShining = false;
        const offset = 5;
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
        ctx.fillStyle = `hsl(${this.hue}deg, ${this.stauration + (80 - this.stauration) * this.shineEasedScale}%, ${this.lightness + (80 - this.lightness) * this.shineEasedScale}%)`;
        ctx.beginPath();
        const { width, height } = parent.getScreenSize();
        const widnowCenter = new Vector2(width / 2, height / 2);
        const mousePosFromCenter = parent.getMousePos().subtract(widnowCenter);
        const distFromCenter = Vector2.distance(this.position, widnowCenter) / width;
        const parallaxX = (mousePosFromCenter.x / (800 * this.size)) * distFromCenter * this.size ** 3;
        const parallaxY = (mousePosFromCenter.y / (800 * this.size)) * distFromCenter * this.size ** 3;
        const x = this.position.x;
        const y = this.position.y;
        ctx.arc(x, y, this.size + (this.size * this.shineEasedScale) / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    rescalePosition(oldSize, newSize) {
        const percentX = this.position.x / oldSize.x;
        const percentY = this.position.y / oldSize.y;
        const newX = newSize.x * percentX;
        const newY = newSize.y * percentY;
        this.position.set(newX, newY);
    }
}
function clamp01(value) {
    if (value > 1)
        return 1;
    if (value < 0)
        return 0;
    return value;
}
//# sourceMappingURL=Star.js.map