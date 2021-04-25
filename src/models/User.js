const mongoose = require('mongoose');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
        enum: ['admin', 'user', 'publisher'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    passwordSalt: {
        type: String,
        select: false,
    },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetPasswordExpire: {
        type: Date,
        select: false,
    },
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

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

// Encrypt password before bcyrpt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
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

UserSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'user',
    justOne: false,
});

// Cascade delete courses when a bootcamp is deleted
UserSchema.pre('remove', async function (next) {

    await this.model('Bootcamp').find({ user: this._id })
        .then(users => users.forEach(element => element.remove()));

    next();
});



module.exports = mongoose.model('User', UserSchema);