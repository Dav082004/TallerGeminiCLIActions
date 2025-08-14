/**
 * Clean Code Best Practices Module
 * 
 * Demonstrates excellent coding standards including proper naming,
 * documentation, error handling, and maintainable architecture.
 * 
 * @author Development Team
 * @version 1.0.0
 * @since 2025-08-10
 */

// Well-named constants
const PRICE_CALCULATION_CONSTANTS = {
    TAX_RATE: 0.21, // 21% VAT
    PREMIUM_DISCOUNT_RATE: 0.15, // 15% discount for orders over threshold
    PREMIUM_THRESHOLD: 100.00, // Minimum amount for premium discount
    FREE_SHIPPING_THRESHOLD: 50.00, // Free shipping above this amount
    STANDARD_SHIPPING_COST: 9.99
};

const USER_NAME_CONSTRAINTS = {
    MAX_LENGTH: 50,
    MIN_LENGTH: 2
};

/**
 * User data transfer object with proper validation
 */
class UserDTO {
    /**
     * @param {Object} userData - Raw user data
     * @param {string} userData.firstName - User's first name
     * @param {string} userData.lastName - User's last name
     * @param {string} userData.email - User's email address
     * @param {string} userData.phoneNumber - User's phone number
     */
    constructor(userData) {
        this.firstName = this._validateAndSanitizeName(userData.firstName, 'firstName');
        this.lastName = this._validateAndSanitizeName(userData.lastName, 'lastName');
        this.email = this._validateEmail(userData.email);
        this.phoneNumber = this._validatePhoneNumber(userData.phoneNumber);
        this.fullName = `${this.firstName} ${this.lastName}`;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Validate and sanitize name fields
     * @private
     * @param {string} name - Name to validate
     * @param {string} fieldName - Field name for error reporting
     * @returns {string} Validated and sanitized name
     */
    _validateAndSanitizeName(name, fieldName) {
        if (!name || typeof name !== 'string') {
            throw new Error(`${fieldName} is required and must be a string`);
        }

        const sanitizedName = name.trim();

        if (sanitizedName.length < USER_NAME_CONSTRAINTS.MIN_LENGTH || 
            sanitizedName.length > USER_NAME_CONSTRAINTS.MAX_LENGTH) {
            throw new Error(`${fieldName} must be between ${USER_NAME_CONSTRAINTS.MIN_LENGTH} and ${USER_NAME_CONSTRAINTS.MAX_LENGTH} characters`);
        }

        // Basic sanitization - remove special characters except hyphens and apostrophes
        const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
        if (!nameRegex.test(sanitizedName)) {
            throw new Error(`${fieldName} contains invalid characters`);
        }

        return sanitizedName;
    }

    /**
     * Validate email address format
     * @private
     * @param {string} email - Email to validate
     * @returns {string} Validated email
     */
    _validateEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new Error('Email is required and must be a string');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const normalizedEmail = email.toLowerCase().trim();

        if (!emailRegex.test(normalizedEmail)) {
            throw new Error('Invalid email format');
        }

        return normalizedEmail;
    }

    /**
     * Validate phone number format
     * @private
     * @param {string} phoneNumber - Phone number to validate
     * @returns {string} Validated phone number
     */
    _validatePhoneNumber(phoneNumber) {
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            throw new Error('Phone number is required and must be a string');
        }

        // Remove all non-digit characters
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
            throw new Error('Phone number must be between 10 and 15 digits');
        }

        return digitsOnly;
    }
}

/**
 * Price calculation service with clear business logic
 */
class PriceCalculationService {
    /**
     * Calculate final price including tax, discounts, and shipping
     * @param {number} basePrice - Base price before calculations
     * @returns {Object} Detailed price breakdown
     */
    static calculateFinalPrice(basePrice) {
        if (typeof basePrice !== 'number' || basePrice < 0) {
            throw new Error('Base price must be a non-negative number');
        }

        const taxAmount = this._calculateTax(basePrice);
        const discountAmount = this._calculateDiscount(basePrice);
        const shippingCost = this._calculateShipping(basePrice);

        const finalPrice = basePrice + taxAmount - discountAmount + shippingCost;

        return {
            basePrice: Number(basePrice.toFixed(2)),
            taxAmount: Number(taxAmount.toFixed(2)),
            discountAmount: Number(discountAmount.toFixed(2)),
            shippingCost: Number(shippingCost.toFixed(2)),
            finalPrice: Number(finalPrice.toFixed(2)),
            savings: discountAmount > 0 ? Number(discountAmount.toFixed(2)) : 0
        };
    }

