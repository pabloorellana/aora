var router = require('express').Router(),
    jwtUtils = require('../utils/jwt.js'),
    projectSchema = require('../json-schemas/project.js'),
    storySchema = require('../json-schemas/story.js'),
    schemaValidator = require('../utils/schema-validation.js'),
    projectsController = require('../controllers/projects.js'),
    storiesController = require('../controllers/stories.js'),
    formatter = require('../utils/formatter.js');

router.post('/',
	jwtUtils.verifyToken,
	schemaValidator.validate(projectSchema.whenCreate),
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
	schemaValidator.validate(projectSchema.whenUpdate),
	projectsController.update,
	formatter.formatErrorResponse
);

router.delete('/:projectId',
	jwtUtils.verifyToken,
	projectsController.remove,
	formatter.formatErrorResponse
);

// stories
router.post('/:projectId/stories',
	schemaValidator.validate(storySchema.whenCreate),
	storiesController.save,
	formatter.formatErrorResponse
);

router.get('/:projectId/stories',
	storiesController.getAll,
	formatter.formatErrorResponse
);

router.get('/:projectId/stories/:storyId',
	storiesController.getOne,
	formatter.formatErrorResponse
);

router.put('/:projectId/stories/:storyId',
	schemaValidator.validate(storySchema.whenUpdate),
	storiesController.update,
	formatter.formatErrorResponse
);

router.delete('/:projectId/stories/:storyId',
	storiesController.remove,
	formatter.formatErrorResponse
);

module.exports = router;
