const supertest = require('supertest');
const app = require('../../main');
const { connect } = require('../database');
const UserModel = require('../../models/users.model')



describe(('Auth Endpoint'), () => {
    let connection
    // before hook
    beforeAll(async () => {
        connection = await connect()
    })

    afterEach(async () => {
        await connection.cleanup()
    })
    
    // after hook
    afterAll(async () => {
        await connection.disconnect()
    })

    it('should successfully register a user', async () => {
        const response = await supertest(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send({
            password: '123456',
            email: 'test@mail.com',
            name: 'test user'
        })

        expect(response.body.code).toEqual(201);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual('Sign up successful');
        expect(response.body.data.user).toMatchObject({
            email: 'test@mail.com',
            name: 'test user'
        })
    })

    it('should not successfully register a user, duplicate', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })

        const response = await supertest(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send({
            password: '123456',
            email: 'test@mail.com',
            name: 'test user'
        })

        expect(response.body.code).toEqual(409)
        expect(response.body.success).toEqual(false)
        expect(response.body.message).toEqual('User already exist')
        expect(response.body.data).toEqual(null)
    })

    it('should not login user, email not found', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })
    
        const response = await supertest(app)
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send({
            password: '123456',
            email: 'tes2t@mail.com',
        })

        expect(response.body.code).toEqual(400)
        expect(response.body.success).toEqual(false)
        expect(response.body.message).toEqual('Invalid credentials')
        expect(response.body.data).toEqual(null)
    })

    it('should not login user, wrong password', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })
    
        const response = await supertest(app)
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send({
            password: '1234562',
            email: 'test@mail.com',
        })

        expect(response.body.code).toEqual(400)
        expect(response.body.success).toEqual(false)
        expect(response.body.message).toEqual('Invalid credentials')
        expect(response.body.data).toEqual(null)
    })

    it('should login user', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })
    
        const response = await supertest(app)
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send({
            email: 'test@mail.com',
            password: '123456',
        })

        expect(response.body.code).toEqual(200)
        expect(response.body.success).toEqual(true)
        expect(response.body.message).toEqual('Login successful')
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data).toHaveProperty('token');
    })
})
