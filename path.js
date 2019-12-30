const pathe = require("path");
module.exports = path={
    home:"/",
    login:"/account/login",
    signUp:"/account/registration",
    about:"/about",
    admin:"/cdsadmin",
    host:"http://localhost:3000",
    gallery:"/gallery",
    contactus:"/contact",
    event:"/event",

    postFolder:pathe.join(__dirname, "public", "img", "post"),
    galleryFolder:pathe.join(__dirname,"public", "img", "gallery"),

    // ADMIN
    adminEvent:"/cdsadmin/event",
}
