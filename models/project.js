var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema   = new Schema({
    name:       { type: String, unique: true, required: true },
    startDate:  { type: Date, default: Date.now },
    /**
     * pointScale takes 'effort' or 'time' as the unit to estimate
     * the user stories, tipically 'effort' is a number in a fibonacci series that
     * represents the amout of work required to complete a US,
     * and 'time' is the amount of work in hours required to complete a US.
     */
    pointScale: { type: String, enum: ['effort', 'time'], default: 'effort' },
    /**
     * Defines how much time in weeks is the iteration going to last.
     * Min 1 week, max 10 weeks
     */
    iterationLength: { type: Number, default: 1, min: 1, max: 10 },
    /**
     * Defines how many iterations will be took into account to be retrieved as 'done'
     */
    doneIterationsToShow: { type: Number, default: 1, min: 1, max: 10 }
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
