const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const { logger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error');
// Mongosee
const connectDB = require('./config/db');
// Route files...
const pong = require('./routes/pong');
const bootcamps = require('./routes/bootcamps');

// Load env vars...
dotenv.config({path:"./src/config/config.env"});
const app = express();

// Body parser
app.use(express.json());

// app.use(logger);
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
connectDB();
// Mouth routers
app.use('/v1/bootcamps', pong);
app.use('/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`.cyan.underline.bold);
});

//Handle unhandled promise rejections
process.on('unhandledRejection' , (err , promise) => {
    console.log(`Error : ${err.message}`.red);
    server.close(() => {
        process.exit(1);
    })
})