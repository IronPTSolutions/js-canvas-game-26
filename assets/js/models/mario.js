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

    this.sprite = undefined;

    this.spriteRight = new Image();
    this.spriteRight.src = '/assets/images/sprites/mario/sprite-right-mario.png';
    this.spriteRight.vFrames = 2;
    this.spriteRight.hFrames = 2;
    this.spriteRight.vFrameIndex = 0;
    this.spriteRight.hFrameIndex = 1;
    this.spriteRight.onload = () => {
      this.spriteRight.isReady = true;
      this.spriteRight.frameW = Math.floor(this.spriteRight.width / this.spriteRight.vFrames);
      this.spriteRight.frameH = Math.floor(this.spriteRight.height / this.spriteRight.hFrames);
    }

    this.spriteLeft = new Image();
    this.spriteLeft.src = '/assets/images/sprites/mario/sprite-left-mario.png';
    this.spriteLeft.vFrames = 2;
    this.spriteLeft.hFrames = 2;
    this.spriteLeft.vFrameIndex = 0;
    this.spriteLeft.hFrameIndex = 1;
    this.spriteLeft.onload = () => {
      this.spriteLeft.isReady = true;
      this.spriteLeft.frameW = Math.floor(this.spriteLeft.width / this.spriteLeft.vFrames);
      this.spriteLeft.frameH = Math.floor(this.spriteLeft.height / this.spriteLeft.hFrames);
    }

    this.sprite = this.spriteRight;

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
          this.sprite = this.spriteRight;
          this.vx = MARIO_VX;
        } else {
          this.vx = 0;
        }
        break;
      case KEY_LEFT:
        if (isPressed) {
          this.sprite = this.spriteLeft;
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