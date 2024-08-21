const { SignupUser, LoginUser } = require('../services/auth.service')


const Signup = async (req, res) => {
    const payload = req.body;

    const serviceResponse = await SignupUser(payload);

    return res.status(serviceResponse.code).json(serviceResponse);
}

const Login = async (req, res) => {
    const payload = req.body;

    const serviceResponse = await LoginUser(payload);

    return res.status(serviceResponse.code).json(serviceResponse);
}

module.exports = {
    Signup,
    Login,
}

