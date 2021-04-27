const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a review title'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add a text'],
    },
    rating: {
        type: Number,
        required: [true, 'Please add number of rating between 1-10'],
        min: 1,
        max: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Review', ReviewSchema);