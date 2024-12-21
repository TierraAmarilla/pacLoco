const log = document.getElementById('log');
const mazeDisplay = document.getElementById('mazeDisplay');

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

let ball;
let maze = [];

function preload() {
    this.load.text('maze', 'laberinto.txt');
}

function create() {
    const mazeText = this.cache.text.get('maze');
    log.innerHTML += 'Maze data:<br>' + mazeText.replace(/\n/g, '<br>') + '<br>'; // Depuración
    mazeDisplay.innerHTML = 'Maze data:<br>' + mazeText.replace(/\n/g, '<br>') + '<br>'; // Visualización del laberinto
    const lines = mazeText.split('\n');
    lines.forEach(line => {
        maze.push(line.split(''));
    });
    log.innerHTML += 'Maze array:<br>' + JSON.stringify(maze) + '<br>'; // Depuración

    // Dibujar el laberinto
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === '#') {
                this.add.rectangle(col * 20, row * 20, 20, 20, 0x0000ff).setOrigin(0);
            }
        }
    }

    // Crear la pelota
    ball = this.add.circle(400, 300, 10, 0xff0000);
    this.physics.add.existing(ball);
    ball.body.setBounce(1); // Hacer que la pelota rebote
    ball.body.setCollideWorldBounds(true); // Hacer que la pelota colisione con los límites del mundo

    // Añadir velocidad inicial a la pelota
    ball.body.setVelocity(200, 200);
}

function update() {
    // No necesitamos actualizar nada en este ejemplo
}

