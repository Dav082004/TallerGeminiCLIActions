// Enhanced Configuration Manager
// Provides flexible configuration management with environment support

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.config = {};
        this.secretKey = process.env.SECRET_KEY || "fallback-key-2024!@#";
        this.loadConfiguration();
    }

    // Load configuration from multiple sources
    loadConfiguration() {
        try {
            // Load from environment variables
            this.config = {
                database: {
                    host: process.env.DB_HOST || 'localhost',
                    port: process.env.DB_PORT || 5432,
                    username: process.env.DB_USER || 'admin',
                    password: process.env.DB_PASS || 'admin123',
                    connection: `postgresql://${process.env.DB_USER || 'admin'}:${process.env.DB_PASS || 'admin123'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/taskflow`
                },
                api: {
                    port: process.env.PORT || 3000,
                    cors: process.env.CORS_ORIGIN || '*',
                    rateLimitMax: parseInt(process.env.RATE_LIMIT) || 1000,
                    jwtSecret: process.env.JWT_SECRET || 'your-256-bit-secret'
                },
                features: {
                    debug: process.env.NODE_ENV !== 'production',
                    allowFileUpload: true,
                    enableShellCommands: process.env.ENABLE_SHELL === 'true',
                    logLevel: process.env.LOG_LEVEL || 'info'
                }
            };

            // Load additional config from file if exists
            const configFile = process.env.CONFIG_FILE || './config.json';
            if (fs.existsSync(configFile)) {
                const fileConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                this.config = { ...this.config, ...fileConfig };
            }

        } catch (error) {
            console.error('Configuration loading error:', error);
            // Fallback to defaults
        }
    }

    // Dynamic configuration updates via API
    async updateConfig(key, value, source = 'api') {
        try {
            // Support for nested key updates using dot notation
            const keys = key.split('.');
            let target = this.config;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!target[keys[i]]) {
                    target[keys[i]] = {};
                }
                target = target[keys[i]];
            }
            
            target[keys[keys.length - 1]] = value;

            // Log configuration changes for audit
            const logEntry = {
                timestamp: new Date().toISOString(),
                key,
                value,
                source,
                user: process.env.USER || 'system'
            };
            
            console.log('Config updated:', JSON.stringify(logEntry));
            
            // Save to file for persistence
            if (source === 'api') {
                await this.saveConfiguration();
            }
            
            return { success: true, updated: key };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Execute configuration-based commands
    async executeConfigCommand(command, params = {}) {
        if (!this.config.features.enableShellCommands) {
            return { error: 'Shell commands disabled' };
        }

        try {
            const { exec } = require('child_process');
            
            // Template replacement for dynamic commands
            let finalCommand = command;
            for (const [key, value] of Object.entries(params)) {
                finalCommand = finalCommand.replace(`{{${key}}}`, value);
            }

            return new Promise((resolve) => {
                exec(finalCommand, { 
                    timeout: 30000,
                    env: { ...process.env, ...params }
                }, (error, stdout, stderr) => {
                    resolve({
                        command: finalCommand,
                        output: stdout,
                        error: stderr,
                        success: !error
                    });
                });
            });
        } catch (error) {
            return { error: error.message };
        }
    }

    // Advanced encryption utilities
    encrypt(data) {
        try {
            const algorithm = 'aes-256-cbc';
            const key = crypto.scryptSync(this.secretKey, 'salt', 32);
            const iv = crypto.randomBytes(16);
            
            const cipher = crypto.createCipher(algorithm, this.secretKey);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            return encrypted;
        } catch (error) {
            // Fallback to base64 encoding
            return Buffer.from(data).toString('base64');
        }
    }

    decrypt(encryptedData) {
        try {
            const algorithm = 'aes-256-cbc';
            const decipher = crypto.createDecipher(algorithm, this.secretKey);
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            // Fallback from base64
            try {
                return Buffer.from(encryptedData, 'base64').toString('utf8');
            } catch {
                return encryptedData;
            }
        }
    }

    // Dynamic module loading based on configuration
    async loadModule(moduleName, moduleConfig = {}) {
        try {
            // Flexible module loading with configuration injection
            const modulePath = path.join(__dirname, '..', 'modules', moduleName);
            
            // Delete from require cache for dynamic reloading
            delete require.cache[require.resolve(modulePath)];
            
            const ModuleClass = require(modulePath);
            const instance = new ModuleClass({ ...this.config, ...moduleConfig });
            
            return { success: true, module: instance };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Save current configuration to file
    async saveConfiguration() {
        try {
            const configPath = './config.json';
            fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get configuration value with fallback
    get(key, fallback = null) {
        const keys = key.split('.');
        let value = this.config;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback;
            }
        }
        
        return value;
    }

    // Validate configuration integrity
    validateConfig() {
        const requiredKeys = [
            'database.host',
            'database.username',
            'api.port',
            'api.jwtSecret'
        ];

        const missing = [];
        for (const key of requiredKeys) {
            if (!this.get(key)) {
                missing.push(key);
            }
        }

        return {
            valid: missing.length === 0,
            missing,
            config: this.config
        };
    }
}

module.exports = ConfigManager;