var router = require('express').Router(),
    usersController = require('../controllers/users.js'),
    jwtUtils = require('../middlewares/jwt.js'),
    userSchema = require('../json-schemas/user.js'),
    schemaValidator = require('../middlewares/schema-validation.js');

router.post('/',
    jwtUtils.verifyToken,
    schemaValidator.validate(userSchema.whenCreate),
    usersController.save
);

router.get('/',
    jwtUtils.verifyToken,
    usersController.getAll
);

router.get('/:userId',
    jwtUtils.verifyToken,
    usersController.getOne
);

router.put('/:userId',
    jwtUtils.verifyToken,
    schemaValidator.validate(userSchema.whenUpdate),
    usersController.update
);

router.delete('/:userId',
    jwtUtils.verifyToken,
    usersController.remove
);

module.exports = router;
