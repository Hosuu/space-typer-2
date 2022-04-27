import Star from './classes/particles/Star.js';
import Settings from './classes/Settings.js';
import Vector2 from './classes/Vector2.js';
self.addEventListener('error', (e) => console.log(e));
self.addEventListener('message', (e) => {
    const [message, arg] = e.data;
    if (message !== 'init')
        return;
    self.instance = new OffscreenBackgroundManager(arg);
});
class OffscreenBackgroundManager {
    canvas;
    ctx;
    isRunning;
    lastUpdateTimeStamp;
    lastRequestedFrameId;
    stars;
    starsCount;
    mousePosition;
    parallaxSpeed;
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isRunning = true;
        this.lastUpdateTimeStamp = null;
        this.lastRequestedFrameId = 0;
        this.stars = new Array();
        this.starsCount = 0;
        this.setStarsCount(Settings.backgroundStarsCount);
        this.mousePosition = new Vector2(canvas.width / 2, canvas.height / 2);
        this.parallaxSpeed = 1;
        self.addEventListener('message', this.messageHandler.bind(this));
        this.lastRequestedFrameId = self.requestAnimationFrame(this.mainLoop.bind(this));
    }
    messageHandler(event) {
        const [message, data] = event.data;
        switch (message) {
            case 'updateMousePosition':
                data.__proto__ = Vector2.prototype;
                this.mousePosition = data;
                break;
            case 'resizeCanvas':
                this.canvas.width = data.width;
                this.canvas.height = data.height;
                break;
            case 'clearScreen':
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'setStarsCount':
                this.setStarsCount(data);
                break;
            case 'pauseLoop':
                this.pauseLoop();
                break;
            case 'resumeLoop':
                this.resumeLoop();
                break;
        }
    }
    mainLoop(timeStamp) {
        const deltaTime = timeStamp - (this.lastUpdateTimeStamp ?? timeStamp);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const star of this.stars) {
            star.update(deltaTime, this);
            star.draw(this.ctx, this);
        }
        if (Settings.drawFps) {
            this.ctx.save();
            this.ctx.fillStyle = '#0f0';
            this.ctx.font = `${Settings.drawFpsFontSize}px System, monospace`;
            this.ctx.textBaseline = 'bottom';
            const backgroundFps = Math.floor(1000 / deltaTime).toString();
            this.ctx.fillText('BackgroundRender: ' + backgroundFps + ' FPS (' + deltaTime.toFixed(2) + 'ms)', 5, this.canvas.height - 10 - Settings.drawFpsFontSize * 2);
            this.ctx.restore();
        }
        this.lastUpdateTimeStamp = timeStamp;
        this.lastRequestedFrameId = self.requestAnimationFrame(this.mainLoop.bind(this));
    }
    pauseLoop() {
        if (!this.isRunning)
            return;
        self.cancelAnimationFrame(this.lastRequestedFrameId);
        this.isRunning = false;
    }
    resumeLoop() {
        if (this.isRunning)
            return;
        this.lastUpdateTimeStamp = null;
        this.lastRequestedFrameId = self.requestAnimationFrame(this.mainLoop.bind(this));
        this.isRunning = true;
    }
    setStarsCount(count) {
        this.starsCount = count;
        if (this.stars.length > this.starsCount)
            this.stars = this.stars.filter((_, index) => index < this.starsCount - 1);
        while (this.stars.length < this.starsCount) {
            this.stars.push(new Star(undefined, this));
        }
    }
    getScreenSize() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        return { width, height };
    }
    getMousePos() {
        return this.mousePosition.clone();
    }
}
//# sourceMappingURL=WebWorker.js.map