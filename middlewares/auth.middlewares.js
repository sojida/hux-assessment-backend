const joi = require('joi')

const ValidateCreateUser = async (req, res, next) => {
    try {
        const bodyofRequest = req.body;
    
        const schema = joi.object({
            name: joi.string().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9@#]{3,30}$')).required(),
            email: joi.string().email().required(),
        })

        await schema.validateAsync(bodyofRequest, { abortEarly: true })

        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

const ValidateLoginUser = async (req, res, next) => {
    try {
        const bodyofRequest = req.body;
    
        const schema = joi.object({
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9@#]{3,30}$')).required(),
            email: joi.string().email().required(),
        })

        await schema.validateAsync(bodyofRequest, { abortEarly: true })

        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

module.exports = {
    ValidateCreateUser,
    ValidateLoginUser,
} 