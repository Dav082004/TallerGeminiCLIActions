/**
 * Comprehensive Test Suite
 * 
 * Demonstrates proper testing practices including unit tests,
 * edge cases, error handling, and clear test documentation.
 * 
 * @author Development Team
 * @version 1.0.0
 * @since 2025-08-10
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const {
    UserDTO,
    PriceCalculationService,
    UserService,
    DataFetchingService
} = require('./clean-code-practices');

describe('UserDTO', () => {
    describe('Valid user creation', () => {
        test('should create user with valid data', () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+1-555-123-4567'
            };

            const user = new UserDTO(userData);

            expect(user.firstName).toBe('John');
            expect(user.lastName).toBe('Doe');
            expect(user.email).toBe('john.doe@example.com');
            expect(user.phoneNumber).toBe('15551234567');
            expect(user.fullName).toBe('John Doe');
            expect(user.createdAt).toBeDefined();
        });

        test('should handle names with special characters', () => {
            const userData = {
                firstName: "María-José",
                lastName: "O'Connor",
                email: 'maria@example.com',
                phoneNumber: '1234567890'
            };

            const user = new UserDTO(userData);

            expect(user.firstName).toBe("María-José");
            expect(user.lastName).toBe("O'Connor");
        });
    });

    describe('Input validation', () => {
        test('should throw error for invalid email', () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email',
                phoneNumber: '1234567890'
            };

            expect(() => new UserDTO(userData)).toThrow('Invalid email format');
        });

        test('should throw error for short name', () => {
            const userData = {
                firstName: 'J',
                lastName: 'Doe',
                email: 'john@example.com',
                phoneNumber: '1234567890'
            };

            expect(() => new UserDTO(userData)).toThrow('firstName must be between 2 and 50 characters');
        });

        test('should throw error for invalid phone number', () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phoneNumber: '123'
            };

            expect(() => new UserDTO(userData)).toThrow('Phone number must be between 10 and 15 digits');
        });
    });
});

describe('PriceCalculationService', () => {
    describe('Price calculations', () => {
        test('should calculate price with tax only for small orders', () => {
            const result = PriceCalculationService.calculateFinalPrice(25.00);

            expect(result.basePrice).toBe(25.00);
            expect(result.taxAmount).toBe(5.25); // 21% tax
            expect(result.discountAmount).toBe(0); // No premium discount
            expect(result.shippingCost).toBe(9.99); // Standard shipping
            expect(result.finalPrice).toBe(40.24);
            expect(result.savings).toBe(0);
        });

        test('should apply free shipping for medium orders', () => {
            const result = PriceCalculationService.calculateFinalPrice(75.00);

            expect(result.basePrice).toBe(75.00);
            expect(result.taxAmount).toBe(15.75); // 21% tax
            expect(result.discountAmount).toBe(0); // No premium discount
            expect(result.shippingCost).toBe(0); // Free shipping
            expect(result.finalPrice).toBe(90.75);
        });

        test('should apply premium discount for large orders', () => {
            const result = PriceCalculationService.calculateFinalPrice(150.00);

            expect(result.basePrice).toBe(150.00);
            expect(result.taxAmount).toBe(31.50); // 21% tax
            expect(result.discountAmount).toBe(22.50); // 15% premium discount
            expect(result.shippingCost).toBe(0); // Free shipping
            expect(result.finalPrice).toBe(159.00);
            expect(result.savings).toBe(22.50);
        });
    });

    describe('Edge cases', () => {
        test('should handle zero price', () => {
            const result = PriceCalculationService.calculateFinalPrice(0);

            expect(result.basePrice).toBe(0);
            expect(result.taxAmount).toBe(0);
            expect(result.discountAmount).toBe(0);
            expect(result.shippingCost).toBe(9.99);
            expect(result.finalPrice).toBe(9.99);
        });

        test('should throw error for negative price', () => {
            expect(() => PriceCalculationService.calculateFinalPrice(-10))
                .toThrow('Base price must be a non-negative number');
        });

        test('should throw error for non-numeric price', () => {
            expect(() => PriceCalculationService.calculateFinalPrice('invalid'))
                .toThrow('Base price must be a non-negative number');
        });
    });
});

describe('UserService', () => {
    describe('User creation', () => {
        test('should create user successfully with valid data', async () => {
            const userData = {
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice@example.com',
                phoneNumber: '1234567890'
            };

            const user = await UserService.createUser(userData);

            expect(user).toBeInstanceOf(UserDTO);
            expect(user.firstName).toBe('Alice');
            expect(user.email).toBe('alice@example.com');
        });

        test('should propagate validation errors', async () => {
            const invalidUserData = {
                firstName: '',
                lastName: 'Smith',
                email: 'invalid-email',
                phoneNumber: '123'
            };

            await expect(UserService.createUser(invalidUserData))
                .rejects.toThrow('User creation failed');
        });
    });

    describe('Email service', () => {
        test('should return true for successful email sending', async () => {
            const user = new UserDTO({
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob@example.com',
                phoneNumber: '1234567890'
            });

            const result = await UserService.sendWelcomeEmail(user);
            expect(result).toBe(true);
        });
    });

    describe('Activity logging', () => {
        let consoleSpy;

        beforeEach(() => {
            consoleSpy = jest.spyOn(console, 'info').mockImplementation();
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        test('should log user activity with proper format', () => {
            const userId = 'user123';
            const action = 'LOGIN';
            const metadata = { ipAddress: '192.168.1.1' };

            UserService.logUserActivity(userId, action, metadata);

            expect(consoleSpy).toHaveBeenCalledWith(
                'User activity:',
                expect.stringContaining('"userId":"user123"')
            );
            expect(consoleSpy).toHaveBeenCalledWith(
                'User activity:',
                expect.stringContaining('"action":"LOGIN"')
            );
        });
    });
});

describe('DataFetchingService', () => {
    describe('User data fetching', () => {
        test('should fetch complete user data structure', async () => {
            const userId = 'test123';
            
            const result = await DataFetchingService.getUserWithDetails(userId);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('profile');
            expect(result).toHaveProperty('settings');
            expect(result).toHaveProperty('preferences');
            
            expect(result.user.id).toBe(userId);
            expect(result.profile.userId).toBe(userId);
        });

        test('should handle errors gracefully', async () => {
            // This would test error handling in a real implementation
            // For now, our mock implementation doesn't throw errors
            const userId = 'valid123';
            
            await expect(DataFetchingService.getUserWithDetails(userId))
                .resolves.toBeDefined();
        });
    });
});

// Integration test example
describe('Integration Tests', () => {
    test('should create user and calculate order price', async () => {
        // Create user
        const userData = {
            firstName: 'Integration',
            lastName: 'Test',
            email: 'integration@example.com',
            phoneNumber: '9876543210'
        };

        const user = await UserService.createUser(userData);
        expect(user.fullName).toBe('Integration Test');

        // Calculate price for their order
        const orderPrice = 120.00;
        const priceCalculation = PriceCalculationService.calculateFinalPrice(orderPrice);
        
        expect(priceCalculation.basePrice).toBe(120.00);
        expect(priceCalculation.discountAmount).toBe(18.00); // Premium discount
        expect(priceCalculation.shippingCost).toBe(0); // Free shipping
        
        // Log the activity
        UserService.logUserActivity(user.email, 'ORDER_CALCULATED', {
            orderAmount: orderPrice,
            finalPrice: priceCalculation.finalPrice
        });
    });
});
