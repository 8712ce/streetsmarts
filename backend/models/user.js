const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['teacher', 'student'], required: true, default: 'student'}
});

const User = mongoose.model('User', userSchema)

module.exports = User

