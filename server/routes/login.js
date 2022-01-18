const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const Users = require('../models/users');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const possibleUser = await Users.findOne({ email })

        if (!possibleUser) {
            res.status(401).json({error: 'Check email and/or password'});
        } else {
            const hash = possibleUser.password;

            bcrypt.compare(password, hash, (err, result) => {
                if (!result) {
                    res.status(401).json({error: 'Check email and/or password'})
                } else {
                    const token = jwt.sign({
                        userId: possibleUser.userId,
                        email: possibleUser.email,
                        name: possibleUser.name,
                        lastName: possibleUser.lastName,
                        portfolio: possibleUser.portfolio,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '60m' })
                    res.status(200).json({token})
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
});

module.exports = router;