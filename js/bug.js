export class Bug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, data) {
        super(scene, data.x, data.y, data.key, data.frame);

        this.setOrigin(0);
        scene.add.existing(this);

        this.min = data.min;
        this.max = data.max;

        this.velocity = data.velocity;
        this.anims.play(data.animation);

        this.setFlipX(true);
    }

    update(time) {
        this.setVelocityX(this.velocity);

        if((this.velocity < 0 && Math.abs(this.x - this.min.x) < 0.001)
        || (this.velocity > 0 && Math.abs(this.x - this.max.x) < 0.001)) {
            this.velocity = -this.velocity;
            this.setFlipX(!this.flipX);
        }
    }
}