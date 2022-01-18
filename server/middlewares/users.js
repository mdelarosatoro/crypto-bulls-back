const Users = require('../models/users');

module.exports = {
    validateRegisterFieldsNotEmpty: (req, res, next) => {
        const {
            userId,
            password,
            email,
            name,
            lastName,
            dateOfBirth,
            country,
        } = req.body;

        if (
            !userId || userId === '' ||
            !password || password === '' ||
            !email || email === '' ||
            !name || name === '' ||
            !lastName || lastName === '' ||
            !dateOfBirth || dateOfBirth === '' ||
            !country || country === '' 
        ) {
            res.status(400).json({error: `At least one of the register fields is empty.`});
        } else {
            next();
        }
    },

    validateUniqueUserId: async (req, res, next) => {
        try {
            const { userId } = req.body;
    
            const possibleUser = await Users.find({
                userId
            });

            if (possibleUser && possibleUser.some(user => user.userId === userId)) {
                res.status(400).json('UserId already in use, please choose another one.')
            } else {
                next();
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: 'Oops, something went wrong.'})
        }
    },

    validateUniqueEmail: async (req, res, next) => {
        try {
            const { email } = req.body;
    
            const possibleUser = await Users.find({
                email
            });

            if (possibleUser && possibleUser.some(user => user.email === email)) {
                res.status(400).json('Email already in use, please choose another one.')
            } else {
                next();
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: 'Oops, something went wrong.'})
        }
    },

    validatePasswordLength: (req, res, next) => {
        const { password } = req.body;

        if (password.length < 6) {
            res.status(400).json({error: 'Password must be at least 6 characters long'});
        } else if (password.length > 20) {
            res.status(400).json({error: 'Password can not have more than 20 characters'});
        } else {
            next();
        }
    }
}