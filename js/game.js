import { LoadScene } from './loadscene.js';
import { Level001 } from './level001.js';

const config = {
    width: 2048,
    height: 2048,
    type: Phaser.AUTO,
    parent: 'game-canvas',
    backgroundColor: '#e7fdff',
    scene: [LoadScene, Level001],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800
            },
            debug: true
        }
    },
    pixelArt: true
}

new Phaser.Game(config);