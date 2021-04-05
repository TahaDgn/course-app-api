const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const { logger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error');
// Mongosee
const connectDB = require('./config/db');
// Load env vars...
dotenv.config({ path: path.join(__dirname, '../.env') }); // Bununla ilgili req sırası sorulacak...

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Load express...
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
app.use('/v1/bootcamps', bootcamps);
app.use('/v1/courses', courses)

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`.cyan.underline.bold);
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red);
    server.close(() => {
        process.exit(1);
    })
})