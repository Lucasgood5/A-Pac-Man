class GameHandler {
    static STATUS = {
        NOT_STARTED: "not started",
        PLAYING: "playing",
        GAME_OVER: "game over",
    }
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.status = GameHandler.STATUS.NOT_STARTED;
        this.score = 0;

        this.nextFrame();
        AttachControlsToGameHandler(this);
    }

    startNewGame() {
        if (this.status !== GameHandler.STATUS.NOT_STARTED && this.status !== GameHandler.STATUS.GAME_OVER)
            throw new Error("Game already started");
        this.score = 0;
        this.LoadLevel(1);
    }

    LoadLevel(level) {
        console.log("Loading level", level);
        this.currentStage = Stage.StageLoader(this, level);
        this.status = GameHandler.STATUS.PLAYING;
        this.lvl = level;
    }

    RelayInput(input) {
        if (this.status == GameHandler.STATUS.PLAYING)
            this.currentStage.HandleControlInput(input);
        if (this.status == GameHandler.STATUS.GAME_OVER)
            this.startNewGame();
    }

    nextFrame() {
        if (this.status === GameHandler.STATUS.PLAYING) {
            this.currentStage.update();
            this.currentStage.draw();
            this.drawStageUI();
        }
        else if (this.status === GameHandler.STATUS.GAME_OVER) {
            this.drawGameOver();
        }
        else {
            this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        requestAnimationFrame(() => this.nextFrame());
    }

    drawStageUI() {
        let ctx = this.canvas.getContext("2d");

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Niveau : " + this.lvl, 10, 20);
        ctx.fillText("Score : " + Math.floor(this.score), 10, 40);
    }

    drawGameOver() {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "70px Arial bold";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 4);

        ctx.font = "30px Arial";
        ctx.fillText("Score : " + Math.floor(this.score), this.canvas.width / 2, this.canvas.height / 2 - 25);
        ctx.fillText("Niveau : " + this.lvl, this.canvas.width / 2, this.canvas.height / 2 + 25);


        ctx.fillText("Appuyez sur une touche pour recommencer", this.canvas.width / 2, this.canvas.height * 3 / 4);

    }

    GameOverScreen() {
        this.status = GameHandler.STATUS.GAME_OVER;
        this.drawGameOver();
    }

    nextLevel() {
        this.LoadLevel(this.lvl + 1);
    }
}

function AttachControlsToGameHandler(gameHandler) {
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                gameHandler.RelayInput("up");
                break;
            case "ArrowDown":
                gameHandler.RelayInput("down");
                break;
            case "ArrowLeft":
                gameHandler.RelayInput("left");
                break;
            case "ArrowRight":
                gameHandler.RelayInput("right");
                break;
        }
    });

    for (let button of ["up", "down", "left", "right"]) {
        document.getElementById(button).addEventListener("click", () => {
            gameHandler.RelayInput(button);
        });
    }
}

window.addEventListener("load", function () {
    const game = new GameHandler("gameCanvas");
    game.startNewGame();
});