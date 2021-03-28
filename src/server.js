const express = require('express');
const dotenv = require('dotenv');

// Route files...
const pong = require('./routes/pong');
const bootcamps = require('./routes/bootcamps');

// Load env vars...

const app = express();

dotenv.config({path:"./src/config/config.env"});

// Mouth routers

app.use('/v1/bootcamps', pong);
app.use('/v1/bootcamps', bootcamps );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`);
});