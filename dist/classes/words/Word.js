import GameManager from '../managers/GameManager.js';
import CircleParticle from '../particles/CircleParticle.js';
import WordParticle from '../particles/WordParticle.js';
import Settings from '../Settings.js';
import Vector2 from '../Vector2.js';
import BaseWord from './BaseWord.js';
export default class Word extends BaseWord {
    text;
    speed;
    color;
    size;
    position;
    textBox;
    collider;
    constructor(text, duration) {
        super();
        this.speed = 1 / duration;
        this.size = Settings.wordFontSize;
        this.color = Settings.wordColor;
        this.position = new Vector2(0, Math.random() * window.innerHeight);
        this.updateText(text);
    }
    update(dt) {
        this.progerss += dt * this.speed;
        if (this.progerss > 1) {
            const centerLeft = this.textBox.getCenterPoint().add(Vector2.Left.multiply(this.textBox.width / 2));
            for (let i = 0; i < 7; i++) {
                const velocity = Vector2.FromAngle(Math.PI + (Math.random() - 0.5) * (Math.PI / 4)).multiply(3);
                new CircleParticle({
                    position: centerLeft,
                    velocity,
                    velocityScaling: 0.987,
                    size: 3,
                    sizeScaling: 1.02,
                    duration: 150,
                });
            }
            this.dead = true;
        }
        this.position.x = this.progerss * innerWidth - (1 - this.progerss) * this.textBox.width;
        this.collider.position = this.position
            .clone()
            .subtract(new Vector2(Settings.wordPadding, Settings.wordPadding));
    }
    submit(sumbitValue) {
        if (this.text != sumbitValue)
            return false;
        const gameMan = GameManager.getInstance();
        gameMan.addScore(this.text.length * 10);
        const position = this.textBox.getCenterPoint();
        for (let i = 0; i < 40; i++) {
            const velocity = Vector2.FromAngle(Math.PI * 2 * Math.random()).multiply(0.25);
            new CircleParticle({
                position,
                velocity,
                velocityScaling: 1.0002,
                size: 1 + Math.random() * 2,
                sizeDelta: 0.01,
                sizeScaling: 1.02,
                duration: 250,
            });
        }
        new WordParticle({
            position,
            text: this.text,
            sizeDelta: -0.02,
            sizeScaling: 0.999,
            duration: 500,
        });
        this.dead = true;
        return true;
    }
}
//# sourceMappingURL=Word.js.map