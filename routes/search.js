//Define dependencies
const express = require('express');
const router = express.Router();
const routeCache = require('route-cache');
const verifyHelper = require('../helpers/verifyHelper');

//Require contoller module
const searchController = require('../controllers/searchController');

/**
 * Router for searching movies for provided string 
 */
router.get('/', verifyHelper.authRequest, routeCache.cacheSeconds(6000), searchController.search_get);

module.exports = router;