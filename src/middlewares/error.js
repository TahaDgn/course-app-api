const ErrorResponse = require('../utils/errorResponse');

/**@type {import('express').Errback} */
const errorHandler = (err, req, res, next) => {

    let error = { ...err };

    error.message = err.message;

    // Mongoose bad object id
    console.log(err.stack.red);
    if (err.name === 'CastError') {
        const message = `Bootcamp can not be found by id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value is entered`;
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server Error',
    });
}

module.exports = {
    errorHandler
}