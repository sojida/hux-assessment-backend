const UserModel = require('../models/users.model');
const jwt = require('jsonwebtoken');

const BearerTokenAuth = async (req, res, next) => {
    try {
    const authHeader = req.headers;

    if (!authHeader.authorization) {
        return res.status(401).json({ message: 'You are not authenticated!', success: false });
    }

    const token = authHeader.authorization.split(' ')[1]; // berear tokenvalue

    const decoded = await jwt.verify(token, process.env.JWT_SECRET || 'super_secret')


    const user = await UserModel.findOne({ _id: decoded._id })
    
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        })
    }

    req.user = user;

    next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        })
    }
}

module.exports = {
    BearerTokenAuth
}
