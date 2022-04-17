import Vector2 from '../Vector2.js';
export default class Rect {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height || width;
    }
    getTopY() {
        return this.position.y;
    }
    getBottomY() {
        return this.position.y + this.height;
    }
    getLeftX() {
        return this.position.x;
    }
    getRightX() {
        return this.position.x + this.width;
    }
    getArea() {
        return this.width * this.height;
    }
    getCenterPoint() {
        return Vector2.lerp(this.position, new Vector2(this.getRightX(), this.getBottomY()), 0.5);
    }
    renderAt(ctx, color, width = 1) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.stroke();
        ctx.restore();
    }
}
