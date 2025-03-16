let img_ghost = new Image();
img_ghost.src = "https://e7.pngegg.com/pngimages/920/505/png-clipart-green-white-and-blue-monster-illustration-pac-man-games-ghosts-blue-ghost-s-blue-rectangle-thumbnail.png";

class Ghost extends MobileEntity {
    constructor(stage, x, y, speed, strategy, image = img_ghost) {
        super();
        this.stage = stage;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.strategy = strategy;
        this.image = image;
        this.lastDir = null;
        this.currentDir = MovementHandler.DIRECTION.NONE;

        this.isDead = false;
    }

    canMoveInDirection(dir, canvas, map) {
        return this.collider.canMove(dir, canvas, map, this.x, this.y, this.speed);
    }

    moveInDirection(dir, canvas, map) {
        this.collider.move(dir, canvas, map, this);
    }

    update(dT, target) {
        if (this.strategy && typeof this.strategy.getNextDirection === 'function') {
            let wishedDir = this.strategy.getNextDirection(this, target, this.stage) || MovementHandler.DIRECTION.NONE;

            if (this.canMove(wishedDir)) {
                this.lastDir = this.currentDir;
                this.currentDir = wishedDir;
            }

            this.move(this.currentDir, dT);

            if (!this.canMove(this.currentDir)) {
                this.currentDir = this.lastDir;
            }
        }

        this.tryKill(target);
    }

    tryKill(target) {
        if (this.isDead) return;
        const Distance = Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2))
        if (Distance > this.stage.getDisplaySettings().tileSize * 0.8) return
        if (target.isBoosted) {
            this.isDead = true;
            this.stage.gainScore(200);
            return
        }
        this.stage.gameOver(this);
    }

    draw(ctx) {
        const { tileSize, offsetX, offsetY } = this.stage.getDisplaySettings();

        ctx.drawImage(this.image, this.x - tileSize / 2, this.y - tileSize / 2, tileSize, tileSize);
        if (this.isDead) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(this.x - tileSize / 2, this.y - tileSize / 2, tileSize, tileSize);
        }

        // this.drawDebug(ctx);
        // this.DEBUG_drawMobilityInfo(ctx);
    }


    // OBSOLETE, MobileEntity.DEBUG_drawMobilityInfo()
    drawDebug(ctx) {
        let ts = this.game.getTileSize();


        ctx.fillStyle = "red";
        if (this.canMoveInDirection("up", this.game.canvas, this.game.map) === 0)
            ctx.fillRect(this.x - ts / 2, this.y + ts / 2 - 2, ts, 2);
        if (this.canMoveInDirection("down", this.game.canvas, this.game.map) === 0)
            ctx.fillRect(this.x - ts / 2, this.y - ts / 2, ts, 2);
        if (this.canMoveInDirection("left", this.game.canvas, this.game.map) === 0)
            ctx.fillRect(this.x - ts / 2, this.y - ts / 2, 2, ts);
        if (this.canMoveInDirection("right", this.game.canvas, this.game.map) === 0)
            ctx.fillRect(this.x + ts / 2 - 2, this.y - ts / 2, 2, ts);


        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(this.strategy.constructor.name, this.x - ts / 2, this.y - ts / 2 - 5);

        // a blue arrow pointing in this.currentDir
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        switch (this.currentDir) {
            case "up":
                ctx.lineTo(this.x, this.y - ts / 2);
                ctx.lineTo(this.x - 5, this.y - ts / 2 + 5);
                ctx.moveTo(this.x, this.y - ts / 2);
                ctx.lineTo(this.x + 5, this.y - ts / 2 + 5);
                break;
            case "down":
                ctx.lineTo(this.x, this.y + ts / 2);
                ctx.lineTo(this.x - 5, this.y + ts / 2 - 5);
                ctx.moveTo(this.x, this.y + ts / 2);
                ctx.lineTo(this.x + 5, this.y + ts / 2 - 5);
                break;
            case "left":
                ctx.lineTo(this.x - ts / 2, this.y);
                ctx.lineTo(this.x - ts / 2 + 5, this.y - 5);
                ctx.moveTo(this.x - ts / 2, this.y);
                ctx.lineTo(this.x - ts / 2 + 5, this.y + 5);
                break;
            case "right":
                ctx.lineTo(this.x + ts / 2, this.y);
                ctx.lineTo(this.x + ts / 2 - 5, this.y - 5);
                ctx.moveTo(this.x + ts / 2, this.y);
                ctx.lineTo(this.x + ts / 2 - 5, this.y + 5);
                break;
        }
        ctx.stroke();

        let wishedDir = this.strategy.getNextDirection(this, this.game.pacman, this.game.map, this.game.canvas);
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        switch (wishedDir) {
            case "up":
                ctx.lineTo(this.x, this.y - ts / 2);
                ctx.lineTo(this.x - 5, this.y - ts / 2 + 5);
                ctx.moveTo(this.x, this.y - ts / 2);
                ctx.lineTo(this.x + 5, this.y - ts / 2 + 5);
                break;
            case "down":
                ctx.lineTo(this.x, this.y + ts / 2);
                ctx.lineTo(this.x - 5, this.y + ts / 2 - 5);
                ctx.moveTo(this.x, this.y + ts / 2);
                ctx.lineTo(this.x + 5, this.y + ts / 2 - 5);
                break;
            case "left":
                ctx.lineTo(this.x - ts / 2, this.y);
                ctx.lineTo(this.x - ts / 2 + 5, this.y - 5);
                ctx.moveTo(this.x - ts / 2, this.y);
                ctx.lineTo(this.x - ts / 2 + 5, this.y + 5);
                break;
            case "right":
                ctx.lineTo(this.x + ts / 2, this.y);
                ctx.lineTo(this.x + ts / 2 - 5, this.y - 5);
                ctx.moveTo(this.x + ts / 2, this.y);
                ctx.lineTo(this.x + ts / 2 - 5, this.y + 5);
                break;
        }
    }
}