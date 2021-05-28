import { Player } from './player.js';
import { Bug } from './bug.js';

let levelData = [
    {
        x: 1024 - 128, 
        y: 2048 - 192,
        repeat: 1,
        key: 'ground',
        frame: 0,
        width: 128,
        height: 128,
        physics: true
    },
    {
        x: 1024,
        y: 2048 - 192,
        repeat: 3,
        key: 'ground',
        frame: 1,
        width: 128,
        height: 128,
        physics: true
    },
    {
        x: 1024 + 384,
        y: 2048 - 192,
        repeat: 1,
        key: 'ground',
        frame: 2,
        width: 128,
        height: 128,
        physics: true

    },

    {
        x: 1024 + 128, 
        y: 2048 - 768,
        repeat: 1,
        key: 'ground',
        frame: 0,
        width: 128,
        height: 128,
        physics: true

    },
    {
        x: 1024 + 256, 
        y: 2048 - 768,
        repeat: 1,
        key: 'ground',
        frame: 1,
        width: 128,
        height: 128,
        physics: false

    },
    {
        x: 1024 + 384,
        y: 2048 - 768,
        repeat: 3,
        key: 'ground',
        frame: 1,
        width: 128,
        height: 128,
        physics: true

    },
    {
        x: 1024 + 768,
        y: 2048 - 768,
        repeat: 1,
        key: 'ground',
        frame: 2,
        width: 128,
        height: 128,
        physics: true
    },

    {
        x: 192, 
        y: 2048 - 384,
        repeat: 1,
        key: 'ground',
        frame: 0,
        width: 128,
        height: 128,
        physics: true
    },
    {
        x: 192 + 128,
        y: 2048 - 384,
        repeat: 2,
        key: 'ground',
        frame: 1,
        width: 128,
        height: 128,
        physics: true
    },
    {
        x: 192 + 384,
        y: 2048 - 384,
        repeat: 1,
        key: 'ground',
        frame: 2,
        width: 128,
        height: 128,
        physics: true
    },


    {
        x: 256 + 128, 
        y: 2048 - 1280,
        repeat: 1,
        key: 'ground',
        frame: 0,
        width: 128,
        height: 128,
        physics: true

    },
    {
        x: 256 + 256, 
        y: 2048 - 1280,
        repeat: 1,
        key: 'ground',
        frame: 1,
        width: 128,
        height: 128,
        physics: false

    },
    {
        x: 256 + 384,
        y: 2048 - 1280,
        repeat: 3,
        key: 'ground',
        frame: 1,
        width: 128,
        height: 128,
        physics: true

    },
    {
        x: 256 + 768,
        y: 2048 - 1280,
        repeat: 1,
        key: 'ground',
        frame: 2,
        width: 128,
        height: 128,
        physics: true
    },
]


let snailData = [
    {
        x: 192,
        y: 1568,
        key: 'snail',
        animation: 'snail-walking',
        min: {
            x: 192,
            y: 1568
        },
        max: {
            x: 640,
            y: 1568
        },
        velocity: 10
    },
    {
        x: 1152,
        y: 1152,
        key: 'snail',
        animation: 'snail-walking',
        min: {
            x: 1152,
            y: 1152
        },
        max: {
            x: 1920,
            y: 1152
        },
        velocity: 10
    },
    {
        x: 896,
        y: 672,
        key: 'snail',
        animation: 'snail-walking',
        min: {
            x: 384,
            y: 672
        },
        max: {
            x: 1024,
            y: 672
        },
        velocity: 10
    }
]

let ladybugsData = [
    {
        x: 1664,
        y: 1728,
        key: 'ladybug',
        frame: 0,
        animation: 'ladybug-flying',
        min: {
            x: 736,
            y: 1728
        }, 
        max: {
            x: 1664,
            y: 1728
        },
        velocity: 160
    },
]

export class Level001 extends Phaser.Scene {
    constructor() {
        super('Level001');
    }