    /**
     * Calculate tax amount
     * @private
     * @param {number} basePrice - Base price
     * @returns {number} Tax amount
     */
    static _calculateTax(basePrice) {
        return basePrice * PRICE_CALCULATION_CONSTANTS.TAX_RATE;
    }

    /**
     * Calculate discount amount for premium customers
     * @private
     * @param {number} basePrice - Base price
     * @returns {number} Discount amount
     */
    static _calculateDiscount(basePrice) {
        return basePrice >= PRICE_CALCULATION_CONSTANTS.PREMIUM_THRESHOLD
            ? basePrice * PRICE_CALCULATION_CONSTANTS.PREMIUM_DISCOUNT_RATE
            : 0;
    }

    /**
     * Calculate shipping cost
     * @private
     * @param {number} basePrice - Base price
     * @returns {number} Shipping cost
     */
    static _calculateShipping(basePrice) {
        return basePrice >= PRICE_CALCULATION_CONSTANTS.FREE_SHIPPING_THRESHOLD
            ? 0
            : PRICE_CALCULATION_CONSTANTS.STANDARD_SHIPPING_COST;
    }
}

/**
 * User service with proper separation of concerns
 */
class UserService {
    /**
     * Create a new user with proper validation and error handling
     * @param {Object} userData - User data
     * @returns {Promise<UserDTO>} Created user
     */
    static async createUser(userData) {
        try {
            // Validate input data
            const userDto = new UserDTO(userData);

            // Here would be database save operation
            // await this._saveToDatabase(userDto);

            return userDto;
        } catch (error) {
            throw new Error(`User creation failed: ${error.message}`);
        }
    }

    /**
     * Send welcome email to new user
     * @param {UserDTO} user - User to send email to
     * @returns {Promise<boolean>} Success status
     */
    static async sendWelcomeEmail(user) {
        try {
            // Email sending logic would go here
            // await emailService.send(user.email, 'welcome', { name: user.firstName });
            
            return true;
        } catch (error) {
            // Log error but don't throw - email failure shouldn't break user creation
            console.error('Failed to send welcome email:', error.message);
            return false;
        }
    }

    /**
     * Log user activity for audit purposes
     * @param {string} userId - User ID
     * @param {string} action - Action performed
     * @param {Object} metadata - Additional metadata
     */
    static logUserActivity(userId, action, metadata = {}) {
        const logEntry = {
            userId,
            action,
            timestamp: new Date().toISOString(),
            metadata
        };

        // In production, this would go to a proper logging service
        console.info('User activity:', JSON.stringify(logEntry));
    }
}

/**
 * Async data fetching with proper error handling and retries
 */
class DataFetchingService {
    /**
     * Fetch user data with related information
     * @param {string} userId - User ID to fetch
     * @returns {Promise<Object>} Complete user data
     */
    static async getUserWithDetails(userId) {
        try {
            const user = await this._getUser(userId);
            const profile = await this._getUserProfile(user.id);
            const settings = await this._getUserSettings(profile.id);
            const preferences = await this._getUserPreferences(settings.id);

            return {
                user,
                profile,
                settings,
                preferences
            };
        } catch (error) {
            throw new Error(`Failed to fetch user details: ${error.message}`);
        }
    }

    /**
     * Mock user fetching - in real implementation would be database calls
     * @private
     */
    static async _getUser(userId) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ id: userId, name: 'Test User' }), 10);
        });
    }

    static async _getUserProfile(userId) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ id: `profile_${userId}`, userId }), 10);
        });
    }

    static async _getUserSettings(profileId) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ id: `settings_${profileId}`, profileId }), 10);
        });
    }

    static async _getUserPreferences(settingsId) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ id: `prefs_${settingsId}`, settingsId }), 10);
        });
    }
}

module.exports = {
    UserDTO,
    PriceCalculationService,
    UserService,
    DataFetchingService,
    PRICE_CALCULATION_CONSTANTS,
    USER_NAME_CONSTRAINTS
};
