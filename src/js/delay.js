// delay.js

// Función que retorna una promesa para simular una espera
export function waitForDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
