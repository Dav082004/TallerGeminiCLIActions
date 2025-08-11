// ⚠️ CÓDIGO CON PROBLEMAS DE RENDIMIENTO Y MEMORIA

const fs = require('fs');

// 🔴 CRÍTICO: Memory leak intencional
const memoryLeaks = [];
setInterval(() => {
    // Acumula objetos sin limpiar
    memoryLeaks.push(new Array(1000000).fill('leak'));
}, 1000);

// 🟠 ALTO: Operación síncrona que bloquea
function processLargeFile(filepath) {
    try {
        // Lee archivo completo en memoria - problema con archivos grandes
        const data = fs.readFileSync(filepath, 'utf8');
        
        // Operación O(n²) ineficiente
        let processed = '';
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data.length; j++) {
                processed += data[i] + data[j];
            }
        }
        
        return processed;
    } catch (error) {
        // 🟡 Sin logging del error
        return null;
    }
}

// 🔴 CRÍTICO: Recursión infinita sin control
function fibonacci(n) {
    if (n <= 1) return n;
    // Sin memoización - exponencial O(2^n)
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 🟠 ALTO: Operación costosa sin async
function cpuIntensiveTask(iterations = 10000000) {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
        // Operación que bloquea el event loop
        result += Math.pow(Math.random(), Math.sqrt(i));
    }
    return result;
}

// 🟡 MEDIO: Uso ineficiente de DOM (si fuera frontend)
function updateUI() {
    const items = document.querySelectorAll('.item');
    
    // Reflow/repaint en cada iteración
    items.forEach((item, index) => {
        item.style.left = `${index * 100}px`;
        item.style.top = `${index * 50}px`;
        item.style.background = `rgb(${index}, ${index * 2}, ${index * 3})`;
    });
}

// 🔴 CRÍTICO: Buffer overflow potential
function unsafeBufferOperation(input) {
    const buffer = Buffer.alloc(10);
    // Sin validación de tamaño
    buffer.write(input); // Puede causar overflow
    return buffer.toString();
}

// 🟠 ALTO: Promesas sin manejo de errores
async function unreliableFunction() {
    // Sin try/catch
    const data = await fetch('https://unreliable-api.com/data');
    return data.json(); // Puede fallar
}

module.exports = {
    processLargeFile,
    fibonacci,
    cpuIntensiveTask,
    updateUI,
    unsafeBufferOperation,
    unreliableFunction
};
