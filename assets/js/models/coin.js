class Coin {

  constructor(ctx, x, y, score = COIN_SCORE, w = COIN_W, h = COIN_H, scr = COIN_SPRITE) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.vx = -COIN_VX;

    this.score = score;

    this.sprite = new Image();
    this.sprite.src = COIN_SPRITE;
    this.sprite.vFrames = 4;
    this.sprite.hFrames = 1;
    this.sprite.vFrameIndex = 0;
    this.sprite.hFrameIndex = 0;
    this.sprite.onload = () => {
      this.sprite.isReady = true;
      this.sprite.frameW = Math.floor(this.sprite.width / this.sprite.vFrames);
      this.sprite.frameH = Math.floor(this.sprite.height / this.sprite.hFrames);
    }
    
    this.drawCount = 0;
  }

  draw() {
    if (this.sprite.isReady) {
      this.ctx.drawImage(
        this.sprite,
        this.sprite.vFrameIndex * this.sprite.frameW,
        this.sprite.hFrameIndex * this.sprite.frameH,
        this.sprite.frameW,
        this.sprite.frameH,
        this.x,
        this.y,
        this.w,
        this.h
      );

      this.animate();
      this.drawCount++;
    }
  }

  animate() {
    if (this.drawCount >= COIN_ANIMATION_FREQ) {
      this.drawCount = 0;
      this.sprite.vFrameIndex = (this.sprite.vFrameIndex + 1) % this.sprite.vFrames;
    }
  }

  move() {
    this.x += this.vx;
  }

}
