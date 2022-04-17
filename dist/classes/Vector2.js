export default class Vector2 {
    constructor(x, y) {
        this.x = x ?? 0;
        this.y = y ?? x ?? 0;
    }
    //#region static constructors
    static get Zero() {
        return new Vector2(0, 0);
    }
    static get Right() {
        return new Vector2(1, 0);
    }
    static get Left() {
        return new Vector2(-1, 0);
    }
    static get Down() {
        return new Vector2(0, 1);
    }
    static get Up() {
        return new Vector2(0, -1);
    }
    static get RandomDirection() {
        const angle = Math.random() * Math.PI * 2;
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }
    static FromAngle(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }
    //#endregion
    //#region math operators
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    divide(scalar) {
        if (scalar === 0)
            return this;
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }
    lerpTowards(target, t) {
        this.x += (target.x - this.x) * t;
        this.y += (target.y - this.y) * t;
    }
    //#endregion
    set(x, y) {
        this.x = x;
        this.y = y ?? x;
        return this;
    }
    setMagnitude(scalar) {
        this.normalize().multiply(scalar);
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        this.divide(this.getMagnitude());
        return this;
    }
    getNormalized() {
        return this.clone().normalize();
    }
    negate() {
        this.set(-this.x, -this.y);
        return this;
    }
    getNegated() {
        return this.clone().negate();
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    getDistanceTo(vec) {
        return Math.abs(this.clone().subtract(vec).getMagnitude());
    }
    //#region Utils
    clone() {
        return new Vector2(this.x, this.y);
    }
    toString() {
        return `x: ${this.x}, y: ${this.y}`;
    }
    toArray() {
        return [this.x, this.y];
    }
    renderAt(ctx, color, r = 2) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    //#endregion
    //#region Static functions
    static sum(...vectors) {
        const v = new Vector2(0, 0);
        for (const vec of vectors) {
            v.add(vec);
        }
        return v;
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static cross(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }
    static distance(v1, v2) {
        return v1.getDistanceTo(v2);
    }
    static lerp(v1, v2, t) {
        const x = v1.x + (v2.x - v1.x) * t;
        const y = v1.y + (v2.y - v1.y) * t;
        return new Vector2(x, y);
    }
}
