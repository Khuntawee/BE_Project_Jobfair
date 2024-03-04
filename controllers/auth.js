const User = require('../models/User');
const crypto = require('crypto');

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

exports.logout=async(req,res,next)=>{
    res.cookie('token','none',{
        expires: new Date(Date.now()+ 10*1000),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        data:{}
    });
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({success: true, data: user});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.generateResetToken = async (req, res, next) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json({success:false,message:'User not found'});
        }
        
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
        await user.save();

        res.status(200).json({success:true,data:resetToken});
    } catch (err) {
        res.status(500).json({success:false,message:err.message});
    }
}

exports.resetPassword = async (req, res, next) => {
    try{
        const user = await User.findOne({
            resetPasswordToken:req.params.resetToken,
            resetPasswordExpire:{$gt:Date.now()}
        });

        if(!user){
            return res.status(400).json({success:false,message:'Invalid token or token expired'});
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({success:false,message:err.message});
    }
}