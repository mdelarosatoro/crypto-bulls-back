const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();
// const path = require('path')

const PORT = process.env.PORT || 8080;

const app = express();

//route imports
const routes = require('./routes');

app.use(morgan('tiny'));
app.use(express.json());

app.use(expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
}).unless({
    path: ["/login", "/users/create"]
})
);

//routes
// app.use('/api/v1', routes);
app.use('/login', routes.loginRoutes);
app.use('/users', routes.userRoutes);

app.listen(PORT, () => {
    console.log(`Server started succesfully on port ${PORT}`)
})