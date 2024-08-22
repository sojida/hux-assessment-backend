const joi = require('joi')

const ValidateCreateContact = async (req, res, next) => {
    try {
        const bodyofRequest = req.body;
    
        const schema = joi.object({
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            countryCode: joi.string().regex(/\+\d{1,4}/, 'ig').required(),
            phoneNumber: joi.string().pattern(/^[0-9]+$/).required(),
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

const ValidateUpdateContact = async (req, res, next) => {
    try {
        const bodyofRequest = req.body;
    
        const schema = joi.object({
            firstName: joi.string().optional(),
            lastName: joi.string().optional(),
            countryCode: joi.string().regex(/\+\d{1,4}/, 'ig').optional(),
            phoneNumber: joi.string().pattern(/^[0-9]+$/).optional(),
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
    ValidateCreateContact,
    ValidateUpdateContact,
} 