const { connect } = require('../database');
const AuthService = require('../../services/auth.service')
const UserModel = require('../../models/users.model')


describe(('Auth Service Test'), () => {
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

    it('should create user', async () => {
        const response = await AuthService.SignupUser({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })

        expect(response.code).toEqual(201)
        expect(response.success).toEqual(true)
        expect(response.message).toEqual('Sign up successful')
        expect(response.data).toHaveProperty('user');
        expect(response.data).toHaveProperty('token');
    })

    it('should not create user, duplicate', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })
    
        const response = await AuthService.SignupUser({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })

        expect(response.code).toEqual(409)
        expect(response.success).toEqual(false)
        expect(response.message).toEqual('User already exist')
        expect(response.data).toEqual(null)
    })

    it('should not login user, email not found', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })
    
        const response = await AuthService.LoginUser({
            email: 'test1@mail.com',
            password: '123456',
        })

        expect(response.code).toEqual(400)
        expect(response.success).toEqual(false)
        expect(response.message).toEqual('Invalid credentials')
        expect(response.data).toEqual(null)
    })

    it('should not login user, wrong password', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })
    
        const response = await AuthService.LoginUser({
            email: 'test@mail.com',
            password: '123456888',
        })

        expect(response.code).toEqual(400)
        expect(response.success).toEqual(false)
        expect(response.message).toEqual('Invalid credentials')
        expect(response.data).toEqual(null)
    })

    it('should login user', async () => {
        await UserModel.create({
            email: 'test@mail.com',
            password: '123456',
            name: 'test user'
        })
    
        const response = await AuthService.LoginUser({
            email: 'test@mail.com',
            password: '123456',
        })

        expect(response.code).toEqual(200)
        expect(response.success).toEqual(true)
        expect(response.message).toEqual('Login successful')
        expect(response.data).toHaveProperty('user');
        expect(response.data).toHaveProperty('token');
    })
})