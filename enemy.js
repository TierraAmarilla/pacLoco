class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = getEnemySizeByPosition(y); // Tamaño proporcional a la coordenada Y
        this.speed = 0;
        this.health = 0;
        this.targetX = game.width;
        this.type = type;

        switch (this.type) {
            case 'A':
                this.speed = game.enemySpeedMax;
                this.health = 5;
                this.targetY = this.findFarthestPath();
                break;
            case 'B':
                this.speed = getRandomInt(2, 4);
                this.health = 15;
                this.targetY = this.findFarthestPath();
                break;
            case 'C':
                this.speed = getRandomInt(2, 4);
                this.health = 25;
                this.targetY = this.findFarthestPath();
                break;
            case 'D':
                this.speed = 1;
                this.health = 100;
                this.targetY = this.findFarthestPath();
                const maxHealthTower = game.towers.reduce((max, tower) => (max.health > tower.health ? max : tower));
                this.targetX = maxHealthTower.x;
                this.targetY = maxHealthTower.y;
                break;
            case 'E':
                this.speed = getRandomInt(1, 5);
                this.health = getRandomInt(5, 100);
                this.targetY = Math.random() * game.height;
                break;
            default:
                this.speed = getRandomInt(2, 4);
                this.targetY = Math.random() * game.height;
        }
    }

    findFarthestPath() {
        let maxDistance = 0;
        let farthestY = 0;
        game.towers.forEach(tower => {
            const distance = Math.hypot(this.x - tower.x, this.y - tower.y);
            if (distance > maxDistance) {
                maxDistance = distance;
                farthestY = tower.y;
            }
        });
        return farthestY;
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.hypot(dx, dy);
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;

        // Ajustar el tamaño del enemigo durante el trayecto
        this.size = getEnemySizeByPosition(this.y);

        // Verificar si el enemigo ha llegado a la parte derecha
        if (this.x >= game.width) {
            game.life -= 1; // Descontar vida
            const index = game.enemies.indexOf(this);
            if (index > -1) {
                game.enemies.splice(index, 1);
            }
            if (game.life <= 0) {
                game.life = 0; // Fijar vida a 0
                game.gameOver = true; // Fin del juego
            }
        }
    }

    draw() {
        ctx.drawImage(enemyImage, this.x, this.y - this.size / 2, this.size, this.size);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial'; // Ajusta el tamaño de la letra
        ctx.fillText(this.health, this.x + this.size / 2 - 10, this.y - 10);
    }
}
