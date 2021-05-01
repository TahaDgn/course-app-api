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

//ReviewSchema.index({bootcamp : 1 , user : 1}, {unique : true});

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        });
    } catch (error) {
        console.error(error);
    }
}

// Call get average rating after save
ReviewSchema.post('save', function () {
    this.consturctor.getAverageRating(this.bootcamp);
})

// Call get average rating before remove
ReviewSchema.pre('remove', function () {
    this.consturctor.getAverageRating(this.bootcamp);
});


module.exports = mongoose.model('Review', ReviewSchema);