    init() {
        this.controls = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown', (pointer) => {
            console.log(`${pointer.x}, ${pointer.y}`);
        })

        this.snailsToCatch = 0;
        this.success = false;
        this.hearts = [];
    }

    create() {
        this.platforms = this.physics.add.staticGroup({
            allowGravity: false,
            immovable: true
        });

        this.ladders = this.physics.add.staticGroup({
            allowGravity: false,
            immovable: true
        });

        this.snails = this.physics.add.group();
        this.ladybugs = this.physics.add.group({
            allowGravity: false
        });

        this.add.image(0, 0, 'background').setOrigin(0).setScale(2);

        this.createPlatforms();

        this.createLadder();

        this.createSnails();

        this.createLadybugs();

        this.createExit();        

        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            'player', 6
        );

        this.createAudioSources();
        
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.snails, this.platforms);
        this.physics.add.overlap(this.player, this.ladders, this.onLadder, null, this);
        this.physics.add.overlap(this.player, this.snails, this.onSnail, null, this);
        this.physics.add.overlap(this.player, this.ladybugs, this.onLadybug, null, this);
        this.physics.add.overlap(this.player, this.flag, this.onFlag, null, this);

        this.snailsToCatch = snailData.length;

        this.prepareHUD();
    }

    createPlatforms() {
        levelData.forEach(
            data => {
                let newPlatform = undefined;
                if(data.repeat == 1) {
                    newPlatform = this.add.sprite(data.x, data.y, data.key, data.frame);
                } else {
                    newPlatform = this.add.tileSprite(data.x, data.y, 
                        data.repeat * data.width, data.height, data.key, data.frame);
                }
                newPlatform.setOrigin(0);
                if(data.physics)
                {
                    this.platforms.add(newPlatform)
                }
            }
        );
    }

    createLadder() {
        let ladder = this.add.tileSprite(
            1024 + 256, 2048 - 768, 128, 5 * 128, 'objects', 3
        ).setOrigin(0);
        let ladderTop = this.add.sprite(
            1024 + 256, 2048 - 896, 'objects', 4
        ).setOrigin(0);
        this.ladders.add(ladder);
        this.ladders.add(ladderTop);

        ladder = this.add.tileSprite(
            256 + 256, 2048 - 1280, 128, 7 * 128, 'objects', 3
        ).setOrigin(0);
        ladderTop = this.add.sprite(
            256 + 256, 2048 - 1408, 'objects', 4
        ).setOrigin(0);
        this.ladders.add(ladder);
        this.ladders.add(ladderTop);
    }

    createSnails() {
        snailData.forEach( snail => {
            let newSnail = new Bug(this, snail);
            this.snails.add(newSnail);
        });
    }

    createLadybugs() {
        ladybugsData.forEach( ladybug => {
            let newLadybug = new Bug(this, ladybug);
            this.ladybugs.add(newLadybug);
        });        
    }

    createAudioSources() {
        this.catch = this.sound.add('ding', { loop: false });
        this.punch = this.sound.add('punch', { loop: false });
        this.tada = this.sound.add('tada', { loop: false });
    }

    createExit() {
        this.flag = this.add.sprite(
            this.game.config.width - 128,
            this.game.config.height - 128,
            'objects', 0
        ).setOrigin(0);

        this.physics.add.existing(this.flag);
        this.flag.body.allowGravity = false;
        this.flag.body.setImmovable(false);

        this.sign = this.add.image(
            this.game.config.width - 276,
            this.game.config.height - 128,
            'objects', 5
        ).setOrigin(0);
    }


    prepareHUD() {
        let nLives = this.player.getLives();

        for(let i = 0; i < nLives; ++i) {
            this.hearts.push(
                this.add.image(128 + i * 128, 128, 'full_heart')
            );
        }
    }

    updateHUD() {
        let availableLives = this.player.getLives();

        for(let i = this.hearts.length - 1; i >= availableLives; --i) {
            this.hearts[i].setTexture('empty_heart');
        }
        
    }

    onLadder(player, ladder) {
        this.player.setOnLadder(true);
    }

    onSnail(player, snail) {
        snail.destroy();
        this.catch.play();
        this.snailsToCatch--;
        if(this.snailsToCatch === 0) {
            this.tada.play();
            this.flag.anims.play('wave');
            this.success = true;
        }
    }

    onLadybug(player, ladybug) {
        player.hit();
        //this.punch.play();
        if(!player.isDead()) {
            player.setPosition(
                this.game.config.width * 0.5,
                this.game.config.height * 0.5,
            )
        } else {
            this.scene.restart();
        }
    }

    onFlag(player, flag) {
        if(this.success) {
            console.log("Hurray!");
            //carregar o próximo nível
        }
    }

    update(time) {
        this.player.update(time);
        this.snails.getChildren().forEach( snail => snail.update(time));
        this.ladybugs.getChildren().forEach( ladybug => ladybug.update(time));

        this.player.setOnLadder(false);
        this.updateHUD();
    }
}