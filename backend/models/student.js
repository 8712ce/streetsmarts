const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    teacher: { type: mongoose.ObjectId, refPath: 'Teacher' },
    level: {type: Number, default: 0},
    user: { type: mongoose.ObjectId, refPath: 'User' },
    score: { type: Number, default: 0 }
})

const Student = mongoose.model("Student", studentSchema);

module.exports = Student