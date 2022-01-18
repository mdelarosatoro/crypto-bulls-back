const mongoose = require('../connection');

const Users = mongoose.model('users', {
    userId: String,
    password: String,
    email: String,
    name: String,
    lastName: String,
    dateOfBirth: String,
    country: String,
    portfolio: Array,
    admin: Boolean,
})

module.exports = Users;