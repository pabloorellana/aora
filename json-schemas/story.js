const title     = { 'type': 'string', 'minLength': 1 },
    description = { 'type': 'string' },
    acceptance  = { 'type': 'string' },
    type   = { 'type': 'string', 'enum': ['feat', 'bug', 'spike'] },
    points = { 'type': 'number', 'minimum': 0 },
    state  = { 'type': 'string', 'enum': ['unstarted', 'started', 'finished', 'delivered', 'accepted', 'rejected'] },
    createdAt = { 'type': 'Date', 'format': 'date-time' },
    requester = { 'type': 'string', 'minLength': 1 },
    owner     = { 'type': 'string', 'minLength': 1 },
    projectId = { 'type': 'string', 'minLength': 1 },
    tags      = { 'type': 'array', 'items': { 'type': 'string', 'minLength': 1 }, 'uniqueItems': true };

const whenCreate = {
    'id': 'story',
    'type': 'object',
    'properties': { title, description, acceptance, type, points, state, createdAt, requester, owner, projectId, tags },
    'required': ['title', 'points', 'requester', 'owner', 'projectId']
};

const whenUpdate = {
    'id': 'story',
    'type': 'object',
    'properties': { title, description, acceptance, type, points, state, createdAt, requester, owner, projectId, tags }
};

module.exports = { whenCreate, whenUpdate };
