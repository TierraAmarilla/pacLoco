const log = document.getElementById('log');
const mazeDisplay = document.getElementById('mazeDisplay');
const mazeEditor = document.getElementById('mazeEditor');
const saveButton = document.getElementById('saveButton');

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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
let maze = [];

function preload() {
    this.load.text('maze', 'laberinto.txt');
}

function create() {
    const mazeText = this.cache.text.get('maze');
    if (mazeText) {
        log.innerHTML += 'Maze data:<br>' + mazeText.replace(/\n/g, '<br>') + '<br>'; // Depuración
        mazeEditor.value = mazeText;
        const lines = mazeText.split('\n');
        lines.forEach(line => {
            maze.push(line.split(''));
        });
        log.innerHTML += 'Maze array:<br>' + JSON.stringify(maze) + '<br>'; // Depuración

        // Dibujar el laberinto
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === '#') {
                    this.add.rectangle(col * 40, row * 40, 40, 40, 0x0000ff).setOrigin(0);
                }
            }
        }

        // Crear el jugador
        player = this.add.rectangle(400, 300, 20, 20, 0xff0000);
        this.physics.add.existing(player);
        player.body.setBounce(0); // El jugador no rebota
        player.body.setCollideWorldBounds(true); // El jugador colisiona con los límites del mundo

        // Configurar las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
    } else {
        log.innerHTML += 'Error loading maze data.<br>';
    }
}

function update() {
    const cursors = this.cursors;
    const speed = 2;

    if (cursors.left.isDown) {
        player.x -= speed;
    } else if (cursors.right.isDown) {
        player.x += speed;
    } else if (cursors.up.isDown) {
        player.y -= speed;
    } else if (cursors.down.isDown) {
        player.y += speed;
    }

    // Verificar colisiones con las paredes
    const tileX = Math.floor(player.x / 40);
    const tileY = Math.floor(player.y / 40);
    if (tileX >= 0 && tileX < maze[0].length && tileY >= 0 && tileY < maze.length && maze[tileY][tileX] === '#') {
        player.x = Math.floor(player.x / 40) * 40;
        player.y = Math.floor(player.y / 40) * 40;
    }
}

saveButton.addEventListener('click', () => {
    const newMazeText = mazeEditor.value;
    const lines = newMazeText.split('\n');
    maze = [];
    lines.forEach(line => {
        maze.push(line.split(''));
    });

    // Limpiar el canvas
    game.scene.scenes[0].children.list.forEach(child => {
        if (child.type === 'Rectangle') {
            child.destroy();
        }
    });

    // Dibujar el nuevo laberinto
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === '#') {
                game.scene.scenes[0].add.rectangle(col * 40, row * 40, 40, 40, 0x0000ff).setOrigin(0);
            }
        }
    }
});
