const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const expressMongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error');
// Mongosee
const connectDB = require('./config/db');
// Load env vars...
dotenv.config({ path: path.join(__dirname, '../.env') }); // Bununla ilgili req sırası sorulacak...

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const reviews = require('./routes/reviews');
const hpp = require('hpp');

// Load express...
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// app.use(logger);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan(function (tokens, req, res) {
        return [
            'Log',
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'MS'
        ].join(' ')
    }));
}
connectDB();

// File uploading
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

// Sanitize data
app.use(expressMongoSanitize());

// Set security headers
app.use(helmet());

// Set xss protector
app.use(xssClean());

// Static folder
app.use(express.static(path.join(__dirname, './public/uploads')));

// Rate limitter
app.use(expressRateLimit({
    windowMs: 5 * 60 * 1000,
    max: 25,
    message: 'Too many requests within a short time. Please try again later',
}));

// Prevent hpp param pollution
app.use(hpp());

// Enable cors

const whilelist = process.env.CORS_WHITELIST.split(' ');

app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS'))
        }
    }
}))

// Mouth routers
app.use('/v1/bootcamps', bootcamps);
app.use('/v1/courses', courses);
app.use('/v1/auth', auth);
app.use('/v1/admin', admin);
app.use('/v1/reviews', reviews)

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`.green.underline.bold);
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red.inverse);
    server.close(() => {
        process.exit(1);
    })
});