var router = require('express').Router(),
    projectsController = require('../controllers/projects.js'),
    formatter = require('../utils/formatter.js');

router.post('/', projectsController.save, formatter.formatErrorResponse);

router.get('/', projectsController.getAll, formatter.formatErrorResponse);

router.get('/:projectId', projectsController.getOne, formatter.formatErrorResponse);

router.put('/:projectId', projectsController.update, formatter.formatErrorResponse);

router.delete('/:projectId', projectsController.remove, formatter.formatErrorResponse);

module.exports = router;
