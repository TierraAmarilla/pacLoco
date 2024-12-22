const log = document.getElementById('log');
const mazeEditorCanvas = document.getElementById('mazeEditorCanvas');
const saveButton = document.getElementById('saveButton');
const mazeNameInput = document.getElementById('mazeName');
const ctx = mazeEditorCanvas.getContext('2d');

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
let editorMaze = [];

function preload() {
    this.load.text('maze', 'laberinto.txt');
}

function create() {
    const mazeText = this.cache.text.get('maze');
    if (mazeText) {
        log.innerHTML += 'Maze data:<br>' + mazeText.replace(/\n/g, '<br>') + '<br>'; // Depuración
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

    // Inicializar el editor de laberinto
    initializeEditor();
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

function initializeEditor() {
    // Inicializar el canvas del editor
    ctx.clearRect(0, 0, mazeEditorCanvas.width, mazeEditorCanvas.height);
    ctx.fillStyle = '#0000ff';

    // Dibujar el laberinto en el editor
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === '#') {
                ctx.fillRect(col * 40, row * 40, 40, 40);
            }
        }
    }

    // Inicializar la matriz del editor
    editorMaze = maze.map(row => row.slice());

    // Añadir eventos de dibujo
    mazeEditorCanvas.addEventListener('mousedown', startDrawing);
    mazeEditorCanvas.addEventListener('mousemove', draw);
    mazeEditorCanvas.addEventListener('mouseup', stopDrawing);
    mazeEditorCanvas.addEventListener('mouseout', stopDrawing);
}

let isDrawing = false;

function startDrawing(event) {
    isDrawing = true;
    draw(event);
}

function draw(event) {
    if (!isDrawing) return;

    const rect = mazeEditorCanvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 40);
    const y = Math.floor((event.clientY - rect.top) / 40);

    if (x >= 0 && x < editorMaze[0].length && y >= 0 && y < editorMaze.length) {
        if (editorMaze[y][x] === '#') {
            editorMaze[y][x] = '.';
            ctx.clearRect(x * 40, y * 40, 40, 40);
        } else {
            editorMaze[y][x] = '#';
            ctx.fillRect(x * 40, y * 40, 40, 40);
        }
    }
}

function stopDrawing() {
    isDrawing = false;
}

saveButton.addEventListener('click', () => {
    const newMazeText = editorMaze.map(row => row.join('')).join('\n');
    const mazeName = mazeNameInput.value;

    if (mazeName) {
        // Guardar el laberinto en el servidor (aquí puedes implementar la lógica de guardado)
        console.log('Guardando laberinto con nombre:', mazeName);
        console.log('Contenido del laberinto:', newMazeText);

        // Limpiar el canvas del juego
        game.scene.scenes[0].children.list.forEach(child => {
            if (child.type === 'Rectangle') {
                child.destroy();
            }
        });

        // Dibujar el nuevo laberinto en el juego
        maze = editorMaze.map(row => row.slice());
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === '#') {
                    game.scene.scenes[0].add.rectangle(col * 40, row * 40, 40, 40, 0x0000ff).setOrigin(0);
                }
            }
        }
    } else {
        alert('Por favor, ingresa un nombre para el laberinto.');
    }
});
