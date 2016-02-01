var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StorySchema   = new Schema({
    title:       { type: String, required: true },
    description: { type: String, default: '' },
    acceptance:  { type: String, default: '' },
    type:   {
        type: String,
        enum: ['feat', 'bug', 'spike'],
        default: 'feat'
    },
    points: { type: Number, required: true },
    state:  {
        type: String,
        enum: ['unstarted', 'started', 'finished', 'delivered', 'accepted', 'rejected'],
        default: 'unstarted'
    },
    createdAt:  { type: Date, default: Date.now },
    tags:  [{ type: String, required: true, unique: true }],
    requester : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owner:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId : { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Story', StorySchema);

