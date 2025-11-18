const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    backgroundColor: "#000000",
    parent: "game",
    physics: {
        default: "arcade",
        arcade: { debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, cursors, walls, exitTile;

const tileSize = 40;

// 0 = path, 1 = wall, 2 = exit
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,],
    [1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,],
    [1,0,1,0,0,0,0,1,0,0,0,1,0,0,1,],
    [1,0,1,1,1,1,0,1,1,1,0,1,0,1,1,],
    [1,0,0,0,0,1,0,0,0,1,0,1,0,0,1,],
    [1,1,1,1,0,1,1,1,0,1,0,1,1,0,1,],
    [1,0,0,1,0,0,0,1,0,1,0,0,0,0,1,],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,2,1,], // 2 = Exit
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
];

function preload() {}

function create() {
    walls = this.physics.add.staticGroup();

    // Generate maze
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {

            if (maze[y][x] === 1) {
                // Tembok warna cyan
                let wall = this.add.rectangle(
                    x * tileSize,
                    y * tileSize,
                    tileSize,
                    tileSize,
                    0x00ffff
                ).setOrigin(0);

                walls.add(wall);
            }

            if (maze[y][x] === 2) {
                // Exit warna magenta
                exitTile = this.add.rectangle(
                    x * tileSize,
                    y * tileSize,
                    tileSize,
                    tileSize,
                    0xff00ff
                ).setOrigin(0);
            }
        }
    }

    // Player
    player = this.physics.add.rectangle(tileSize * 1.5, tileSize * 1.5, 25, 25, 0xffffff);
    this.physics.add.existing(player);

    // Collision
    this.physics.add.collider(player, walls);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    const speed = 160;
    player.body.setVelocity(0);

    if (cursors.left.isDown) player.body.setVelocityX(-speed);
    else if (cursors.right.isDown) player.body.setVelocityX(speed);

    if (cursors.up.isDown) player.body.setVelocityY(-speed);
    else if (cursors.down.isDown) player.body.setVelocityY(speed);

    // Cek finish
    if (checkOverlap(player, exitTile)) {
        alert("Level Complete! 🎉");
        location.reload();
    }
}

function checkOverlap(a, b) {
    if (!b) return false;

    let A = a.getBounds();
    let B = b.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(A, B);
}
