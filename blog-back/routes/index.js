var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

/* // home page
router.get('/', indexController.home);
 */
// login page GET
router.get('/login', indexController.login_get);

// login page POST
router.post('/login', indexController.login_post); 

/* register get and post, delete after production
router.get('/signup', indexController.signup_get);

router.post('/signup', indexController.signup_post);
 */
module.exports = router;
