const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateofbirth: {
        type: Date,
        default: null,
    },
    gender: {
        type: String,
        default: "male",
        enum: ['male', 'female', 'other'],
    },
    phone: {
        type: String,
        default: null,
    },
    enrollmentdate: {
        type: Date,
        default: null,
    },
    schoolid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schools',
        required: true,
    },
    classid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classrooms',
        default: null
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

const Students = mongoose.model('students', studentSchema);
module.exports = Students;