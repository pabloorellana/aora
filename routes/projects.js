var router = require('express').Router(),
    jwtUtils = require('../utils/jwt.js'),
    projectsController = require('../controllers/projects.js'),
    formatter = require('../utils/formatter.js');

router.post('/',
	jwtUtils.verifyToken,
	projectsController.save,
	formatter.formatErrorResponse
);

router.get('/',
	jwtUtils.verifyToken,
	projectsController.getAll,
	formatter.formatErrorResponse
);

router.get('/:projectId',
	jwtUtils.verifyToken,
	projectsController.getOne,
	formatter.formatErrorResponse
);

router.put('/:projectId',
	jwtUtils.verifyToken,
	projectsController.update,
	formatter.formatErrorResponse
);

router.delete('/:projectId',
	jwtUtils.verifyToken,
	projectsController.remove,
	formatter.formatErrorResponse
);

module.exports = router;
