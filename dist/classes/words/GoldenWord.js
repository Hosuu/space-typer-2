import { wordsDB } from '../../WordsDB.js';
import GameManager from '../managers/GameManager.js';
import CircleParticle from '../particles/CircleParticle.js';
import Settings from '../Settings.js';
import SpaceTyperEngine from '../SpaceTyperEngine.js';
import Vector2 from '../Vector2.js';
import BaseWord from './BaseWord.js';
export default class GoldenWord extends BaseWord {
    text;
    position;
    textBox;
    collider;
    speed;
    size;
    color;
    lifeTime;
    constructor(text, duration) {
        super();
        this.speed = 1 / duration;
        this.size = Settings.goldenWordFontSize;
        this.color = Settings.goldenWordColor;
        const gameArea = SpaceTyperEngine.getGameArea();
        const centerY = (gameArea.getTopY() + gameArea.getBottomY()) / 2;
        this.position = new Vector2(0, centerY);
        this.updateText(text);
        this.lifeTime = Math.PI * Math.random() * 20000;
    }
    update(dt) {
        this.progerss += dt * this.speed;
        this.lifeTime += dt;
        if (this.progerss > 1)
            this.dead = true;
        this.position.x = this.progerss * innerWidth - (1 - this.progerss) * this.textBox.width;
        const gameArea = SpaceTyperEngine.getGameArea();
        const centerY = (gameArea.getTopY() + gameArea.getBottomY()) / 2;
        this.position.y =
            Math.cos(this.lifeTime / 1000) * 0.4 * gameArea.height +
                centerY +
                this.collider.height / 2;
        this.collider.position = this.position
            .clone()
            .subtract(new Vector2(Settings.wordPadding, Settings.wordPadding));
    }
    submit(sumbitValue) {
        if (this.text != sumbitValue)
            return false;
        const gameMan = GameManager.getInstance();
        gameMan.addScore(this.text.length * 10);
        this.playSubmitAnimation();
        this.updateText(wordsDB[Math.floor(Math.random() * wordsDB.length)]);
        this.speed *= Settings.goldenWordSpeedMultilpier;
        return true;
    }
    playSubmitAnimation() {
        const position = this.textBox.getCenterPoint();
        for (let i = 0; i < 40; i++) {
            const velocity = Vector2.FromAngle(Math.PI * 2 * Math.random()).multiply(0.25);
            new CircleParticle({
                position,
                velocity,
                velocityScaling: 1.0002,
                size: 1 + Math.random() * 2,
                sizeDelta: 0.02,
                sizeScaling: 1.03,
                duration: 400,
                color: '#ff0',
            });
        }
    }
}
//# sourceMappingURL=GoldenWord.js.map