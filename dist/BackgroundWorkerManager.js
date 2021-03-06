import Star from './classes/particles/Star.js';
import Settings from './classes/Settings.js';
import Vector2 from './classes/Vector2.js';
self.addEventListener('message', (e) => {
    const [message, arg] = e.data;
    if (message !== 'init')
        return;
    new BackgroundWorkerManager(arg);
});
export default class BackgroundWorkerManager {
    static _instance;
    static getInstance() {
        return this._instance;
    }
    canvas;
    ctx;
    deltaTime;
    isRunning;
    lastUpdateTimeStamp;
    lastRequestedFrameId;
    stars;
    starsCount;
    shiningEnabled;
    shiningChanceMultiplier;
    parallaxEnabled;
    mousePosition;
    mouseMovement;
    parallaxScale;
    parallaxSpeed;
    constructor(canvas) {
        if (BackgroundWorkerManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        BackgroundWorkerManager._instance = this;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.deltaTime = 0;
        this.isRunning = true;
        this.lastUpdateTimeStamp = null;
        this.lastRequestedFrameId = 0;
        this.stars = new Array();
        this.starsCount = 0;
        this.setStarsCount(Settings.backgroundStarsCount);
        this.shiningEnabled = Settings.starsShiningEnabled;
        this.shiningChanceMultiplier = 1;
        console.log(self);
        this.parallaxEnabled = Settings.starsParallaxEnabled;
        this.parallaxScale = Settings.starsParallaxScale;
        this.parallaxSpeed = Settings.starsParallaxSpeed;
        this.mousePosition = new Vector2(canvas.width / 2, canvas.height / 2);
        this.mouseMovement = new Vector2(0, 0);
        self.addEventListener('message', this.messageHandler.bind(this));
        this.lastRequestedFrameId = self.requestAnimationFrame(this.mainLoop.bind(this));
    }
    messageHandler(event) {
        const [message, data] = event.data;
        switch (message) {
            case 'updateMousePosition':
                const [position, movement] = data;
                this.mousePosition.set(position.x, position.y);
                this.mouseMovement.add(movement);
                break;
            case 'resizeCanvas':
                const oldSize = new Vector2(this.canvas.width, this.canvas.height);
                const newSize = new Vector2(data.width, data.height);
                this.canvas.width = newSize.x;
                this.canvas.height = newSize.y;
                for (const star of this.stars)
                    star.rescalePosition(oldSize, newSize);
                break;
            case 'clearScreen':
                console.log('cls');
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'setStarsCount':
                this.setStarsCount(data);
                break;
            case 'setShiningChanceMultiplier':
                this.shiningChanceMultiplier = data;
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
        this.deltaTime = deltaTime;
        self.postMessage(['deltaTime', this.deltaTime]);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const star of this.stars) {
            star.update(deltaTime, this);
            star.draw(this.ctx);
        }
        this.mouseMovement.set(0, 0);
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
        if (this.starsCount === count)
            return;
        this.starsCount = count;
        if (this.stars.length > this.starsCount)
            this.stars = this.stars.splice(this.stars.length - this.starsCount);
        while (this.stars.length < this.starsCount) {
            this.stars.push(new Star());
        }
    }
    getScreenSize() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        return { width, height };
    }
    getShiningEnabled() {
        return this.shiningEnabled;
    }
    getShiningChanceMultiplier() {
        return this.shiningChanceMultiplier;
    }
    getParallaxEnabled() {
        return this.parallaxEnabled;
    }
    getParallaxScale() {
        return this.parallaxScale;
    }
    getParallaxSpeed() {
        return this.parallaxSpeed;
    }
    getMousePos() {
        return this.mousePosition.clone();
    }
    getMouseMovement() {
        return this.mouseMovement.clone();
    }
}
//# sourceMappingURL=BackgroundWorkerManager.js.map