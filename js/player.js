export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setScale(0.9);

        this.initialFrame = frame;

        this.horizontal_velocity = 200;
        this.jump_velocity = 600;

        this.controls = scene.input.keyboard.createCursorKeys();

        this.onLadder = false;

        this.state = "stopped";
        this.previous_state = this.state;

        this.lives = 3;
    }

    setOnLadder(value) {
        this.onLadder = value;
    }

    update(time) {

        let onGround = 
            this.body.blocked.down ||
            this.body.touching.down 
        
        this.body.allowGravity = !this.onLadder;

        if(this.controls.left.isDown) {
            this.setVelocityX(-this.horizontal_velocity);
            this.flipX = true;
            if(onGround /*&& !this.anims.isPlaying*/)
            {
                this.state = "walking";
                //this.anims.play('walking');
            }
        } else if(this.controls.right.isDown) {
            this.setVelocityX(this.horizontal_velocity);
            this.flipX = false;
            if(onGround /*&& !this.anims.isPlaying*/)
            {
                this.state = "walking";
                //this.anims.play('walking');
            }
        } else {
            this.setVelocityX(0);
            // if(this.anims.isPlaying) {
            //     this.anims.stop('walking');
            // }
            if(onGround){
                this.state = "stopped";
                //this.setFrame(this.initialFrame);
            }
        }

        if(onGround && this.controls.space.isDown) {
            this.setVelocityY(-this.jump_velocity);
            this.state = "jumping";
            //this.setFrame(5);
        }

        if(this.onLadder) {
            if(this.controls.up.isDown) {
                this.setVelocityY(-this.horizontal_velocity);
                this.state = "climbing";
                // if(!this.anims.isPlaying) {
                //     this.anims.play('climbing');
                // }
            } else if(this.controls.down.isDown) {
                this.setVelocityY(this.horizontal_velocity);
                this.state = "climbing";
                // if(!this.anims.isPlaying) {
                //     this.anims.play('climbing');
                // }
            } else {
                this.setVelocityY(0);
                this.state = "stopped";
            }
        }

        //stopped, walking, jumping, climbing
        if(this.state != this.previous_state) {
            this.previous_state = this.state;
            if(this.anims.isPlaying) {
                this.anims.stop();
            }

            if(this.state == 'walking') {
                this.anims.play('walking');
            } else if(this.state == 'climbing') {
                this.anims.play('climbing');
            } else if(this.state == 'jumping') {
                this.setFrame(5);
            } else if(this.state == 'stopped') {
                this.setFrame(this.initialFrame);
            }
        }
    }

    hit() {
        this.lives--;
    }

    isDead() {
        return this.lives === 0;
    }

    getLives() {
        return this.lives;
    }
}