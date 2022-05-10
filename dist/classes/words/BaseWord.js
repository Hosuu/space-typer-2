import GameManager from '../managers/GameManager.js';
import PromptManager from '../managers/PromptManager.js';
import Settings from '../Settings.js';
import Rect from '../shapes/Rect.js';
import Vector2 from '../Vector2.js';
export default class BaseWord {
    progerss = 0;
    dead = false;
    draw(ctx) {
        if (this.dead)
            return;
        const promptValue = PromptManager.getInstance().getText();
        ctx.save();
        ctx.font = `${this.size}px ${Settings.wordFont}`;
        ctx.textBaseline = 'top';
        if (promptValue !== this.text || !Settings.wordtHighlighting) {
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.position.x, this.position.y);
        }
        if (Settings.wordtHighlighting && promptValue === this.text) {
            ctx.fillStyle = Settings.wordHighlightningColor;
            ctx.fillText(promptValue, this.position.x, this.position.y);
        }
        else if (Settings.wordTypingMatch && this.text.startsWith(promptValue)) {
            ctx.fillStyle = Settings.wordTypingMatchColor;
            ctx.fillText(promptValue, this.position.x, this.position.y);
        }
        if (Settings.renderWordTextBox)
            this.textBox.renderAt(ctx, Settings.wordTextBoxColor, 2);
        if (Settings.renderWordColider)
            this.collider.renderAt(ctx, Settings.wordColiderColor, 2);
        if (Settings.renderWordCenterPoint)
            this.textBox.getCenterPoint().renderAt(ctx, Settings.wordCenterPointColor, 4);
        ctx.restore();
    }
    updateText(newText) {
        const ctx = GameManager.getInstance().getCanvas().getContext('2d');
        ctx.save();
        ctx.font = `${this.size}px ${Settings.wordFont}, Comfortaa, sans-serif`;
        ctx.textBaseline = 'top';
        const metrics = ctx.measureText(newText);
        const width = metrics.width;
        const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        ctx.restore();
        this.textBox = new Rect(this.position, width, height);
        this.collider = new Rect(new Vector2(this.position.x - Settings.wordPadding, this.position.y - Settings.wordPadding), width + Settings.wordPadding * 2, height + Settings.wordPadding * 2);
        this.text = newText;
    }
    getProgess() {
        return this.progerss;
    }
    getText() {
        return this.text;
    }
    isDead() {
        return this.dead;
    }
    getCollider() {
        return this.collider;
    }
}
//# sourceMappingURL=BaseWord.js.map