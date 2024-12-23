class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = getEnemySizeByPosition(y); // Tamaño proporcional a la coordenada Y
        this.speed = 0;
        this.health = 0;
        this.targetX = game.width;
        this.targetY = 0;
        this.type = type;
        this.initialTargetX = 0;
        this.initialTargetY = 0;
        this.reachedTarget = false;

        switch (this.type) {
            case 'A':
                this.speed = game.enemySpeedMax;
                this.health = 5;
                this.targetY = this.findClosestTowerPath();
                break;
            case 'B':
                this.speed = getRandomInt(2, 4);
                this.health = 15;
                this.targetY = this.findFarthestPath();
                this.initialTargetX = this.targetX;
                this.initialTargetY = this.targetY;
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
                const maxHealthTower = game.towers.reduce((max, tower) => (max.health > tower.health ? max : tower), { health: 0 });
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

    findClosestTowerPath() {
        let minDistance = Infinity;
        let closestY = 0;
        game.towers.forEach(tower => {
            const distance = Math.hypot(this.x - tower.x, this.y - tower.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestY = tower.y;
            }
        });
        return closestY;
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

        // Verificar si el enemigo ha llegado a la torre
        if (this.type === 'A' || this.type === 'D') {
            game.towers.forEach(tower => {
                const towerDistance = Math.hypot(this.x - tower.x, this.y - tower.y);
                if (towerDistance < tower.size / 2 + this.size / 2) {
                    this.reachedTarget = true;
                }
            });
        }

        // Cambiar de dirección cada 30% de las coordenadas x para la clase B
        if (this.type === 'B' && this.x % (game.width * 0.3) === 0 && !this.reachedTarget) {
            this.targetX = this.initialTargetX;
            this.targetY = this.initialTargetY;
        }
    }

    draw() {
        ctx.drawImage(enemyImage, this.x, this.y - this.size / 2, this.size, this.size);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial'; // Ajusta el tamaño de la letra
        ctx.fillText(this.health, this.x + this.size / 2 - 10, this.y - 10);
    }
}
