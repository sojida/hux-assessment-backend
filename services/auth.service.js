const UserModel = require('../models/users.model')
const jwt = require('jsonwebtoken')

const GenerateToken = async (user, expiresIn = '1w') => {

    const token = await jwt.sign({ email: user.email, _id: user._id}, 
        process.env.JWT_SECRET || 'super_secret', 
        { expiresIn })

    return token;
}

const SignupUser = async ({ email, password, name }) => {
    const alreadyExists = await UserModel.findOne({
        email
    })

    if (alreadyExists) {
        return {
            code: 409,
            message: 'User already exist',
            success: false,
            data: null
        }
    }

    
    const user = await UserModel.create({
        name,
        email,
        password
    })

    const token  = await GenerateToken(user)

    return {
        code: 201,
        message: 'Sign up successful',
        success: true,
        data: {
            token,
            user,
        }
    }
}


const LoginUser = async ({ email, password }) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
        return {
            code: 400,
            message: 'Invalid credentials',
            success: false,
            data: null
        }
    }

    const validPassword = await user.isValidPassword(password)

    if (!validPassword) {
        return {
            code: 400,
            message: 'Invalid credentials',
            success: false,
            data: null
        }
    }

    const token = await GenerateToken(user);

    return {
        code: 200,
        message: 'Login successful',
        success: true,
        data: {
            token,
            user
        }
    }
}


module.exports = {
    LoginUser,
    SignupUser,
}
