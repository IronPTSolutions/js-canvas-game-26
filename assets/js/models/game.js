class Game {

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    this.ctx = this.canvas.getContext('2d');

    this.mario = new Mario(this.ctx, 150, 150);
    this.mario.groundTo(this.canvas.height - BG_FLOOR);

    this.background = new Background(this.ctx);

    this.coins = [
      new Coin(this.ctx, this.canvas.width + 700, this.canvas.height - 150),
    ];
    this.coinTimeoutId = undefined;

    this.score = 0;

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
  }

  draw() {
    this.background.draw();
    this.mario.draw();
    this.coins.forEach((coin) => coin.draw());
  }

  generateElements() {
    if (!this.coinTimeoutId && this.coins.length < MAX_IN_GAME_COINS) {
      this.coinTimeoutId = setTimeout(() => {
        this.coins.push(new Coin(this.ctx, Math.random() * this.canvas.width, Math.random() * this.canvas.height));
        this.coinTimeoutId = undefined;
      }, Math.floor(Math.random() * 10) * 1000)
    }
  }

}

