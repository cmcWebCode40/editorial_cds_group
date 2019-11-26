const jwt = require('jsonwebtoken');
const config = require("../config");
const path = require("../path");


module.exports.permission = function(req, res, next){
    let token = req.cookies.token;
    let isAdmin = false;
    let isLogin = false;
    let isSuperUser = false;

    if(!!token) {
        let user = jwt.verify(token, config.jwtPass);
        let permission = user.permission;
        isLogin = true;

        if(permission == "SuperUser" ||  permission == "Admin")  isAdmin = true;
        
        if(permission == "SuperUser") isSuperUser = true;
    }

    res.locals.isLogin= isLogin;
    res.locals.isSuperUser= isSuperUser;
    res.locals.isAdmin= isAdmin;
    next();        
}


module.exports.denyUser = function(req, res, next){
    let isAdmin = res.locals.isAdmin;   
    if(!isAdmin) return res.status(401).redirect(path.login);
    next();
}