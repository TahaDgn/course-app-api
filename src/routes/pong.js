const express = require('express');
router = express.Router();

router.get('/pong', (req, res) => {
    res.send({pong : 'pong'});
});

router.get('/pongmaster', (req, res) => {
    res.status(200).json({statusCode : 200 , pong : {success : true, message : 'pong master'}});
});

module.exports = router;