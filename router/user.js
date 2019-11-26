const express = require('express');
const User = require("../model/user");
const router = express.Router();

router.get("/registration", async(req, res)=> res.render("registration.html"));

router.post("/registration", async(req, res)=>{
    let user= new User(req, res)
    user.register();    
});


router.get("/login", (req, res)=> res.render("login.html"));

router.post("/login", async(req, res)=>{
    let user = new User(req, res);
    user.authenticate();
});



module.exports = router;