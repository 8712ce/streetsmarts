const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    screenName: { type: String, required: true, unique: true },
    user: { type: mongoose.ObjectId, refPath: 'User' },
    score: { type: Number, default: 0 },
    sessionScore: { type: Number, default: 0 }
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher
