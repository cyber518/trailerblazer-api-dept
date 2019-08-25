//Define dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { validationResult } = require('express-validator');

//Post functions handler for auth - register route
module.exports.auth_register_post = async function (req, res, next) {
    //Execute error check
    var errors = validationResult(req);

    //Check if error accoured
    if (!errors.isEmpty()) {
        res.status(400).send(errors);
    }

    //Check if provided email exists on database
    var isEmailExists = await User.findOne({email: req.body.email});
    //Return error if email already exists on database
    if (isEmailExists) {
        return res.status(400).send('Email already exists');
    }

    //Hash the password for security
    var salt = await bcrypt.genSalt(10);
    var hashPassword = await bcrypt.hash(req.body.password, salt);
    
    //Create user model
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    //Save the created user model and return created user's id
    try {
        await user.save();
        res.send({user: user._id});
    } catch (err) {
        //Return error if exists
        res.status(400).send(err);
    }
}

//Post functions handler for auth - login route
module.exports.auth_login_post = async function (req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send(errors);
    }

    var user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.send(400).send('Email or password is wrong');
    }

    var isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Email or password is wrong');
    }

    var token = jwt.sign({_id: user._id}, process.env.SECRET);
    res.header('Authorization', token).send(token);
}