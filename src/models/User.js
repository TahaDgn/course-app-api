const mongoose = require('mongoose');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email',
        ],
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    passwordSalt: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    }
});

// Match user entered password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    const hashedPassword = await bcyrpt.hash(enteredPassword, this.passwordSalt);
    if (hashedPassword === this.password) {
        return true;
    }
    return false;
}

// Signin jwt result
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// Encrypt password before bcyrpt
UserSchema.pre('save', async function () {
    const salt = await bcyrpt.genSalt(10);
    this.password = await bcyrpt.hash(this.password, salt);
    this.passwordSalt = salt;
});

// Reverse populate with virtuals
UserSchema.virtual('bootcamps', {
    ref: 'Bootcamp',
    localField: '_id',
    foreignField: 'user',
    justOne: false,
});
module.exports = mongoose.model('User', UserSchema);