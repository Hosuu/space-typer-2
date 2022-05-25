import GameManager from '../managers/GameManager.js';
import CircleParticle from '../particles/CircleParticle.js';
import WordParticle from '../particles/WordParticle.js';
import Settings from '../Settings.js';
import SpaceTyperEngine from '../SpaceTyperEngine.js';
import Vector2 from '../Vector2.js';
import BaseWord from './BaseWord.js';
import GoldenWord from './GoldenWord.js';
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
        const gameArea = SpaceTyperEngine.getGameArea();
        this.position = new Vector2(0, Math.random() * (gameArea.height - this.size) + gameArea.getTopY());
        this.updateText(text);
    }
    update(dt) {
        this.progerss += dt * this.speed;
        const possibleCollisions = GameManager.getInstance().queryQuadTree(this.collider).filter((w) => w != this && !(w instanceof GoldenWord));
        let isBottomColiding = false;
        let isTopColiding = false;
        for (const word of possibleCollisions) {
            if (this.collider.isOverlaping(word.getCollider())) {
                if (word.getCollider().position.y >= this.position.y)
                    isBottomColiding = true;
                else if (word.getCollider().position.y <= this.position.y)
                    isTopColiding = true;
            }
        }
        if (isBottomColiding && !isTopColiding)
            this.position.add(Vector2.Up.multiply(dt * 0.01));
        if (!isBottomColiding && isTopColiding)
            this.position.add(Vector2.Down.multiply(dt * 0.01));
        if (this.collider.getBottomY() > SpaceTyperEngine.getGameArea().getBottomY()) {
            const wordBottomY = this.collider.getBottomY();
            const gameAreaBottomY = SpaceTyperEngine.getGameArea().getBottomY();
            const Ydifference = wordBottomY - gameAreaBottomY;
            this.position.add(Vector2.Up.multiply(Ydifference));
        }
        else if (this.collider.getTopY() <= SpaceTyperEngine.getGameArea().getTopY()) {
            const wordTopY = this.collider.getTopY();
            const gameAreaTopY = SpaceTyperEngine.getGameArea().getTopY();
            const Ydifference = gameAreaTopY - wordTopY;
            this.position.add(Vector2.Down.multiply(Ydifference));
        }
        if (this.progerss > 1) {
            this.playPassAnimation();
            GameManager.getInstance().subtractLife();
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
        this.playSubmitAnimation();
        this.dead = true;
        return true;
    }
    playPassAnimation() {
        const centerLeft = this.textBox.getCenterPoint().add(Vector2.Left.multiply(this.textBox.width / 2));
        for (let i = 0; i < 7; i++) {
            const velocity = Vector2.FromAngle(Math.PI + (Math.random() - 0.5) * (Math.PI / 4)).multiply(1.2);
            new CircleParticle({
                position: centerLeft,
                velocity,
                size: 2 + Math.random() * 2,
                duration: 150,
            });
        }
    }
    playSubmitAnimation() {
        const position = this.textBox.getCenterPoint();
        for (let i = 0; i < 40; i++) {
            const velocity = Vector2.FromAngle(Math.PI * 2 * Math.random()).multiply(0.25);
            new CircleParticle({
                position,
                velocity,
                size: 1 + Math.random() * 2,
                duration: 250,
                color: this.color,
            });
        }
        new WordParticle({
            position,
            text: this.text,
            duration: 500,
            color: this.color,
        });
    }
}
//# sourceMappingURL=Word.js.map