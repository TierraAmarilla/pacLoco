class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = getSizeByPosition(y, 80, 200); // Ajustar el tamaño de las torres para que las diferencias sean más notables
        this.damage = 1;
        this.health = game.towerHealth; // Salud de la torre
    }

    get range() {
        return this.health * 2 + 120; // Rango proporcional a la vida restante más 120
    }

    draw() {
        ctx.drawImage(towerImage, this.x, this.y - this.size / 2, this.size, this.size);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial'; // Ajusta el tamaño de la letra
        ctx.fillText(this.health, this.x + this.size / 2 - 10, this.y - 10);

        // Dibujar el rango de acción
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y, this.range, 0, Math.PI * 2);
        ctx.strokeStyle = 'teal'; // Color del rango de acción
        ctx.stroke();
    }

    attack(enemies) {
        enemies.forEach(enemy => {
            const distance = Math.hypot(this.x + this.size / 2 - enemy.x, this.y - enemy.y);
            if (distance < this.range) {
                enemy.health -= this.damage;
                this.health -= 0.5; // La torre también pierde vida al atacar
                if (enemy.health <= 0) {
                    const index = enemies.indexOf(enemy);
                    if (index > -1) {
                        enemies.splice(index, 1);
                        game.enemiesNeutralized++; // Incrementar el contador de enemigos neutralizados
                        enemiesNeutralizedElement.textContent = game.enemiesNeutralized;
                        if (game.enemiesNeutralized % 50 === 0) {
                            game.maxTowers += 1;
                        }
                    }
                }
                if (this.health <= 0) {
                    const index = game.towers.indexOf(this);
                    if (index > -1) {
                        game.towers.splice(index, 1);
                    }
                }
            }
        });
    }
}
