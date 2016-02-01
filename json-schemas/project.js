const name    =  {
        'type': 'string',
        'minLength': 1
    },
    startDate =  {
        'type': 'Date',
        'format': 'date-time'
    },
    pointScale = {
        'type': 'string',
        'enum': ['fibonacci', 'time']
    },
    iterationLength = {
        'type': 'number',
        'minimum': 1,
        'maximum': 10
    },
    doneIterationsToShow = {
        'type': 'number',
        'minimum': 1,
        'maximum': 10
    };

const whenCreate = {
    'id': 'project',
    'type': 'object',
    'properties': { name, startDate, pointScale, iterationLength, doneIterationsToShow },
    'required': ['name']
};

const whenUpdate = {
    'id': 'project',
    'type': 'object',
    'properties': { name, startDate, pointScale, iterationLength, doneIterationsToShow },
};

module.exports = { whenCreate, whenUpdate };
