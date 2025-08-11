/**
 * User Authentication Service
 * 
 * Provides secure authentication functionality with proper validation,
 * error handling, and security best practices.
 * 
 * @author Development Team
 * @version 1.0.0
 * @since 2025-08-10
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

// Security constants - properly externalized
const {
    JWT_SECRET,
    JWT_EXPIRATION,
    BCRYPT_ROUNDS,
    MAX_LOGIN_ATTEMPTS
} = process.env;

/**
 * Rate limiting configuration for login attempts
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: MAX_LOGIN_ATTEMPTS || 5,
    message: {
        error: 'Too many login attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Authentication service class with comprehensive security measures
 */
class AuthenticationService {
    /**
     * Hash password using bcrypt with proper salt rounds
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Hashed password
     * @throws {Error} If password validation fails
     */
    static async hashPassword(password) {
        if (!password || typeof password !== 'string') {
            throw new Error('Password must be a non-empty string');
        }

        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const saltRounds = parseInt(BCRYPT_ROUNDS) || 12;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Verify password against hash
     * @param {string} password - Plain text password
     * @param {string} hash - Hashed password
     * @returns {Promise<boolean>} Verification result
     */
    static async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            throw new Error('Password verification failed');
        }
    }

    /**
     * Generate JWT token with proper expiration and payload
     * @param {Object} user - User object
     * @param {string} user.id - User ID
     * @param {string} user.email - User email
     * @param {string} user.role - User role
     * @returns {string} JWT token
     */
    static generateToken(user) {
        if (!user || !user.id || !user.email) {
            throw new Error('Invalid user data for token generation');
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role || 'user',
            iat: Math.floor(Date.now() / 1000)
        };

        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION || '24h',
            issuer: 'TallerGeminiCLI',
            audience: 'app-users'
        });
    }

    /**
     * Validate user input with comprehensive checks
     * @param {Object} userData - User data to validate
     * @returns {Object} Validation result
     */
    static validateUserInput(userData) {
        const errors = [];

        if (!userData.email || !validator.isEmail(userData.email)) {
            errors.push('Valid email address is required');
        }

        if (!userData.password || userData.password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }

        if (userData.password && !this.isStrongPassword(userData.password)) {
            errors.push('Password must contain uppercase, lowercase, number and special character');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if password meets strength requirements
     * @param {string} password - Password to check
     * @returns {boolean} Whether password is strong
     */
    static isStrongPassword(password) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        return strongPasswordRegex.test(password);
    }
}

/**
 * Secure authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Access token is required',
            code: 'MISSING_TOKEN'
        });
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) {
            const errorCode = error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
            return res.status(403).json({
                error: 'Invalid or expired token',
                code: errorCode
            });
        }

        req.user = user;
        next();
    });
};

module.exports = {
    AuthenticationService,
    authenticateToken,
    loginLimiter
};
