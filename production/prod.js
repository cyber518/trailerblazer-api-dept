//Define dependencies
const helmet = require('helmet');
const compression = require('compression');

//Export important packages for production security
module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
}