class Mario {

  constructor(ctx, x, y) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.ground = 0;

    this.h = MARIO_H;
    this.w = MARIO_W;

    this.vx = 0;
    this.vy = 0;
    this.ay = 0;

    this.isJumping = false;

    this.sprite = new Image();
    this.sprite.src = '/assets/images/sprites/sprite-mario.png';
    this.sprite.vFrames = 2;
    this.sprite.hFrames = 2;
    this.sprite.vFrameIndex = 0;
    this.sprite.hFrameIndex = 1;
    this.sprite.onload = () => {
      this.sprite.isReady = true;
      this.sprite.frameW = Math.floor(this.sprite.width / this.sprite.vFrames);
      this.sprite.frameH = Math.floor(this.sprite.height / this.sprite.hFrames);
    }

    this.drawCount = 0;
  }

  groundTo(groundY) {
    this.y = groundY - this.h;
    this.ground = groundY;
  }

  onKeyEvent(event) {
    const isPressed = event.type === 'keydown';
    switch(event.keyCode) {
      case KEY_RIGHT:
        if (isPressed) {
          console.debug(event);
          this.vx = MARIO_VX;
        } else {
          this.vx = 0;
        }
        break;
      case KEY_LEFT:
        if (isPressed) {
          this.vx = -MARIO_VX;
        } else {
          this.vx = 0;
        }
        break;
      case KEY_UP:
        if (!this.isJumping) {
          this.isJumping = true;
          this.vy = -MARIO_VY;
          this.ay = MARIO_AY;
        }
        break;
    }
  }

  move() {
    this.vy += this.ay;

    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.h > this.ground) {
      this.groundTo(this.ground);
      this.vy = 0;
      this.ay = 0;
      this.isJumping = false;
    }
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
    if (this.isJumping) {
      this.sprite.hFrameIndex = 0;
      this.sprite.vFrameIndex = 0;
    } else if (this.vx !== 0) {
      this.animateFrame(1, 0, 2, 5);
    } else {
      this.sprite.hFrameIndex = 1;
      this.sprite.vFrameIndex = 0;
    }
  }

  animateFrame(initialHFrame, initialVFrame, frames, frequency) {
    if (this.sprite.hFrameIndex !== initialHFrame) {
      this.sprite.hFrameIndex = initialHFrame;
      this.sprite.vFrameIndex = initialVFrame;
    } else if (this.drawCount % frequency === 0) {
      this.drawCount = 0;
      this.sprite.vFrameIndex = (this.sprite.vFrameIndex + 1) % frames;
    }
  }

}