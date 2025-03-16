const AllLevels = new Map();

class Stage {
    static StageLoader(gameHandler, number) {
        if (AllLevels.has(number)) {
            let level = AllLevels.get(number);
            level.gameHandler = gameHandler;
            return new Stage(level);
        }
        return "No level found for : " + number;
    }

    constructor({
        gameHandler,
        lvlWidth,
        lvlHeight,
        WallMap,
        CollictablesToSpawnList,
        PacManStartingCoordinates,
        GhostToSpawnList,
        GhostBase,
        GameSpeedDesired = 2 // Cell Per Second
    }) {

        if (gameHandler == undefined) throw new Error("gameHandler is required");
        if (lvlWidth == undefined) throw new Error("lvlWidth is required");
        if (lvlHeight == undefined) throw new Error("lvlHeight is required");
        if (WallMap == undefined) throw new Error("WallMap is required");
        if (CollictablesToSpawnList == undefined) throw new Error("CollictablesToSpawnList is required");
        if (PacManStartingCoordinates == undefined) throw new Error("PacManStartingCoordinates is required");
        if (GhostBase == undefined) throw new Error("GhostBase is required");
        if (GhostToSpawnList == undefined) throw new Error("GhostToSpawnList is required");

        if (lvlWidth < 0) throw new Error("lvlWidth must be greater than 0");
        if (lvlHeight < 0) throw new Error("lvlHeight must be greater than 0");
        if (WallMap.length != lvlHeight) throw new Error("WallMap must have the same height as lvlHeight");
        for (let row of WallMap) if (row.length != lvlWidth) throw new Error("WallMap must have the same width as lvlWidth");

        this.gameHandler = gameHandler;
        this.lvlHeight = lvlHeight;
        this.lvlWidth = lvlWidth;
        this.WallMap = WallMap;

        PacManStartingCoordinates = this.gridToPixels(PacManStartingCoordinates.row, PacManStartingCoordinates.col);
        this.PacMan = new PacMan(this, PacManStartingCoordinates.x, PacManStartingCoordinates.y, GameSpeedDesired);

        this.Ghosts = [];
        for (let ghost of GhostToSpawnList) {
            let coordinate = this.gridToPixels(ghost.row, ghost.col);
            let G = new Ghost(this, coordinate.x, coordinate.y, GameSpeedDesired * ghost.speedratio, ghost.pathfindingStrategy);
            this.Ghosts.push(G)
        }
        this.GhostBase = GhostBase;
        this.GhostBasePxl = this.gridToPixels(GhostBase.row, GhostBase.col);

        this.Collictables = [];
        for (let collictable of CollictablesToSpawnList) {
            let coordinate = this.gridToPixels(collictable.row, collictable.col);
            let C = Collectible.buildFromType(collictable.type, this, coordinate.x, coordinate.y);
            this.Collictables.push(C);
        }
    }

    getCanvas() {
        return this.gameHandler.canvas;
    }

    getDisplaySettings() {
        let idealTileWidth = this.getCanvas().width / this.lvlWidth;
        let idealTileHeight = this.getCanvas().height / this.lvlHeight;

        let tileSize = Math.min(idealTileWidth, idealTileHeight); // as we want them to be square

        let offsetX = (this.getCanvas().width - tileSize * this.lvlWidth) / 2;
        let offsetY = (this.getCanvas().height - tileSize * this.lvlHeight) / 2;

        return { tileSize, offsetX, offsetY };
    }

    gridToPixels(row, col) {
        let { tileSize, offsetX, offsetY } = this.getDisplaySettings();
        return {
            x: offsetX + col * tileSize + tileSize / 2,
            y: offsetY + row * tileSize + tileSize / 2
        };
    }

    pixelToGrid(x, y) {
        let { tileSize, offsetX, offsetY } = this.getDisplaySettings();
        let col = Math.floor((x - offsetX) / tileSize);
        let row = Math.floor((y - offsetY) / tileSize);
        return { row, col };
    }

    isAWall(row, col) {
        if (row < 0 || row >= this.lvlHeight) return true;
        if (col < 0 || col >= this.lvlWidth) return true;
        return this.WallMap[row][col] === 1;
    }

    static ACCEPTEDINPUT = {
        UP: "up",
        DOWN: "down",
        LEFT: "left",
        RIGHT: "right"
    }
    HandleControlInput(INPUT) {
        switch (INPUT) {
            case Stage.ACCEPTEDINPUT.UP:
            case Stage.ACCEPTEDINPUT.DOWN:
            case Stage.ACCEPTEDINPUT.LEFT:
            case Stage.ACCEPTEDINPUT.RIGHT:
                this.PacMan.wishDir = INPUT;
                break;
            default:
                console.log("Unknow input : ", INPUT);
        }
    }

    update() {
        let now = Date.now();
        if (!this.lastUpdate) this.lastUpdate = now;
        let dT = now - this.lastUpdate;
        this.lastUpdate = now;
        this.PacMan.update(dT);
        for (let collectable of this.Collictables) collectable.tryCollect(this.PacMan);
        for (let ghost of this.Ghosts) {
            if (ghost.isDead) {
                ghost.update(dT, this.GhostBasePxl)
                const dist = Math.sqrt(Math.pow(ghost.x - this.GhostBasePxl.x, 2) + Math.pow(ghost.y - this.GhostBasePxl.y, 2))
                if (dist < this.getDisplaySettings().tileSize * 0.2) {
                    ghost.isDead = false;
                }
            }
            else ghost.update(dT, this.PacMan);
        }
        if (this.isWon()) {
            this.gameHandler.nextLevel();
        }
    }

    isWon() {
        for (let collectable of this.Collictables) {
            if (collectable.notNeeded) continue;
            if (!collectable.collected) return false;
        }
        return true;
    }

    draw() {
        let ctx = this.getCanvas().getContext("2d");
        ctx.clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);

        this.drawWall(ctx);
        for (let collectible of this.Collictables) {
            collectible.draw(ctx);
        }
        this.PacMan.draw(ctx);
        for (let ghost of this.Ghosts) {
            ghost.draw(ctx);
        }
    }

    drawWall(ctx) {
        let { tileSize, offsetX, offsetY } = this.getDisplaySettings();
        ctx.fillStyle = window.getComputedStyle(document.documentElement).getPropertyValue('--game_color_wall');
        for (let row = 0; row < this.lvlHeight; row++) {
            for (let col = 0; col < this.lvlWidth; col++) {
                if (this.WallMap[row][col] == 1) {
                    ctx.fillRect(offsetX + col * tileSize, offsetY + row * tileSize, tileSize, tileSize);
                }
            }
        }
    }

    gainScore(delta) {
        this.gameHandler.score += delta;
    }

    gameOver(killer) {
        this.gameOverStartTimestamp = Date.now();
        this.draw = () => {
            let ctx = this.getCanvas().getContext("2d");
            ctx.clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);
            ctx.fillStyle = "red";

            this.drawWall(ctx);
            this.PacMan.draw(ctx);
            killer.draw(ctx);

            ctx.fillStyle = "white";
            ctx.font = "70px Arial bold";

            ctx.textAlign = "center";
            ctx.fillText("Game Over", this.getCanvas().width / 2, this.getCanvas().height / 2);
        }
        this.update = () => {
            let now = Date.now();
            let gameOverDuration = now - this.gameOverStartTimestamp;
            if (gameOverDuration > 2500) {
                this.gameHandler.GameOverScreen();
            }
        }
    }
}