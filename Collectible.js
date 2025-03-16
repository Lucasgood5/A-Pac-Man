class Collectible {
    static ImagesCache = new Map();
    static GetImage(path) {
        if (Collectible.ImagesCache.has(path)) {
            return Collectible.ImagesCache.get(path);
        }
        let img = new Image();
        img.src = path;
        Collectible.ImagesCache.set(path, img);
        return img;
    }

    static imageByType = {
        "coin": "./1euro.png",
        "beer": "1euro.png"
    }

    constructor(stage, type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.collected = false;
        this.stage = stage;
    }

    static buildFromType(type, stage, x, y) {
        switch (type) {
            case "coin":
                return new Coin(stage, x, y);
            case "beer":
                return new Beer(stage, x, y);
            default:
                return new Collectible(stage, type, x, y);
        }
    }

    tryCollect(pacman) {
        if (this.collected) return
        const Distance = Math.sqrt(Math.pow(this.x - pacman.x, 2) + Math.pow(this.y - pacman.y, 2))
        if (Distance > this.stage.getDisplaySettings().tileSize * 0.8) return
        this.onCollect(pacman)
    }

    onCollect(pacman) {
    }


    draw(ctx) {
        if (this.collected) return;
        let size = this.stage.getDisplaySettings().tileSize;
        let img = Collectible.GetImage(Collectible.imageByType[this.type]);
        try {
            ctx.drawImage(img, this.x - size / 2, this.y - size / 2, size, size);
        } catch (e) {
            console.error(e);
        }
    }
}

class Coin extends Collectible {
    constructor(stage, x, y, coinvalue = 1) {
        super(stage, "coin", x, y);
        this.coinvalue = coinvalue;
    }

    onCollect(pacman) {
        this.collected = true;
        this.stage.gainScore(this.coinvalue);
    }

    draw(ctx) {
        if (this.collected) return;
        let size = this.stage.getDisplaySettings().tileSize;

        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, size / 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Beer extends Collectible {
    constructor(stage, x, y) {
        super(stage, "beer", x, y);
    }

    onCollect(pacman) {
        this.collected = true;
        pacman.boost();
    }

    draw(ctx) {
        if (this.collected) return;
        let size = this.stage.getDisplaySettings().tileSize;

        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, size / 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}