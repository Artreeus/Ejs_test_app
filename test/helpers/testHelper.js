const mongoose = require('mongoose');
const User = require('../../models/UserModel');
const Product = require('../../models/ProductModel');

const testHelper = {
    /**
     * Clean up test data from database
     */
    async cleanupTestData() {
        try {
            // Delete test users (those with emails containing 'test' and '@example.com')
            await User.deleteMany({ 
                email: { 
                    $regex: /test.*@example\.com/i 
                } 
            });

            // Delete test products (those created during tests)
            await Product.deleteMany({
                name: { 
                    $regex: /test|Test/i 
                }
            });

            console.log('Test data cleanup completed');
        } catch (error) {
            console.error('Error cleaning up test data:', error);
        }
    },

    /**
     * Generate test user data
     * @param {string} suffix - Suffix to make email unique
     * @returns {Object} Test user object
     */
    generateTestUser(suffix = '') {
        return {
            name: `Test User${suffix ? ' ' + suffix : ''}`,
            email: `test${suffix}@example.com`,
            password: 'testpassword123'
        };
    },

    /**
     * Generate test product data
     * @param {string} suffix - Suffix to make product unique
     * @returns {Object} Test product object
     */
    generateTestProduct(suffix = '') {
        return {
            name: `Test Product${suffix ? ' ' + suffix : ''}`,
            price: Math.floor(Math.random() * 1000) + 10 // Random price between 10-1010
        };
    },

    /**
     * Create a test user and return the user object
     * @param {string} suffix - Suffix for unique email
     * @returns {Object} Created user object
     */
    async createTestUser(suffix = '') {
        const userData = this.generateTestUser(suffix);
        const user = new User(userData);
        return await user.save();
    },

    /**
     * Create a test product and return the product object
     * @param {string} suffix - Suffix for unique name
     * @returns {Object} Created product object
     */
    async createTestProduct(suffix = '') {
        const productData = this.generateTestProduct(suffix);
        const product = new Product(productData);
        return await product.save();
    },

    /**
     * Register a user via API and return response
     * @param {Object} app - Express app instance
     * @param {Object} userData - User data to register
     * @returns {Object} API response
     */
    async registerUser(app, userData) {
        const chai = require('chai');
        const chaiHttp = require('chai-http');
        chai.use(chaiHttp);

        return await chai.request(app)
            .post('/api/user/register')
            .send(userData);
    },

    /**
     * Login a user via API and return auth token
     * @param {Object} app - Express app instance
     * @param {Object} loginData - Login credentials
     * @returns {string} Auth token
     */
    async loginUser(app, loginData) {
        const chai = require('chai');
        const chaiHttp = require('chai-http');
        chai.use(chaiHttp);

        const response = await chai.request(app)
            .post('/api/user/login')
            .send(loginData);

        return response.text; // JWT token
    },

    /**
     * Register and login a user, return auth token
     * @param {Object} app - Express app instance
     * @param {string} suffix - Suffix for unique user
     * @returns {string} Auth token
     */
    async createAndLoginUser(app, suffix = '') {
        const userData = this.generateTestUser(suffix);
        
        // Register user
        await this.registerUser(app, userData);
        
        // Login and get token
        return await this.loginUser(app, {
            email: userData.email,
            password: userData.password
        });
    },

    /**
     * Wait for specified time (useful for async operations)
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Generate random string
     * @param {number} length - Length of random string
     * @returns {string} Random string
     */
    generateRandomString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Generate invalid email formats for testing
     * @returns {Array} Array of invalid email formats
     */
    getInvalidEmails() {
        return [
            'invalid-email',
            '@domain.com',
            'user@',
            'user@domain',
            'user.domain.com',
            'user space@domain.com',
            'user@domain..com',
            '',
            null,
            undefined
        ];
    },

    /**
     * Generate invalid passwords for testing
     * @returns {Array} Array of invalid passwords
     */
    getInvalidPasswords() {
        return [
            '123',      // Too short
            '1234567',  // Still too short (need 8 chars)
            '',         // Empty
            null,       // Null
            undefined   // Undefined
        ];
    },

    /**
     * Generate invalid names for testing
     * @returns {Array} Array of invalid names
     */
    getInvalidNames() {
        return [
            'AB',       // Too short (need 3 chars)
            'A',        // Too short
            '',         // Empty
            null,       // Null
            undefined   // Undefined
        ];
    },

    /**
     * Validate JWT token format
     * @param {string} token - JWT token to validate
     * @returns {boolean} True if token format is valid
     */
    isValidJWTFormat(token) {
        if (!token || typeof token !== 'string') return false;
        
        const parts = token.split('.');
        return parts.length === 3; // JWT has 3 parts separated by dots
    },

    /**
     * Get database connection status
     * @returns {string} Connection status
     */
    getDatabaseStatus() {
        const state = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        return states[state] || 'unknown';
    },

    /**
     * Wait for database connection
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise} Promise that resolves when connected
     */
    async waitForDatabase(timeout = 5000) {
        const start = Date.now();
        
        while (Date.now() - start < timeout) {
            if (mongoose.connection.readyState === 1) {
                return true;
            }
            await this.delay(100);
        }
        
        throw new Error('Database connection timeout');
    },

    /**
     * Get test statistics
     * @returns {Object} Test execution statistics
     */
    getTestStats() {
        return {
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            mongooseVersion: mongoose.version,
            databaseStatus: this.getDatabaseStatus(),
            environment: process.env.NODE_ENV || 'development'
        };
    }
};

module.exports = testHelper;