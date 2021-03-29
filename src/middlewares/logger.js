// @desc Logs request to console
exports.logger = (req , res , next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}