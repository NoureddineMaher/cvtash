const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const initializationDatabase = require('./Config/InitializationDatabase')
const autRouter = require('./Routers/authRoutes')

const PORT = process.env.PORT_APP || 5000;
initializationDatabase();

app.use(cors({credentials: true,}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/auth', autRouter)

app.listen(PORT , () => {
    console.log(`SERVER RUNNING UNDER PORT ${PORT}`);
})