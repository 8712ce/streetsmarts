const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    teacher: { type: mongoose.ObjectId, refPath: 'Teacher' },
    level: {type: Number, default: 0},

})

const Student = mongoose.model("Student", studentSchema);

module.exports = Student