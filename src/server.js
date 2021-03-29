const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { logger } = require('./middlewares/logger');
// Route files...
const pong = require('./routes/pong');
const bootcamps = require('./routes/bootcamps');
// Load env vars...

const app = express();

dotenv.config({path:"./src/config/config.env"});

// app.use(logger);
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mouth routers

app.use('/v1/bootcamps', pong);
app.use('/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`);
});