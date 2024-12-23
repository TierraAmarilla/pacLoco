class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = getSizeByPosition(y, 40, 80);
        this.speed = 0;
        this.health = game.enemyHealth; // Salud del enemigo
        this.targetX = game.width;
        this.type = type;

        switch (this.type) {
            case 'A':
                this.speed = getRandomInt(3, 5);
                this.targetY = game.towers.reduce((max, tower) => (max.health > tower.health ? max : tower)).y;
                break;
            case 'B':
                this.speed = getRandomInt(2, 4);
                this.targetY = this.findFarthestPath();
                break;
            case 'C':
                this.speed = getRandomInt(2, 4);
                this.targetY = this.sinusoidalPath();
                break;
            case 'D':
                this.speed = getRandomInt(1, 2);
                this.health = 100;
                this.targetY = Math.random() * game.height;
                break;
            case 'E':
                this.speed = getRandomInt(2, 4);
                this.targetY = this.customPath();
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

    sinusoidalPath() {
        return (game.height / 2) + (game.height / 4) * Math.sin((this.x / game.width) * (2 * Math.PI));
    }

    customPath() {
        // Implementa tu lógica personalizada aquí
        return Math.random() * game.height;
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.hypot(dx, dy);
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;

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
