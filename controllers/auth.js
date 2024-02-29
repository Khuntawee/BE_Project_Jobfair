const User = require('../models/User');

exports.register = async (req, res, next) => {
    const {name, email, password, telephone_number, role} = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
            telephone_number,
            role
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, message: 'Please provide an email and password'});
    }

    try {
        const user = await User.findOne({email}).select('+password');

        if (!user) {
            return res.status(401).json({success: false, message: 'Invalid credentials'});
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({success: false, message: 'Invalid credentials'});
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({success: true, token});
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({success: true, data: user});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};
