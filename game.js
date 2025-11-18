const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#222222',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let layer;

const mapData = [
  // 0 = jalan, 1 = tembok
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,1,1,0,1,0,1,0,1],
  [1,0,0,1,0,0,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

function preload() {
  this.load.image('wall', 'wall.png'); // harap sediakan gambar wall
  this.load.image('player', 'player.png'); // sediakan sprite player
}

function create() {
  const tileSize = 64;

  // Buat tembok dari mapData
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      if (mapData[y][x] === 1) {
        this.add.image(x * tileSize, y * tileSize, 'wall')
          .setOrigin(0);
      }
    }
  }

  // Buat player
  player = this.physics.add.sprite(tileSize + tileSize/2, tileSize + tileSize/2, 'player');
  player.setCollideWorldBounds(true);

  // Collider antara player dan tembok (gunakan grup)
  const walls = this.physics.add.staticGroup();
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      if (mapData[y][x] === 1) {
        walls.create(x * tileSize + tileSize/2, y * tileSize + tileSize/2, 'wall');
      }
    }
  }

  this.physics.add.collider(player, walls);

  // Keyboard
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  const speed = 200;
  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed);
  }
}
