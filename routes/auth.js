//Define dependencies
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

//Require contoller module
const authController = require('../controllers/authController');

/**
 * Register route for current API 
 */
router.post('/register', [check('email', 'Invalid email').isEmail(), check('password', 'Password should be min 8 characters').isLength({ min: 8})], authController.auth_register_post);

/**
 * Login route for current API 
 */
router.post('/login', [check('email', 'Invalid email').isEmail(), check('password', 'Password should be min 8 characters').isLength({ min: 8})], authController.auth_login_post);

module.exports = router;