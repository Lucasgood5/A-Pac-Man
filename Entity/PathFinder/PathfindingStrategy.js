class PathfindingStrategy {
    getPossibleDirections(entity) {
        // Liste des directions possibles, vérifiées via les méthodes canMoveXXX du fantôme
        let possible = [];
        for (let dir of [
            MovementHandler.DIRECTION.LEFT,
            MovementHandler.DIRECTION.UP,
            MovementHandler.DIRECTION.RIGHT,
            MovementHandler.DIRECTION.DOWN
        ]) {
            if (entity.canMove(dir)) {
                possible.push(dir);
            }
        }
        return possible;
    }
}

class DirectPathfindingStrategy extends PathfindingStrategy {

    constructor({ randomness, forwardness } = { randomness: 0.01, forwardness: 0.2 }) {
        super();
        this.randomness = randomness;
        this.randomStrat = new RandomPathfindingStrategy({ forwardness });
        this.forwardness = forwardness;
    }

    getSides(entity, target) {
        let sides = [];
        if (entity.y > target.y) sides.push("up");
        if (entity.y < target.y) sides.push("down");
        if (entity.x > target.x) sides.push("left");
        if (entity.x < target.x) sides.push("right");
        return sides;
    }

    getFavoriteDirection(entity, target) {
        let dX = entity.x - target.x;
        let dY = entity.y - target.y;
        if (Math.abs(dX) > Math.abs(dY)) {
            return dX > 0 ? "left" : "right";
        }
        return dY > 0 ? "up" : "down";
    }

    getNextDirection(entity, target, stage) {
        if (Math.random() < this.randomness) {
            return this.randomStrat.getNextDirection(entity, target, stage);
        }

        let possible = this.getPossibleDirections(entity, stage);
        if (possible.length == 0) return null;
        if (possible.length == 2 && possible.includes(entity.currentDir)) {
            return entity.currentDir;
        }

        if (Math.random() < this.forwardness) {
            if (entity.currentDir != null) {
                if (possible.includes(entity.currentDir)) {
                    return entity.currentDir;
                }
            }
        }

        let sides = this.getSides(entity, target);

        let selected = possible.filter(dir => sides.includes(dir));
        if (selected.length === 0) {
            return this.randomStrat.getNextDirection(entity, target, stage);
        }
        if (selected.length === 1) {
            return selected[0];
        }
        let favorite = this.getFavoriteDirection(entity, target);
        if (selected.includes(favorite)) {
            return favorite;
        }
        console.error("No direction found");
        return this.randomStrat.getNextDirection(entity, target, stage);
    }
}

// Stratégie aléatoire : le fantôme choisit une direction parmi celles possibles de manière aléatoire
class RandomPathfindingStrategy extends PathfindingStrategy {
    /**
     * 
     * @param {Number} forwardness How likely the entity is to keep going in the same direction [0-1]
     */
    constructor({ forwardness } = { forwardness: 0.995 }) {
        super();
        if (forwardness < 0 || forwardness > 1) {
            throw new Error("forwardness must be between 0 and 1");
        }
        if (forwardness < 0.9) {
            console.warn("A forwardness of less than 0.9 is not recommended");
        }
        this.forwardness = forwardness;
    }

    getNextDirection(entity, target, stage) {
        let possible = this.getPossibleDirections(entity, stage);
        if (possible.length === 0) return null;

        if (entity.currentDir != null && entity.currentDir != MovementHandler.DIRECTION.NONE)
            if (possible.includes(entity.lastDir) && Math.random() < this.forwardness) {
                return entity.currentDir;
            }


        let index = Math.floor(Math.random() * possible.length);
        return possible[index];
    }
}
