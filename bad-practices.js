// ⚠️ CÓDIGO CON MALAS PRÁCTICAS Y PROBLEMAS DE MANTENIBILIDAD

var globalVar = "No usar var en 2024"; // 🟡 var en lugar de const/let

// 🟠 Sin jsdoc ni tipos
function mysteriousFunction(a, b, c, d, e) {
    // 🔴 Función demasiado compleja - alta complejidad ciclomática
    if (a > 10) {
        if (b === "test") {
            if (c !== null) {
                if (d.length > 5) {
                    if (e === true) {
                        return a + b + c + d + e;
                    } else {
                        return a - b;
                    }
                } else {
                    return c * d;
                }
            } else {
                return b + d;
            }
        } else {
            return a / 2;
        }
    } else {
        return 0;
    }
}

// 🟠 ALTO: Nombres de variables confusos
const x = 42;
const data = "not really data";
const flag = true;
const temp = {
    a: 1,
    b: 2,
    thing: "stuff"
};

// 🔴 CRÍTICO: Magic numbers por todas partes
function calculatePrice(basePrice) {
    const tax = basePrice * 0.21; // ¿Qué es 0.21?
    const discount = basePrice > 100 ? basePrice * 0.15 : 0; // ¿Y 0.15?
    const shipping = basePrice > 50 ? 0 : 9.99; // ¿Y 9.99?
    
    return basePrice + tax - discount + shipping;
}

// 🟡 MEDIO: Código comentado (dead code)
function processUser(user) {
    // const oldWay = user.name + user.surname;
    // if (oldWay.length > 20) {
    //     return oldWay.substring(0, 20);
    // }
    
    return `${user.name} ${user.surname}`;
    
    // TODO: Implementar validación
    // FIXME: Este código no funciona bien
    // HACK: Temporal hasta la v2.0
}

// 🔴 CRÍTICO: Sin manejo de errores
function parseJson(jsonString) {
    return JSON.parse(jsonString); // Puede explotar
}

// 🟠 ALTO: Función que hace demasiadas cosas
function saveUserAndSendEmailAndLogActivity(userData) {
    // Guardar usuario
    const user = createUser(userData);
    saveToDatabase(user);
    
    // Enviar email
    const emailTemplate = loadEmailTemplate();
    const personalizedEmail = personalizeEmail(emailTemplate, user);
    sendEmail(user.email, personalizedEmail);
    
    // Log actividad
    logActivity(user.id, 'USER_CREATED');
    
    // Actualizar estadísticas
    updateStats('users_created');
    
    // Notificar a admins
    notifyAdmins('New user registered');
    
    return user;
}

// 🟡 MEDIO: Console.log en producción
function debugFunction(input) {
    console.log("Input:", input); // No debería estar en producción
    const result = input * 2;
    console.log("Result:", result);
    return result;
}

// 🔴 CRÍTICO: Callback hell
function getData(userId, callback) {
    getUser(userId, (user) => {
        getProfile(user.id, (profile) => {
            getSettings(profile.id, (settings) => {
                getPreferences(settings.id, (preferences) => {
                    callback(null, { user, profile, settings, preferences });
                });
            });
        });
    });
}

module.exports = {
    mysteriousFunction,
    calculatePrice,
    parseJson,
    saveUserAndSendEmailAndLogActivity,
    debugFunction,
    getData
};
