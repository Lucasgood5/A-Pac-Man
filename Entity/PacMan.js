let img_pacman = new Image();
img_pacman.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/1200px-Pacman.svg.png";

class PacMan extends MobileEntity {
    constructor(stage, x, y, speed, image = img_pacman) {
        super()
        this.stage = stage;
        // x et y correspondent aux coordonnées du centre de PacMan
        if (x === undefined) throw new Error("x is undefined");
        if (y === undefined) throw new Error("y is undefined");
        if (isNaN(x)) throw new Error("x is NaN");
        if (isNaN(y)) throw new Error("y is NaN");
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.image = image;

        this.collider = new MovementHandler();

        this.oldDir = MovementHandler.DIRECTION.NONE;
        this.currentDir = MovementHandler.DIRECTION.NONE;
        this.wishDir = null;

        this.isBoosted = false;
        this.boostStartTimestamp = null;
    }

    setDirection(dir) { this.wishDir = dir }

    update(dT) {
        if (this.wishDir !== null && this.canMove(this.wishDir)) {
            this.oldDir = this.currentDir;
            this.currentDir = this.wishDir;
        }

        this.move(this.currentDir, dT);

        if (!this.canMove(this.currentDir))
            this.currentDir = this.oldDir;
    }

    // Méthode de dessin : on centre l'image sur (this.x, this.y)
    draw(ctx) {
        let ts = this.stage.getDisplaySettings().tileSize;
        ctx.drawImage(this.image, this.x - ts / 2, this.y - ts / 2, ts, ts);

        if (this.isBoosted) {
            ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
            ctx.fillRect(this.x - ts / 2, this.y - ts / 2, ts, ts);
        }
        // this.DEBUG_drawMobilityInfo(ctx)
    }

    boost() {
        this.isBoosted = true;
        this.boostStartTimestamp = Date.now();
        setTimeout(() => {
            this.isBoosted = false;
        }, 15000);
    }
}
