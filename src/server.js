const express = require('express');
const dotenv = require('dotenv');

// Load env vars...

const app = express();

dotenv.config({path:"./src/config/config.env"});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`);
});



