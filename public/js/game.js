var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    width: 1024,
    height: 1024,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};

function preload() {
    this.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');

    this.load.image('background', 'img/bg.png');
    this.load.image('grid', 'img/grid.png');
    this.load.image('ship-5', 'img/ship-5.png');
    this.load.image('ship-4', 'img/ship-4.png');
    this.load.image('ship-3a', 'img/ship-3a.png');
    this.load.image('ship-3b', 'img/ship-3b.png');
    this.load.image('ship-2', 'img/ship-2.png');
}
var ships = []
function create() {
    this.add.image(512, 512, 'background');
    this.add.sprite(400, 512, 'grid');

    var ship5 = this.add.sprite(49 + (0 * 90), 161, 'ship-5').setInteractive();
    ship5.info = { size: 5, horizontal: false }
    var ship4 = this.add.sprite(49 + (1 * 90), 161, 'ship-4').setInteractive();
    ship4.info = { size: 4, horizontal: false }
    var ship3a = this.add.sprite(49 + (2 * 90), 161, 'ship-3a').setInteractive();
    ship3a.info = { size: 3, horizontal: false }
    var ship3b = this.add.sprite(49 + (3 * 90), 161, 'ship-3b').setInteractive();
    ship3b.info = { size: 3, horizontal: false }
    var ship2 = this.add.sprite(49 + (4 * 90), 161, 'ship-2').setInteractive();
    ship2.info = { size: 2, horizontal: false }

    ships = [ship5, ship4, ship3a, ship3b, ship2];
    for (key in ships) {
        ships[key].setOrigin(0, 0);
        ships[key].on('pointerover', function () {this.setTint(0x00ff00)});
        ships[key].on('pointerout', function () {this.clearTint()});
        this.input.setDraggable(ships[key]);
    }

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        if (ships.includes(gameObject)) {
            clearTints()
            gameObject.setTint(0x0000ff);
            stayInGrid(gameObject, dragX, dragY);
        }
    });

    var tap = this.rexGestures.add.tap({});
    tap.on('tap', function (tap, gameObject, lastPointer) {
        console.log(tap);
        if (tap.tapsCount > 1) {
            console.log("rotate");
            for (key in ships) {
                if (ships[key].getBounds().x < tap.x && ships[key].getBounds().x + ships[key].getBounds().width > tap.x &&
                    ships[key].getBounds().y < tap.y && ships[key].getBounds().y + ships[key].getBounds().height > tap.y) {
                    if (!ships[key].info.horizontal) {
                        ships[key].rotation = -1.57;
                        ships[key].info.horizontal = true;
                        ships[key].setOrigin(1, 0);
                    } else {
                        ships[key].rotation = 0;
                        ships[key].info.horizontal = false;
                        ships[key].setOrigin(0, 0);
                    }
                    stayInGrid(ships[key], ships[key].x,ships[key].y);
                }
            }
        }
    });
}

function update() {
    for (let i = 0; i < ships.length - 1; i++) {
        for (let j = i + 1; j < ships.length; j++) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(ships[j].getBounds(), ships[i].getBounds())) {
                ships[j].setTint(0xff0000);
                ships[i].setTint(0xff0000);
            }
        }
    }
}

function stayInGrid(gameObject, x, y){
    if (!gameObject.info.horizontal) {
        gameObject.x = Math.round(clamp((x - 49) / 90, 0, 7)) * 90 + 49;
        gameObject.y = Math.round(clamp((y - 161) / 90, 0, 8 - gameObject.info.size)) * 90 + 161;
    } else {
        gameObject.x = Math.round(clamp((x - 49) / 90, 0, 8 - gameObject.info.size)) * 90 + 49;
        gameObject.y = Math.round(clamp((y - 161) / 90, 0, 7)) * 90 + 161;
    }

}

function clearTints() {
    for (let i = 0; i < ships.length - 1; i++) {
        for (let j = i + 1; j < ships.length; j++) {
            if (!Phaser.Geom.Intersects.RectangleToRectangle(ships[j].getBounds(), ships[i].getBounds())) {
                ships[j].clearTint();
                ships[i].clearTint();
            }
        }
    }
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);