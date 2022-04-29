import BackgroundWorkerManager from '../../BackgroundWorkerManager.js';
import { clamp01, lerp, randomRanged } from '../../Utils.js';
import Easing from '../Easing.js';
import Vector2 from '../Vector2.js';
export default class Star {
    position;
    positionOffest;
    velocity;
    static MIN_SIZE = 1;
    static MAX_SIZE = 5;
    size;
    hue;
    stauration;
    lightness;
    static SHINE_INTERVAL = 100;
    static SHINE_BASE_CHANCE = 0.00025;
    static SHINE_SIZE_MULTIPLIER = 1.2;
    static SHINE_SATURATION = 60;
    static SHINE_LIGHTNESS = 80;
    shineTimer;
    isShining;
    shineScale;
    shineEasedScale;
    constructor(options) {
        const { width, height } = BackgroundWorkerManager.getInstance().getScreenSize();
        const randX = Math.random() * (width + Star.MAX_SIZE * Star.SHINE_SIZE_MULTIPLIER);
        const randY = Math.random() * (height + Star.MAX_SIZE * Star.SHINE_SIZE_MULTIPLIER);
        this.position = options?.position ?? new Vector2(randX, randY);
        this.positionOffest = new Vector2();
        this.size = randomRanged(Star.MIN_SIZE, Star.MAX_SIZE);
        const randVelocity = Vector2.RandomDirection.multiply((1 / this.size) * 0.005);
        this.velocity = options?.velocity ?? randVelocity;
        this.hue = options?.hue ?? Math.random() * 360;
        this.stauration = options?.stauration ?? 6 + Math.random() * 6;
        this.lightness = options?.lightness ?? 25 + Math.random() * 60;
        this.shineTimer = Star.SHINE_INTERVAL * Math.random();
        this.isShining = false;
        this.shineScale = 0;
        this.shineEasedScale = 0;
    }
    update(dt, parent) {
        this.position.add(this.velocity.clone().multiply(dt));
        if (parent.getParallaxEnabled()) {
            this.positionOffest.add(parent.getMouseMovement().multiply(parent.getParallaxScale() * Math.sqrt(this.size)));
            const positionDiff = this.position.clone();
            this.position.lerpTowards(this.position.clone().add(this.positionOffest), 0.001 * dt * parent.getParallaxSpeed());
            this.positionOffest.add(positionDiff.subtract(this.position));
        }
        if (parent.getShiningEnabled()) {
            this.shineTimer += dt;
            if (!this.isShining && this.shineTimer > Star.SHINE_INTERVAL) {
                this.shineTimer -= Star.SHINE_INTERVAL;
                if (Math.random() < Star.SHINE_BASE_CHANCE * parent?.getShiningChanceMultiplier()) {
                    this.isShining = true;
                }
            }
            this.shineScale = clamp01(this.shineScale + dt * (this.isShining ? 0.004 : -0.00005));
            this.shineEasedScale = Easing.easeInCubic(this.shineScale);
            if (this.shineScale == 1)
                this.isShining = false;
        }
        else {
            this.shineScale = 0;
        }
        const { width: vWidth, height: vHeight } = parent.getScreenSize();
        const offset = Star.MAX_SIZE * Star.SHINE_SIZE_MULTIPLIER;
        if (this.position.x > vWidth + offset)
            this.position.x -= vWidth + offset;
        else if (this.position.x < -offset)
            this.position.x += vWidth + offset;
        if (this.position.y > vHeight + offset)
            this.position.y -= vHeight + offset;
        else if (this.position.y < -offset)
            this.position.y += vHeight + offset;
    }
    draw(ctx) {
        const hue = this.hue;
        const saturation = lerp(this.stauration, Star.SHINE_SATURATION, this.shineEasedScale);
        const lightness = lerp(this.lightness, Star.SHINE_LIGHTNESS, this.shineEasedScale);
        const x = this.position.x;
        const y = this.position.y;
        const size = this.size * lerp(1, Star.SHINE_SIZE_MULTIPLIER, this.shineEasedScale);
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = `hsl(${hue}deg, ${saturation}%, ${lightness}%)`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    rescalePosition(oldViewportSize, newViewportSize) {
        const percentX = this.position.x / oldViewportSize.x;
        const percentY = this.position.y / oldViewportSize.y;
        const newX = newViewportSize.x * percentX;
        const newY = newViewportSize.y * percentY;
        this.position.set(newX, newY);
    }
}
//# sourceMappingURL=Star.js.map