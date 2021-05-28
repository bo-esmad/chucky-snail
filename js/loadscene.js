export class LoadScene extends Phaser.Scene {
    constructor() {
        super('LoadScene');
    }

    preload() {
        this.load.image('background', './images/blue_land.png');
        this.load.spritesheet('player', './images/player.png', {
            frameWidth: 128,
            frameHeight: 144
        })
        this.load.spritesheet('ground', './images/ground.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('objects', './images/objects.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('snail', './images/snail.png', {
            frameWidth: 128,
            frameHeight: 96
        });
        this.load.spritesheet('ladybug', './images/lady_bug.png', {
            frameWidth: 128,
            frameHeight: 96
        });

        this.load.image('full_heart', './images/hudHeart_full.png');
        this.load.image('empty_heart', './images/hudHeart_empty.png');


        this.load.audio('ding', './audio/ding.wav');
        this.load.audio('punch', './audio/punch.wav');
        this.load.audio('tada', './audio/tada.wav');
    }

    create() {
        this.createAnimations();

        this.scene.start('Level001');
    }

    createAnimations() {
        this.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNames('player', {
                frames: [9, 10]
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'climbing',
            frames: this.anims.generateFrameNames('player', {
                frames: [0, 1]
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1
        });


        this.anims.create({
            key: 'snail-walking',
            frames: this.anims.generateFrameNames('snail', {
                frames: [0, 1]
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1
        });


        this.anims.create({
            key: 'ladybug-flying',
            frames: this.anims.generateFrameNames('ladybug', {
                frames: [0, 1]
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'wave',
            frames: this.anims.generateFrameNames('objects', {
                frames: [1, 2]
            }),
            frameRate: 4,
            yoyo: true,
            repeat: -1
        });
    }
}