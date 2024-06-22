const mongoose = require('mongoose');

const DB_CONNECT = process.env.DB_CONNECT;


const connection = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(DB_CONNECT , {
        useNewUrlParser : true
    })
    .then(() => {
        console.log("Successfully connected to database !");
    })
    .catch((err) => {
        console.log("Database connection Failed ");
    })
}

module.exports = connection;