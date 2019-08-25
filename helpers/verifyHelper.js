//Define dependencies
const jwt = require('jsonwebtoken');

module.exports = {
    /**
     * Verifies the request with provided Authorization token
     *
     * @param {Object} req - req object for current router
     * @param {Object} res - res object for current router
     * @param {Object} next - next object for current router
     *
     */
    authRequest: function (req, res, next) {
        //Get the toke value from header
        var token = req.header('Authorization');
        
        //Check if token provided and return 401 error if not
        if (!token) {
            return res.status(401).send('No token detected');
        }
        
        //Verify token and next
        try {
            var verify = jwt.verify(token, process.env.SECRET);
            req.user = verify;
            next();
        } catch (err) {
            //Return error if exists
            res.status(400).send('Invalid Token');
        }
    }
}