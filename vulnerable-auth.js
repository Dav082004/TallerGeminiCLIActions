// ⚠️ ARCHIVO CON VULNERABILIDADES INTENCIONADAS PARA DEMO

const express = require('express');
const app = express();

// 🔴 CRÍTICO: Credenciales hardcodeadas
const ADMIN_PASSWORD = "admin123"; 
const SECRET_KEY = "my-super-secret-key-2024";
const DATABASE_URL = "mongodb://admin:password@localhost:27017/myapp";

// 🔴 CRÍTICO: SQL Injection vulnerable
function getUserData(userId) {
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return database.query(query); // Vulnerable a SQL injection
}

// 🔴 CRÍTICO: XSS vulnerable
app.get('/profile', (req, res) => {
    const username = req.query.name;
    res.send(`<h1>Bienvenido ${username}</h1>`); // XSS directo
});

// 🟠 ALTO: Sin validación de entrada
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Sin sanitización ni validación
    if (password === ADMIN_PASSWORD) {
        res.json({ 
            token: SECRET_KEY, // 🔴 Enviando secreto directamente
            isAdmin: true,
            dbUrl: DATABASE_URL // 🔴 Exponiendo credenciales de DB
        });
    }
});

// 🟠 ALTO: eval() es peligroso
app.post('/calculate', (req, res) => {
    const expression = req.body.calc;
    const result = eval(expression); // 🔴 Code injection
    res.json({ result });
});

// 🟡 MEDIO: Sin rate limiting ni timeouts
app.get('/expensive-operation', async (req, res) => {
    const iterations = req.query.count || 1000000;
    
    // Operación costosa sin límites
    let result = 0;
    for (let i = 0; i < iterations; i++) {
        result += Math.random() * Math.sqrt(i);
    }
    
    res.json({ result });
});

// 🔴 CRÍTICO: Logging de datos sensibles
function logActivity(user, action) {
    console.log(`User: ${user.email}, Password: ${user.password}, Action: ${action}`);
    // Loggeando contraseñas en texto plano
}

// 🟠 ALTO: Sin HTTPS enforcement
app.listen(3000, () => {
    console.log('Server running on HTTP (not HTTPS!)');
});

module.exports = app;
