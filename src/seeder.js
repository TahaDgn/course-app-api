const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
// Connect to database

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});


// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

// Import into db

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Bootcamps Imported...'.green.inverse);
        await Course.create(courses);
        console.log('Courses Imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
    }
}

// Delete data from db

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log('Bootcamps deleted...'.green.inverse);
        await Course.deleteMany();
        console.log('Courses deleted...'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
    }
}


if (process.argv[2] === '-seed') {
    importData();
}
else if (process.argv[2] === '-delete') {
    deleteData();
}