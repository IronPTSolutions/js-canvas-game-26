class Enemy {

  static createBowser(ctx, x, y) {
    return new Enemy(
      ctx,
      x,
      y,
      BOWSER_WITH,
      BOWSER_HEIGHT,
      BOWSER_SPRITE_VF,
      BOWSER_SPRITE_HF,
      BOWSER_SPRITE,
      BOWSER_SCORE
    );
  }

  constructor(ctx, x, y, w, h, vFrames, hFrames, src, score) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.vx = -ENEMY_VX;

    this.score = score;

    this.sprite = new Image();
    this.sprite.src = src;
    this.sprite.vFrames = vFrames;
    this.sprite.hFrames = hFrames;
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
    if (this.drawCount >= ENEMY_ANIMATION_FREQ) {
      this.drawCount = 0;
      this.sprite.vFrameIndex = (this.sprite.vFrameIndex + 1) % this.sprite.vFrames;
    }
  }

  move() {
    this.x += this.vx;
  }


}