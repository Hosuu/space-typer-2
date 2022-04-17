export default class BaseWord {
    constructor() { }
    update() {
        throw new Error('Method not implemented.');
    }
    draw() {
        throw new Error('Method not implemented.');
    }
    submit(submitValue) {
        if (submitValue != this.textValue)
            return;
    }
    getProgres() {
        return this.progres;
    }
    getTextValue() {
        return this.textValue;
    }
}
