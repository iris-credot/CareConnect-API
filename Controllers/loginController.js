const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middleware/async');
const userModel = require('../Models/User');
const doctorModel = require('../Models/Doctor');
const patientModel = require('../Models/Patient');
const Notfound = require('../Error/NotFound');

const login_post = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const secret = process.env.SECRET_KEY;

    // Try to log in the user from the User model
    let user;
    try {
        user = await userModel.login(email, password);
    } catch (error) {
        console.error('Login error:', error);
        return next(new Notfound('Invalid email or password'));
    }

    const { _id: userId, username, role } = user;

    // Depending on role, fetch additional profile data
    let profile = null;
    if (role === 'doctor') {
        profile = await doctorModel.findOne({ user: userId }).populate('user');
    } else if (role === 'patient') {
        profile = await patientModel.findOne({ user: userId }).populate('user');
    }

    // Generate token
    const token = jwt.sign({ userId, username, role }, secret, {
        expiresIn: '1h',
    });

    // Set token in cookie and header
    const expiryDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie('jwt', token, {
        httpOnly: true,
        path: '/',
        expires: expiryDate,
        secure: true,
        sameSite: 'Strict'
    });

    res.status(200).json({ user, profile, token });
});

const logout = asyncWrapper(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const secret = process.env.SECRET_KEY;
    jwt.verify(token, secret, (err) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        } else {
            res.clearCookie('jwt');
            res.json({ message: 'Logged out successfully' });
        }
    });
});

module.exports = {
    login_post,
    logout
};
