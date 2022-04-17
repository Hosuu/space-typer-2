export default class Circle {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }
    getTopY() {
        return this.position.y - this.radius;
    }
    getBottomY() {
        return this.position.y + this.radius;
    }
    getLeftX() {
        return this.position.x - this.radius;
    }
    getRightX() {
        return this.position.x + this.radius;
    }
    getArea() {
        return Math.PI * this.radius ** 2;
    }
    getCenterPoint() {
        return this.position.clone();
    }
    getDiameter() {
        return this.radius * 2;
    }
    renderAt(ctx, color, width = 1) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}
//# sourceMappingURL=Circle.js.map