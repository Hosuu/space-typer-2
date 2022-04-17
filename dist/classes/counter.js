import Easing from './Easing.js'
export default class Counter {
	constructor(value) {
		this.count = value
		this.startCount = value
		this.startTimeStamp = Date.now()
		this.targetCount = value
		this.targetTimeStamp = Date.now()
	}
	setCount(targetCount, time) {
		this.startCount = this.count
		this.startTimeStamp = Date.now()
		this.targetCount = targetCount
		this.targetTimeStamp = Date.now() + time
	}
	update() {
		const duration = this.targetTimeStamp - this.startTimeStamp
		const elapsed = Date.now() - this.startTimeStamp
		const t = clamp01(elapsed / duration)
		const x = Easing.easeOutCubic(t)
		this.count = lerp(this.startCount, this.targetCount, x)
	}
	draw(element, precision) {
		const value = this.count.toFixed(precision)
		if (element.innerHTML != value) element.innerHTML = value
	}
}
function clamp01(value) {
	if (value > 1) return 1
	if (value < 0) return 0
	return value
}
function lerp(v1, v2, t) {
	return v1 + (v2 - v1) * t
}
//# sourceMappingURL=counter.js.map
