const mongoose = require('mongoose');

const host = 'localhost';
const port = 27017;
const dbName = 'mongoose-test'

// const connectionString = `mongodb://${host}:${port}/${dbName}`
const connectionString = 'mongodb+srv://maxdevcode:maxdevcode@coinexchange.ikm1y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
    console.log('Connected to Mongoose!');
})

module.exports = mongoose;