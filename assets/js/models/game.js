class Game {

  constructor(canvasId, scoreContainerId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    this.ctx = this.canvas.getContext('2d');

    this.scoreContainerId = scoreContainerId;

    this.mario = new Mario(this.ctx, 150, 150);
    this.mario.groundTo(this.canvas.height - BG_FLOOR);

    this.background = new Background(this.ctx);

    this.coins = [];
    this.coinTimeoutId = undefined;

    this.enemies = [];
    this.enemyTimeoutId = undefined;

    this.score = 0;

    this.hearts = 2;

    this.fps = FPS;
    this.drawIntervalId = undefined;
  }

  start() {
    if (!this.drawIntervalId) {
      this.setupListeners();

      this.drawIntervalId = setInterval(() => {
        this.clear();
        this.move();
        this.draw();
        this.checkCollisions();
        this.generateElements();
        this.checkGameOver();
        this.updateMarkers();
      }, this.fps)
    }
  }

  setupListeners() {
    addEventListener('keydown', (event) => this.mario.onKeyEvent(event))
    addEventListener('keyup', (event) => this.mario.onKeyEvent(event))
  }

  stop() {
    clearInterval(this.drawIntervalId);
    this.drawIntervalId = undefined;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  move() {
    //this.background.move();
    //this.coins.forEach((coin) => coin.move());

    this.mario.move();
    this.enemies.forEach((enemy) => enemy.move());

    this.checkBounds();
  }

  checkBounds() {
    if (this.mario.x < 0) {
      this.mario.x = 0;
    }
    if (this.mario.x + this.mario.w > this.canvas.width) {
      this.mario.x = this.canvas.width - this.mario.w;
    }

    this.coins = this.coins.filter((coin) => !(coin.x + coin.w < 0))
  }

  checkCollisions() {
    this.coins = this.coins.filter((coin) => {
      if (this.mario.collidesWith(coin)) {
        this.score += coin.score;
        return false;
      } else {
        return true;
      }
    });

    this.enemies = this.enemies.filter((enemy) => {
      if (this.mario.collidesWith(enemy)) {
        if (this.mario.y < enemy.y && this.mario.isJumping) {
          this.score += enemy.score;
        } else {
          this.hearts--;
        }
        return false;
      } else {
        return true;
      }
    })
  }

  draw() {
    this.background.draw();
    this.mario.draw();
    this.coins.forEach((coin) => coin.draw());
    this.enemies.forEach((enemy) => enemy.draw());
  }

  generateElements() {
    if (!this.coinTimeoutId && this.coins.length < MAX_IN_GAME_COINS) {
      this.coinTimeoutId = setTimeout(() => {
        this.coins.push(new Coin(this.ctx, Math.random() * this.canvas.width, Math.random() * this.canvas.height));
        this.coinTimeoutId = undefined;
      }, Math.floor(Math.random() * 10) * 1000)
    }

    if (!this.enemyTimeoutId) {
      this.enemyTimeoutId = setTimeout(() => {
        this.enemies.push(
          Enemy.createBowser(
            this.ctx,
            this.canvas.width + 100,
            this.canvas.height - BG_FLOOR - BOWSER_HEIGHT
          )
        );
        this.enemyTimeoutId = undefined;
      }, Math.floor(Math.random() * 5) * 1000)
    }
  }

  checkGameOver() {
    if (this.hearts <= 0) {
      this.stop();
    }
  }

  updateMarkers() {
    this.ctx.save();
    this.ctx.font = "40px serif";
    this.ctx.fillStyle = "red";
    this.ctx.fillText(this.score, 100, 100);
    this.ctx.restore();

    const scoreContainer = document.getElementById(this.scoreContainerId);
    if (scoreContainer) {
      scoreContainer.innerText = this.score;
    }
  }

}

