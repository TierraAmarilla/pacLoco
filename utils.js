// Función para ajustar el tamaño según la posición en el eje y
function getSizeByPosition(y, minSize, maxSize) {
    const scale = (y / game.height);
    return Math.floor(minSize + (maxSize - minSize) * scale);
}

// Función para obtener un número aleatorio entre min y max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
