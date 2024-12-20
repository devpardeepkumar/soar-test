const mongoose = require('mongoose');
const classroomSchema = new mongoose.Schema(
    {
        schoolid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'schools',
            required: true,
        },
        shortDesc: {
            type: String,
        },
        longDesc: {
            type: String,
        },
        capacity: {
            type: Number,
            required: true,
        },
        resources: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
    },
    { timestamps: true }
);
const Classrooms = mongoose.model('classrooms', classroomSchema);
module.exports = Classrooms;
