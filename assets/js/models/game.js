class Game {

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    this.ctx = this.canvas.getContext('2d');

    this.mario = new Mario(this.ctx, 150, 150);
    this.mario.groundTo(this.canvas.height - BG_FLOOR);

    this.background = new Background(this.ctx);

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
  }

  draw() {
    this.background.draw();
    this.mario.draw();
  }

}