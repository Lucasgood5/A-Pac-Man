class AStarPathfindingStrategy extends PathfindingStrategy {

    static formula = {
        verticalManhattanPriority: (a, b) => Math.abs(a.row - b.row) + 2 * Math.abs(a.col - b.col),
        horizontalManhattanPriority: (a, b) => 2 * Math.abs(a.row - b.row) + Math.abs(a.col - b.col),
        euclidean: (a, b) => Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2))
    }

    constructor(formula = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col)) {
        super();
        this.formula = formula;
    }

    getNextDirection(entity, target, stage) {
        let start = stage.pixelToGrid(entity.x, entity.y);
        let goal = stage.pixelToGrid(target.x, target.y);

        let path = this.aStarSearch(start, goal, stage);
        if (path.length < 2) return null; // No valid path

        let nextMove = path[1]; // First step towards Pac-Man
        return this.getDirectionFromTiles(start, nextMove);
    }

    getDirectionFromTiles(start, next) {
        if (next.row < start.row) return "up";
        if (next.row > start.row) return "down";
        if (next.col < start.col) return "left";
        if (next.col > start.col) return "right";
        return null;
    }

    aStarSearch(start, goal, stage) {
        let openSet = new PriorityQueue();
        openSet.enqueue(start, 0);

        let cameFrom = new Map();
        let gScore = new Map();
        let fScore = new Map();

        const hash = (tile) => `${tile.row},${tile.col}`;
        gScore.set(hash(start), 0);
        fScore.set(hash(start), this.heuristic(start, goal));

        while (!openSet.isEmpty()) {
            let current = openSet.dequeue();
            if (current.row === goal.row && current.col === goal.col) {
                return this.reconstructPath(cameFrom, current);
            }

            for (let neighbor of this.getNeighbors(current, stage)) {
                let tempGScore = gScore.get(hash(current)) + 1;

                if (!gScore.has(hash(neighbor)) || tempGScore < gScore.get(hash(neighbor))) {
                    cameFrom.set(hash(neighbor), current);
                    gScore.set(hash(neighbor), tempGScore);
                    fScore.set(hash(neighbor), tempGScore + this.heuristic(neighbor, goal));
                    openSet.enqueue(neighbor, fScore.get(hash(neighbor)));
                }
            }
        }

        return []; // No path found
    }

    getNeighbors(tile, stage) {
        let directions = [
            { row: -1, col: 0 }, // up
            { row: 1, col: 0 },  // down
            { row: 0, col: -1 }, // left
            { row: 0, col: 1 }   // right
        ];

        let neighbors = [];
        for (let dir of directions) {
            let newRow = tile.row + dir.row;
            let newCol = tile.col + dir.col;
            if (newRow >= 0 && newRow < stage.lvlHeight &&
                newCol >= 0 && newCol < stage.lvlWidth &&
                !stage.isAWall(newRow, newCol)) {
                neighbors.push({ row: newRow, col: newCol });
            }
        }
        return neighbors;
    }

    heuristic(a, b) {
        return this.formula(a, b)
    }

    reconstructPath(cameFrom, current) {
        let path = [current];
        const hash = (tile) => `${tile.row},${tile.col}`;
        while (cameFrom.has(hash(current))) {
            current = cameFrom.get(hash(current));
            path.unshift(current);
        }
        return path;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(item, priority) {
        this.items.push({ item, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.items.shift().item;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}
