export function clamp01(value) {
    if (value > 1)
        return 1;
    if (value < 0)
        return 0;
    return value;
}
export function lerp(v1, v2, t) {
    return v1 + (v2 - v1) * t;
}
export function randomRanged(min, max) {
    return lerp(min, max, Math.random());
}
//# sourceMappingURL=Utils.js.map