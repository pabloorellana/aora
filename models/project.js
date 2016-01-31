var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema   = new Schema({
    name:       { type: String, unique: true, required: true },
    startDate:  { type: Date, default: Date.now },
    pointScale: { type: String, enum: ['effort', 'fibonacci', 'time'], default: 'fibonacci' },
    iterationLength: { type: Number, required: true, default: 1 },
    doneIterationsToShow: { type: Number, default: 1 }
});

ProjectSchema.statics.createUnique = function (objProject) {
    return this.findOne({ name: objProject.name }).then((project) => {
        if (project) {
            throw ({
                type: 'conflict',
                message: 'Project with the same name already exists.'
            });
        }

    }).then(() => {
        return this.create(objProject);
    });
};

module.exports = mongoose.model('Project', ProjectSchema);
