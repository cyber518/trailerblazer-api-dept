//Define dependencies
const dataHelper = require('../helpers/dataHelper');

//Get functions handler for contact route
module.exports.search_get = function (req, res, next) {
    //Execute search result with helper and send back the response data
    dataHelper.getSearchResult(req.query.movie).then(data => {
        res.json(data);
    });
}