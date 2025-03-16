class MovementHandler {
    // if SnapTolereance is big, can move partially over wall, if too small, can't turn
    static SnapTolereance = 0.01;
    static getTolerance(tileSize) {
        return Math.ceil(MovementHandler.SnapTolereance * tileSize);
        //ceil because pixelization may also ceil
    }

    static DIRECTION = {
        UP: "up",
        DOWN: "down",
        LEFT: "left",
        RIGHT: "right",
        NONE: "none"
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    getClosestTile(stage, x, y) {
        const { tileSize, offsetX, offsetY } = stage.getDisplaySettings()
        return {
            col: Math.floor((x - offsetX) / tileSize),
            row: Math.floor((y - offsetY) / tileSize)
        }
    }

    canMoveUp(stage, x, y, speed) {
        const { tileSize, offsetX, offsetY } = stage.getDisplaySettings();

        const coordinate = {
            x: x,
            y: y,
            left: x - tileSize / 2,
            right: x + tileSize / 2,
            top: y - tileSize / 2,
            bottom: y + tileSize / 2
        }
        const { row, col } = this.getClosestTile(stage, x, y);
        const rowLeftX = stage.gridToPixels(row, col).x - tileSize / 2;
        const rowRightX = stage.gridToPixels(row, col).x + tileSize / 2;

        const deltaLeft = Math.abs(rowLeftX - coordinate.left);
        if (deltaLeft > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        let deltaRight = Math.abs(rowRightX - coordinate.right);
        if (deltaRight > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        if (row - 1 < 0) return 0;
        if (stage.isAWall(row - 1, col)) {
            let ghostTop = coordinate.y - tileSize / 2
            let wallBottom = offsetY + row * tileSize;
            let available = ghostTop - wallBottom;
            let doabledistance = Math.max(0, Math.min(speed, available));
            if (doabledistance < MovementHandler.getTolerance(tileSize) / 2) {
                return 0;
            }
            return doabledistance;
        }
        return speed;
    }

    canMoveDown(stage, x, y, speed) {
        const { tileSize, offsetX, offsetY } = stage.getDisplaySettings();

        const coordinate = {
            x: x,
            y: y,
            left: x - tileSize / 2,
            right: x + tileSize / 2,
            top: y - tileSize / 2,
            bottom: y + tileSize / 2
        }
        const { row, col } = this.getClosestTile(stage, x, y);
        const rowLeftX = stage.gridToPixels(row, col).x - tileSize / 2;
        const rowRightX = stage.gridToPixels(row, col).x + tileSize / 2;

        const deltaLeft = Math.abs(rowLeftX - coordinate.left);
        if (deltaLeft > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        let deltaRight = Math.abs(rowRightX - coordinate.right);
        if (deltaRight > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        if (row + 1 >= stage.lvlHeight) return 0;
        if (stage.isAWall(row + 1, col)) {
            let ghostBottom = coordinate.y + tileSize / 2
            let wallTop = offsetY + (row + 1) * tileSize;
            let available = wallTop - ghostBottom;
            let doabledistance = Math.max(0, Math.min(speed, available));
            if (doabledistance < MovementHandler.getTolerance(tileSize) / 2) {
                return 0;
            }
            return doabledistance;
        }
        return speed;
    }

    canMoveLeft(stage, x, y, speed) {
        const { tileSize, offsetX, offsetY } = stage.getDisplaySettings();

        const coordinate = {
            x: x,
            y: y,
            left: x - tileSize / 2,
            right: x + tileSize / 2,
            top: y - tileSize / 2,
            bottom: y + tileSize / 2
        }
        const { row, col } = this.getClosestTile(stage, x, y);
        const colTopY = stage.gridToPixels(row, col).y - tileSize / 2;
        const colBottomY = stage.gridToPixels(row, col).y + tileSize / 2;

        const deltaTop = Math.abs(colTopY - coordinate.top);
        if (deltaTop > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        let deltaBottom = Math.abs(colBottomY - coordinate.bottom);
        if (deltaBottom > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        if (col - 1 < 0) return 0;
        if (stage.isAWall(row, col - 1)) {
            let ghostLeft = coordinate.x - tileSize / 2
            let wallRight = offsetX + col * tileSize;
            let available = ghostLeft - wallRight;
            let doabledistance = Math.max(0, Math.min(speed, available));
            if (doabledistance < MovementHandler.getTolerance(tileSize) / 2) {
                return 0;
            }
            return doabledistance;
        }
        return speed;
    }

    canMoveRight(stage, x, y, speed) {
        const { tileSize, offsetX, offsetY } = stage.getDisplaySettings();

        const coordinate = {
            x: x,
            y: y,
            left: x - tileSize / 2,
            right: x + tileSize / 2,
            top: y - tileSize / 2,
            bottom: y + tileSize / 2
        }
        const { row, col } = this.getClosestTile(stage, x, y);
        const colTopY = stage.gridToPixels(row, col).y - tileSize / 2;
        const colBottomY = stage.gridToPixels(row, col).y + tileSize / 2;

        const deltaTop = Math.abs(colTopY - coordinate.top);
        if (deltaTop > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        let deltaBottom = Math.abs(colBottomY - coordinate.bottom);
        if (deltaBottom > MovementHandler.getTolerance(tileSize)) {
            return 0;
        }

        if (col + 1 >= stage.lvlWidth) return 0;
        if (stage.isAWall(row, col + 1)) {
            let ghostRight = coordinate.x + tileSize / 2
            let wallLeft = offsetX + (col + 1) * tileSize;
            let available = wallLeft - ghostRight;
            let doabledistance = Math.max(0, Math.min(speed, available));
            if (doabledistance < MovementHandler.getTolerance(tileSize) / 2) {
                return 0;
            }
            return doabledistance;
        }
        return speed;
    }

    canMove(dir, stage, x, y, speed) {
        switch (dir) {
            case MovementHandler.DIRECTION.LEFT: return this.canMoveLeft(stage, x, y, speed);
            case MovementHandler.DIRECTION.UP: return this.canMoveUp(stage, x, y, speed);
            case MovementHandler.DIRECTION.RIGHT: return this.canMoveRight(stage, x, y, speed);
            case MovementHandler.DIRECTION.DOWN: return this.canMoveDown(stage, x, y, speed);
            case MovementHandler.DIRECTION.NONE: return 0;
            default: throw new Error("Invalid direction");
        }
    }

    moveUp(stage, x, y, speed) {
        const d = this.canMoveUp(stage, x, y, speed);
        const { row, col } = this.getClosestTile(stage, x, y);
        const ti = stage.gridToPixels(row, col);
        x = this.lerp(x, ti.x, 0.1);
        return { x: x, y: y - d };
    }

    moveDown(stage, x, y, speed) {
        const d = this.canMoveDown(stage, x, y, speed);
        const { row, col } = this.getClosestTile(stage, x, y);
        const ti = stage.gridToPixels(row, col);
        x = this.lerp(x, ti.x, 0.1);
        return { x: x, y: y + d };
    }

    moveLeft(stage, x, y, speed) {
        const d = this.canMoveLeft(stage, x, y, speed);
        const { row, col } = this.getClosestTile(stage, x, y);
        const ti = stage.gridToPixels(row, col);
        y = this.lerp(y, ti.y, 0.1);
        return { x: x - d, y: y };
    }

    moveRight(stage, x, y, speed) {
        const d = this.canMoveRight(stage, x, y, speed);
        const { row, col } = this.getClosestTile(stage, x, y);
        const ti = stage.gridToPixels(row, col);
        y = this.lerp(y, ti.y, 0.1);
        return { x: x + d, y: y };
    }

    simulateMove(dir, stage, x, y, speed) {
        switch (dir) {
            case MovementHandler.DIRECTION.LEFT: return this.moveLeft(stage, x, y, speed);
            case MovementHandler.DIRECTION.UP: return this.moveUp(stage, x, y, speed);
            case MovementHandler.DIRECTION.RIGHT: return this.moveRight(stage, x, y, speed);
            case MovementHandler.DIRECTION.DOWN: return this.moveDown(stage, x, y, speed);
            case MovementHandler.DIRECTION.NONE: return { x: x, y: y };
            default: throw new Error("Invalid direction : " + dir);
        }
    }

    move(dir, stage, entity, dT) {
        if (entity === undefined)
            throw new Error("entity is undefined");
        if (entity.x === undefined)
            throw new Error("entity.x is undefined");
        if (entity.y === undefined)
            throw new Error("entity.y is undefined");
        if (entity.speed === undefined)
            throw new Error("entity.speed is undefined");

        //entity Speed is in cell per second. We need to convert it to pixel per dT
        const cellToParcour = entity.speed * dT / 1000;
        const speed = cellToParcour * stage.getDisplaySettings().tileSize;

        const { x, y } = this.simulateMove(dir, stage, entity.x, entity.y, speed);

        entity.x = x;
        entity.y = y;
    }
}

class MobileEntity {
    constructor() {
        this.Collider = new MovementHandler();
    }

    move(dir, dT = 0) {
        this.Collider.move(dir, this.stage, this, dT);
    }

    simulateMove(dir) {
        return this.Collider.simulateMove(dir, this.stage, this.x, this.y, this.speed);
    }

    canMove(dir) {
        return this.Collider.canMove(dir, this.stage, this.x, this.y, this.speed);
    }

    DEBUG_drawMobilityInfo(ctx) {
        const { tileSize, offsetX, offsetY } = this.stage.getDisplaySettings();

        // Colision detection
        for (let side of [
            {
                dir: "down",
                aoffset: -tileSize / 2,
                boffset: +tileSize / 2 - 2,
                coffset: tileSize,
                doffset: 2
            },
            {
                dir: "up",
                aoffset: -tileSize / 2,
                boffset: -tileSize / 2,
                coffset: tileSize,
                doffset: 2
            },
            {
                dir: "left",
                aoffset: -tileSize / 2,
                boffset: -tileSize / 2,
                coffset: 2,
                doffset: tileSize
            },
            {
                dir: "right",
                aoffset: +tileSize / 2 - 2,
                boffset: -tileSize / 2,
                coffset: 2,
                doffset: tileSize
            }
        ]) {
            let canMove = this.canMove(side.dir);
            if (canMove == 0)
                ctx.fillStyle = "red";
            else if (canMove > this.speed / 2)
                ctx.fillStyle = "green";
            else // proportionnal color
                ctx.fillStyle = `rgb(0,0,${255 * canMove / this.speed})`;
            ctx.fillRect(this.x + side.aoffset, this.y + side.boffset, side.coffset, side.doffset);
        }

        // Write current position (cell grid)
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";

        const { row, col } = this.Collider.getClosestTile(this.stage, this.x, this.y);
        ctx.fillText(`(${row}, ${col})`, this.x - tileSize / 2, this.y - tileSize / 2);


        for (let dir of [
            {
                varname: "wishDir",
                color: "blue"
            },
            {
                varname: "currentDir",
                color: "green"
            },
        ]) {
            if (!this[dir.varname]) continue
            if (this[dir.varname] === MovementHandler.DIRECTION.NONE) continue

            ctx.fillStyle = dir.color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            switch (this[dir.varname]) {
                case "up":
                    ctx.lineTo(this.x, this.y - tileSize / 2);
                    ctx.lineTo(this.x - 5, this.y - tileSize / 2 + 5);
                    ctx.moveTo(this.x, this.y - tileSize / 2);
                    ctx.lineTo(this.x + 5, this.y - tileSize / 2 + 5);
                    break;
                case "down":
                    ctx.lineTo(this.x, this.y + tileSize / 2);
                    ctx.lineTo(this.x - 5, this.y + tileSize / 2 - 5);
                    ctx.moveTo(this.x, this.y + tileSize / 2);
                    ctx.lineTo(this.x + 5, this.y + tileSize / 2 - 5);
                    break;
                case "left":
                    ctx.lineTo(this.x - tileSize / 2, this.y);
                    ctx.lineTo(this.x - tileSize / 2 + 5, this.y - 5);
                    ctx.moveTo(this.x - tileSize / 2, this.y);
                    ctx.lineTo(this.x - tileSize / 2 + 5, this.y + 5);
                    break;
                case "right":
                    ctx.lineTo(this.x + tileSize / 2, this.y);
                    ctx.lineTo(this.x + tileSize / 2 - 5, this.y - 5);
                    ctx.moveTo(this.x + tileSize / 2, this.y);
                    ctx.lineTo(this.x + tileSize / 2 - 5, this.y + 5);
                    break;
            }
        }
    }
}