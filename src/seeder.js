const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const User = require('./models/User');
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
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

// Import into db
const importData = async () => {
    try {
        await User.create(users);
        console.log('Users Imported...'.green.inverse);
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
        await Course.deleteMany();
        console.log('Seeder -> Courses deleted...'.yellow);
        await Bootcamp.deleteMany();
        console.log('Seeder -> Bootcamps deleted...'.yellow);
        await User.deleteMany();
        console.log('Seeder -> Users deleted'.yellow);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
    }
}


if (process.argv[2] === '-s') {
    importData();
}
else if (process.argv[2] === '-d') {
    deleteData();
}