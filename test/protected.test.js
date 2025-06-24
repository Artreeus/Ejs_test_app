const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const testHelper = require('./helpers/testHelper');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Protected Routes Tests', function() {
    this.timeout(10000);
    let authToken;

    beforeEach(async function() {
        await testHelper.cleanupTestData();
        
        // Register and login to get auth token
        const testUser = testHelper.generateTestUser('protected');
        await chai.request(app)
            .post('/api/user/register')
            .send(testUser);

        const loginRes = await chai.request(app)
            .post('/api/user/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        authToken = loginRes.text;
    });

    after(async function() {
        await testHelper.cleanupTestData();
    });

    describe('GET /api/private', function() {
        it('should access private route with valid token', async function() {
            const res = await chai.request(app)
                .get('/api/private')
                .set('auth-token', authToken);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('_id');
            expect(res.body._id).to.be.a('string');
        });

        it('should not access private route without token', async function() {
            const res = await chai.request(app)
                .get('/api/private');

            expect(res).to.have.status(401);
            expect(res.text).to.include('Access denied');
        });

        it('should not access private route with invalid token', async function() {
            const res = await chai.request(app)
                .get('/api/private')
                .set('auth-token', 'invalid-token-12345');

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message');
        });

        it('should not access private route with empty token', async function() {
            const res = await chai.request(app)
                .get('/api/private')
                .set('auth-token', '');

            expect(res).to.have.status(401);
            expect(res.text).to.include('Access denied');
        });

        it('should not access private route with malformed token', async function() {
            const res = await chai.request(app)
                .get('/api/private')
                .set('auth-token', 'Bearer invalid-token');

            expect(res).to.have.status(400);
        });
    });

    describe('Product Routes (Protected)', function() {
        it('should get products list with valid token', async function() {
            const res = await chai.request(app)
                .get('/api/examples/pagination/products')
                .set('auth-token', authToken);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('returnProducts');
            expect(res.body).to.have.property('page');
            expect(res.body).to.have.property('limit');
            expect(res.body.returnProducts).to.be.an('array');
        });

        it('should get products with pagination parameters', async function() {
            const res = await chai.request(app)
                .get('/api/examples/pagination/products?page=1&limit=5')
                .set('auth-token', authToken);

            expect(res).to.have.status(200);
            expect(res.body.page).to.equal(1);
            expect(res.body.limit).to.equal('5');
        });

        it('should create product with valid token', async function() {
            const productData = {
                name: 'Test Product',
                price: 99.99
            };

            const res = await chai.request(app)
                .post('/api/examples/pagination/products')
                .set('auth-token', authToken)
                .send(productData);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('addedProduct');
            expect(res.body.addedProduct.name).to.equal('Test Product');
            expect(res.body.addedProduct.price).to.equal(99.99);
            expect(res.body.message).to.include('Product Added Successfully');
        });

        it('should create product with minimal data', async function() {
            const productData = {
                name: 'Minimal Product'
            };

            const res = await chai.request(app)
                .post('/api/examples/pagination/products')
                .set('auth-token', authToken)
                .send(productData);

            expect(res).to.have.status(201);
            expect(res.body.addedProduct.name).to.equal('Minimal Product');
        });

        it('should not create product without token', async function() {
            const productData = {
                name: 'Test Product',
                price: 99.99
            };

            const res = await chai.request(app)
                .post('/api/examples/pagination/products')
                .send(productData);

            expect(res).to.have.status(401);
            expect(res.text).to.include('Access denied');
        });

        it('should not create product with empty body', async function() {
            const res = await chai.request(app)
                .post('/api/examples/pagination/products')
                .set('auth-token', authToken)
                .send({});

            expect(res).to.have.status(400);
            expect(res.body.message).to.include('Request body is empty');
        });

        it('should update product with valid token', async function() {
            // First create a product
            const createRes = await chai.request(app)
                .post('/api/examples/pagination/products')
                .set('auth-token', authToken)
                .send({ name: 'Original Product', price: 50 });

            const productId = createRes.body.addedProduct._id;

            // Then update it
            const updateData = {
                name: 'Updated Product',
                price: 75
            };

            const res = await chai.request(app)
                .put(`/api/examples/pagination/products?productId=${productId}`)
                .set('auth-token', authToken)
                .send(updateData);

            expect(res).to.have.status(200);
            expect(res.body.updatedProduct.name).to.equal('Updated Product');
            expect(res.body.updatedProduct.price).to.equal(75);
        });

        it('should not update non-existent product', async function() {
            const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

            const res = await chai.request(app)
                .put(`/api/examples/pagination/products?productId=${fakeId}`)
                .set('auth-token', authToken)
                .send({ name: 'Updated Product' });

            expect(res).to.have.status(404);
            expect(res.body.message).to.include('Product not found');
        });

        it('should delete product with valid token', async function() {
            // First create a product
            const createRes = await chai.request(app)
                .post('/api/examples/pagination/products')
                .set('auth-token', authToken)
                .send({ name: 'Product to Delete', price: 25 });

            const productId = createRes.body.addedProduct._id;

            // Then delete it
            const res = await chai.request(app)
                .delete(`/api/examples/pagination/products?productId=${productId}`)
                .set('auth-token', authToken);

            expect(res).to.have.status(200);
            expect(res.body.message).to.include('Product deleted successfully');
            expect(res.body.deletedProduct._id).to.equal(productId);
        });

        it('should not delete non-existent product', async function() {
            const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

            const res = await chai.request(app)
                .delete(`/api/examples/pagination/products?productId=${fakeId}`)
                .set('auth-token', authToken);

            expect(res).to.have.status(404);
            expect(res.body.message).to.include('Product not found');
        });

        it('should not perform CRUD operations with invalid token', async function() {
            const invalidToken = 'invalid.token.here';

            // Test all CRUD operations with invalid token
            const getRes = await chai.request(app)
                .get('/api/examples/pagination/products')
                .set('auth-token', invalidToken);

            const postRes = await chai.request(app)
                .post('/api/examples/pagination/products')
                .set('auth-token', invalidToken)
                .send({ name: 'Test' });

            const putRes = await chai.request(app)
                .put('/api/examples/pagination/products?productId=507f1f77bcf86cd799439011')
                .set('auth-token', invalidToken)
                .send({ name: 'Test' });

            const deleteRes = await chai.request(app)
                .delete('/api/examples/pagination/products?productId=507f1f77bcf86cd799439011')
                .set('auth-token', invalidToken);

            expect(getRes).to.have.status(400);
            expect(postRes).to.have.status(400);
            expect(putRes).to.have.status(400);
            expect(deleteRes).to.have.status(400);
        });
    });
});