var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    width: 1024,
    height: 1024,
    scene: {
        preload: preload,
        create: create
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};

function preload ()
{
    this.load.image('eye', 'http://labs.phaser.io/assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    var image = this.add.sprite(200, 300, 'eye').setInteractive();

    image.on('pointerover', function () {

        this.setTint(0x00ff00);

    });

    image.on('pointerout', function () {

        this.clearTint();

    });

    this.input.setDraggable(image);

    this.input.on('dragstart', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;
        socket.emit("gameUpdate", {dragX, dragY});

    });

    this.input.on('dragend', function (pointer, gameObject) {

        gameObject.clearTint();

    });
    
  socket.on("gameUpdate", ({dragX, dragY}) =>  {
    image.x = dragX;
    image.y = dragY;
    console.log("gameUpdate");
  })
}