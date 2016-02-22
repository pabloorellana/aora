var router = require('express').Router(),
    jwtUtils = require('../middlewares/jwt-validator.js'),
    projectSchema = require('../json-schemas/project.js'),
    storySchema = require('../json-schemas/story.js'),
    schemaValidator = require('../middlewares/schema-validator.js'),
    projectsController = require('../controllers/projects.js'),
    storiesController = require('../controllers/stories.js');

router.post('/',
	jwtUtils.verifyToken,
	schemaValidator.validate(projectSchema.whenCreate),
	projectsController.save
);

router.get('/',
	jwtUtils.verifyToken,
	projectsController.getAll
);

router.get('/:projectId',
	jwtUtils.verifyToken,
	projectsController.getOne
);

router.put('/:projectId',
	jwtUtils.verifyToken,
	schemaValidator.validate(projectSchema.whenUpdate),
	projectsController.update
);

router.delete('/:projectId',
	jwtUtils.verifyToken,
	projectsController.remove
);

// stories
router.post('/:projectId/stories',
	schemaValidator.validate(storySchema.whenCreate),
	storiesController.save
);

router.get('/:projectId/stories',
	storiesController.getAll
);

router.get('/:projectId/stories/:storyId',
	storiesController.getOne
);

router.put('/:projectId/stories/:storyId',
	schemaValidator.validate(storySchema.whenUpdate),
	storiesController.update
);

router.delete('/:projectId/stories/:storyId',
	storiesController.remove
);

module.exports = router;
