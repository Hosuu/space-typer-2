import Settings from '../Settings.js';
import GameManager from './GameManager.js';
export default class PromptManager {
    DOMelementHook;
    promptValue;
    lastText;
    static _instance;
    static getInstance() {
        return this._instance;
    }
    constructor() {
        if (PromptManager._instance)
            throw Error('Singletone ERROR: Cannot initalize more than one instance of this class');
        PromptManager._instance = this;
        const DOMhook = document.querySelector('[stat="prompt"]');
        if (!DOMhook)
            throw Error('DOM element [stat="prompt"] not found!');
        this.DOMelementHook = DOMhook;
        this.promptValue = new Array();
        this.lastText = 'Start typing...';
        this.updateDOM();
        window.addEventListener('keydown', this.keyboardEventHandler.bind(this));
    }
    keyboardEventHandler(event) {
        const char = event.key;
        const code = event.code;
        const timeStamp = event.timeStamp;
        const isRepeating = event.repeat;
        const isAltPressed = event.altKey;
        const isCtrlPressed = event.ctrlKey;
        if (isRepeating && Settings.promptPreventKeyRepeating)
            return;
        if (code === 'Backspace') {
            if (this.promptValue.length == 0)
                return;
            if (this.promptValue.length == 1) {
                this.lastText = '';
            }
            if (isCtrlPressed)
                this.reset();
            else
                this.backspace();
            return;
        }
        if (code === 'Enter' || code === 'Space') {
            const startTimeStamp = this.promptValue[0].timeStamp;
            const text = this.getText();
            const time = timeStamp - startTimeStamp;
            if (text.length == 0)
                return;
            this.lastText = text;
            console.log(text, time);
            GameManager.getInstance().wordSubmit(text);
            this.reset();
            return;
        }
        if (event.key.length === 1) {
            this.registerChar(char, timeStamp);
            return;
        }
    }
    getText() {
        return this.promptValue.reduce((string, { char }) => string + char, '');
    }
    registerChar(char, timeStamp) {
        this.promptValue.push({ char, timeStamp });
        this.updateDOM();
    }
    backspace() {
        this.promptValue.pop();
        this.updateDOM();
    }
    reset() {
        this.promptValue = new Array();
        this.updateDOM();
    }
    updateDOM() {
        const text = this.getText();
        if (text) {
            this.DOMelementHook.innerHTML = text;
            this.DOMelementHook.classList.remove('inactive');
        }
        else {
            this.DOMelementHook.innerHTML = this.lastText;
            this.DOMelementHook.classList.add('inactive');
        }
    }
}
//# sourceMappingURL=PromptManager.js.map