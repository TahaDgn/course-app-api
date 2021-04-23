const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/error');
// Mongosee
const connectDB = require('./config/db');
// Load env vars...
dotenv.config({ path: path.join(__dirname, '../.env') }); // Bununla ilgili req sırası sorulacak...

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

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
            'Log'.magenta,
            tokens.method(req, res).magenta,
            tokens.url(req, res).magenta,
            tokens.status(req, res).magenta,
            tokens.res(req, res, 'content-length').magenta, '-'.magenta,
            tokens['response-time'](req, res).magenta, 'MS'.magenta
        ].join(' ')
    }));
}
connectDB();

// File uploading
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

// Static folder
app.use(express.static(path.join(__dirname, './public/uploads')));

// Mouth routers
app.use('/v1/bootcamps', bootcamps);
app.use('/v1/courses', courses);
app.use('/v1/auth', auth);

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