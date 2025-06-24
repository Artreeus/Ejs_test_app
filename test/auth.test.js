const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const testHelper = require('./helpers/testHelper');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication Tests', function() {
    this.timeout(10000);

    beforeEach(async function() {
        await testHelper.cleanupTestData();
    });

    after(async function() {
        await testHelper.cleanupTestData();
    });

    describe('POST /api/user/register', function() {
        it('should register a new user successfully', async function() {
            const testUser = testHelper.generateTestUser('1');
            
            const res = await chai.request(app)
                .post('/api/user/register')
                .send(testUser);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.be.a('string');
        });

        it('should not register user with invalid email', async function() {
            const testUser = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'testpassword123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/register')
                .send(testUser);

            expect(res).to.have.status(400);
            expect(res.text).to.include('email');
        });

        it('should not register user with short password', async function() {
            const testUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: '123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/register')
                .send(testUser);

            expect(res).to.have.status(400);
            expect(res.text).to.include('password');
        });

        it('should not register user with missing name', async function() {
            const testUser = {
                email: 'test@example.com',
                password: 'testpassword123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/register')
                .send(testUser);

            expect(res).to.have.status(400);
            expect(res.text).to.include('name');
        });

        it('should not register duplicate user', async function() {
            const testUser = testHelper.generateTestUser('duplicate');
            
            // Register first time
            await chai.request(app)
                .post('/api/user/register')
                .send(testUser);

            // Try to register again
            const res = await chai.request(app)
                .post('/api/user/register')
                .send(testUser);

            expect(res).to.have.status(400);
            expect(res.text).to.include('Email address already exists');
        });

        it('should not register user with very short name', async function() {
            const testUser = {
                name: 'AB',
                email: 'test@example.com',
                password: 'testpassword123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/register')
                .send(testUser);

            expect(res).to.have.status(400);
            expect(res.text).to.include('name');
        });
    });

    describe('POST /api/user/login', function() {
        beforeEach(async function() {
            // Register a test user for login tests
            const testUser = testHelper.generateTestUser('login');
            await chai.request(app)
                .post('/api/user/register')
                .send(testUser);
        });

        it('should login successfully with valid credentials', async function() {
            const loginData = {
                email: 'testlogin@example.com',
                password: 'testpassword123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res).to.have.status(200);
            expect(res).to.have.header('auth-token');
            expect(res.text).to.be.a('string');
            expect(res.text.length).to.be.greaterThan(50); // JWT token length check
        });

        it('should not login with invalid email', async function() {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'testpassword123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res).to.have.status(400);
            expect(res.text).to.include('User with this email does not exist');
        });

        it('should not login with wrong password', async function() {
            const loginData = {
                email: 'testlogin@example.com',
                password: 'wrongpassword'
            };
            
            const res = await chai.request(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res).to.have.status(400);
            expect(res.text).to.include('Email or Password do not match');
        });

        it('should not login with empty email', async function() {
            const loginData = {
                email: '',
                password: 'testpassword123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res).to.have.status(400);
            expect(res.text).to.include('email');
        });

        it('should not login with empty password', async function() {
            const loginData = {
                email: 'testlogin@example.com',
                password: ''
            };
            
            const res = await chai.request(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res).to.have.status(400);
            expect(res.text).to.include('password');
        });

        it('should not login without email field', async function() {
            const loginData = {
                password: 'testpassword123'
            };
            
            const res = await chai.request(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res).to.have.status(400);
            expect(res.text).to.include('email');
        });

        it('should not login without password field', async function() {
            const loginData = {
                email: 'testlogin@example.com'
            };
            
            const res = await chai.request(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res).to.have.status(400);
            expect(res.text).to.include('password');
        });
    });
});