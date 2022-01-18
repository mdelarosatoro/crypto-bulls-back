const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

//model imports
const Users = require('../models/users');

//middleware imports
const usersMiddleware = require('../middlewares/users')

router.post('/create',
usersMiddleware.validateRegisterFieldsNotEmpty,
usersMiddleware.validateUniqueUserId,
usersMiddleware.validateUniqueEmail,
usersMiddleware.validatePasswordLength,
async (req, res) => {
    try {
        const {
            userId,
            password,
            email,
            name,
            lastName,
            dateOfBirth,
            country,
        } = req.body;

        //password hashing
        bcrypt.hash(password, 10, async function(err, hash) {
            const newUser = new Users({
                userId,
                password: hash,
                email,
                name,
                lastName,
                dateOfBirth,
                country,
                portfolio: [],
                admin: true
            });
            await newUser.save();

            res.status(201).json(newUser);
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
})

//get all users on the db, should have admin permission
router.get('/', async (req, res) => {
    try {
        const users = await Users.find({});

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
})

//get current user information
router.get('/my-info', async (req, res) => {
    try {
        const { userId, email, name, lastName, portfolio } = req.user;

        const payload = {
            userId,
            email,
            name,
            lastName,
            portfolio,
        };

        res.status(200).json(payload);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
})

//toggle coin on portfolio
router.get('/toggle-coin-portfolio/:coinId', async (req, res) => {
    try {
        const { coinId } = req.params;
        const { email } = req.user;

        const userInDb = await Users.findOne({ email });

        const userPortfolio = userInDb.portfolio.filter(item => item !== undefined);

        if (userPortfolio.some(item => item === coinId)) {
            const newPortfolio = userPortfolio.filter(item => item !== coinId);
            userInDb.portfolio = newPortfolio;
            userInDb.save();
            res.status(200).json(`Coin ${coinId} removed from portfolio succesfully.`);
        } else {
            userPortfolio.push(coinId);
            userInDb.portfolio = userPortfolio;
            userInDb.save();
            res.status(200).json(`Coin ${coinId} added from portfolio succesfully.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
});

router.get('/portfolio', async (req, res) => {
    try {
        const { email } = req.user;

        const userInDb = await Users.findOne({ email });

        res.status(200).json(userInDb.portfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
})

module.exports = router;