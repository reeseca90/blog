var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');



// login page GET
router.get('/login', indexController.login_get);

// login page POST
router.post('/login', indexController.login_post); 

// logout
router.post('/logout', indexController.logout);

module.exports = router;
