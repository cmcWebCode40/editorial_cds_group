const flash = require('connect-flash');

module.exports = function(req, res, next){
    res.locals.message = req.flash();
    next();
}

