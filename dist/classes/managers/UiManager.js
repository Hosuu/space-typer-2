import Counter from '../counter.js';
import SpaceTyperEngine from '../SpaceTyperEngine.js';
export default class UiManager {
    static _instance;
    static getInstance() {
        return this._instance;
    }
    topBarElement;
    scoreElement;
    scoreCounter;
    livesElement;
    timerElement;
    constructor() {
        UiManager._instance = this;
        const topBarHook = document.querySelector('.top_bar');
        if (!(topBarHook instanceof HTMLDivElement))
            throw new Error('Cannot find .top_bar div element in DOM');
        this.topBarElement = topBarHook;
        const scoreHook = document.querySelector('[stat="score"]');
        if (!(scoreHook instanceof HTMLDivElement))
            throw new Error('Cannot find [stat="score"] div element in DOM');
        this.scoreElement = scoreHook;
        this.scoreCounter = new Counter(0);
        const livesHook = document.querySelector('[stat="lives"]');
        if (!(livesHook instanceof HTMLDivElement))
            throw new Error('Cannot find [stat="timer"] div element in DOM');
        this.livesElement = livesHook;
        const timerHook = document.querySelector('[stat="timer"]');
        if (!(timerHook instanceof HTMLDivElement))
            throw new Error('Cannot find [stat="timer"] div element in DOM');
        this.timerElement = timerHook;
    }
    updateTimer(miliSeconds) {
        const seconds = Math.floor(miliSeconds / 1000) % 60;
        const minutes = Math.floor(miliSeconds / (60 * 1000)) % 60;
        const textValue = `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
        if (this.timerElement.innerHTML != textValue)
            this.timerElement.innerHTML = textValue;
    }
    setLives(amount) {
        this.livesElement.innerHTML = amount.toString();
    }
    update() {
        this.scoreCounter.update();
    }
    draw() {
        this.scoreCounter.draw(this.scoreElement, 0);
        this.updateTimer(Math.floor(SpaceTyperEngine.getTimeElapsed()));
    }
}
//# sourceMappingURL=UiManager.js.map