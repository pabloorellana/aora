var router = require('express').Router();

router.use('/users', require('./users.js'));
router.use('/auth', require('./auth.js'));
router.use('/projects', require('./projects.js'));

module.exports = router;