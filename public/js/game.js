

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
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
gameState = 0;
function preload() {
    this.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');

    this.load.image('background', 'img/bg.png');
    this.load.image('grid', 'img/grid.png');
    this.load.image('ship-5', 'img/ship-5.png');
    this.load.image('ship-4', 'img/ship-4.png');
    this.load.image('ship-3a', 'img/ship-3a.png');
    this.load.image('ship-3b', 'img/ship-3b.png');
    this.load.image('ship-2', 'img/ship-2.png');

    this.load.image('double', 'img/double.png');
    this.load.image('buttonA', 'img/DoneButtonA.png');
    this.load.image('buttonB', 'img/DoneButtonB.png');
}
var ships = [];
function create() {
    this.add.image(512, 512, 'background');
    this.add.image(512, 600, 'grid');
    textMessage = this.add.text(512, 975, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: 35, align: "center", color: "black" });


    doubleHelp = this.add.image(300, 150, 'double').setScale(0.25);
    button = this.add.sprite(750, 150, 'buttonA').setInteractive()
        .on('pointermove', function () { this.setTexture('buttonB'); })
        .on('pointerout', function () { this.setTexture('buttonA'); });


    var ship5 = this.add.sprite(161 + (0 * 90), 249, 'ship-5').setInteractive();
    ship5.info = { size: 5, horizontal: false }
    var ship4 = this.add.sprite(161 + (1 * 90), 249, 'ship-4').setInteractive();
    ship4.info = { size: 4, horizontal: false }
    var ship3a = this.add.sprite(161 + (2 * 90), 249, 'ship-3a').setInteractive();
    ship3a.info = { size: 3, horizontal: false }
    var ship3b = this.add.sprite(161 + (3 * 90), 249, 'ship-3b').setInteractive();
    ship3b.info = { size: 3, horizontal: false }
    var ship2 = this.add.sprite(161 + (4 * 90), 249, 'ship-2').setInteractive();
    ship2.info = { size: 2, horizontal: false }

    ships = [ship5, ship4, ship3a, ship3b, ship2];
    for (key in ships) {
        ships[key].setOrigin(0, 0)
            .on('pointermove', function () { if (gameState == 0) this.setTint(0x00ff00) })
            .on('pointerout', function () { this.clearTint() });
        this.input.setDraggable(ships[key]);
    }

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        if (ships.includes(gameObject) && gameState == 0) {
            gameObject.setTint(0x0000ff);
            stayInGrid(gameObject, dragX, dragY);

            for (let i = 0; i < ships.length - 1; i++) {
                for (let j = i + 1; j < ships.length; j++) {
                    if (!Phaser.Geom.Intersects.RectangleToRectangle(ships[j].getBounds(), ships[i].getBounds())) {
                        ships[j].clearTint();
                        ships[i].clearTint();
                    }
                }
            }
        }
    });

    var tap = this.rexGestures.add.tap({});

    tap.on('tap', function (tap, gameObject, lastPointer) {
        if (gameState == 0) {
            if (tap.tapsCount > 1) {
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
                        stayInGrid(ships[key], ships[key].x, ships[key].y);
                    }
                }
            } else {
                if (button.getBounds().x < tap.x && button.getBounds().x + button.getBounds().width > tap.x &&
                    button.getBounds().y < tap.y && button.getBounds().y + button.getBounds().height > tap.y) {
                    goodLayout = true;
                    for (let i = 0; i < ships.length - 1; i++) {
                        for (let j = i + 1; j < ships.length; j++) {
                            if (Phaser.Geom.Intersects.RectangleToRectangle(ships[j].getBounds(), ships[i].getBounds())) {
                                goodLayout = false;
                            }
                        }
                    }
                    if (goodLayout) {
                        console.log("good");
                        layout = []
                        for (key in ships) {
                            layout[key] = {
                                x: Math.round((ships[key].x - 161) / 90),
                                y: Math.round((ships[key].y - 249) / 90),
                                size: ships[key].info.size,
                                horizontal: ships[key].info.horizontal,
                            }
                        }
                        textMessage.setText("Waiting On Opponent")
                        textMessage.x = 512 - textMessage.width / 2;
                        socket.emit("placedShips", { layout: layout, RoomName: clientData.RoomName })
                        console.log(layout);
                        button.setActive(false).setVisible(false);
                        doubleHelp.setActive(false).setVisible(false);
                        gameState = 1;
                    }
                }
            }
        }
    });

    socket.on("gameUpdate", data => {
        if (data.message == "opponentReady") {
            textMessage.setText("Opponent Is Ready")
            textMessage.x = 512 - textMessage.width / 2;
        } else if (data.message == "bothReady") {
            textMessage.setText("")
            this.add.image(256, 128, 'grid').setScale(0.25);

            for (key in ships) {
                ships[key].setScale(0.25);
                ships[key].x = 168.25 + (Math.round((ships[key].x - 161) / 90) * 90 / 4);
                ships[key].y = 40.25 + (Math.round((ships[key].y - 249) / 90) * 90 / 4);
                this.children.bringToTop(ships[key])
            }
            if (data.turn == socket.id) {
                console.log("my turn")
            } else {
                console.log("their turn")
            }
        }
    });
}

function update() {
    if (gameState == 0) {
        for (let i = 0; i < ships.length - 1; i++) {
            for (let j = i + 1; j < ships.length; j++) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(ships[j].getBounds(), ships[i].getBounds())) {
                    ships[j].setTint(0xff0000);
                    ships[i].setTint(0xff0000);
                }
            }
        }
    }
}

function stayInGrid(gameObject, x, y) {
    if (!gameObject.info.horizontal) {
        gameObject.x = Math.round(clamp((x - 161) / 90, 0, 7)) * 90 + 161;
        gameObject.y = Math.round(clamp((y - 249) / 90, 0, 8 - gameObject.info.size)) * 90 + 249;
    } else {
        gameObject.x = Math.round(clamp((x - 161) / 90, 0, 8 - gameObject.info.size)) * 90 + 161;
        gameObject.y = Math.round(clamp((y - 249) / 90, 0, 7)) * 90 + 249;
    }

    for (let i = 0; i < ships.length - 1; i++) {
        for (let j = i + 1; j < ships.length; j++) {
            if (!Phaser.Geom.Intersects.RectangleToRectangle(ships[j].getBounds(), ships[i].getBounds())) {
                ships[j].clearTint();
                ships[i].clearTint();
            }
        }
    }
    game = gameObject.displayList.parent.game;
    if (Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), { type: 5, x: game.input.mousePointer.x, y: game.input.mousePointer.y, width: 1, height: 1 })) {
        gameObject.setTint(0x00ff00);
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