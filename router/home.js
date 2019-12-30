const express = require('express');
const router = express.Router();
const User = require("../model/user");

const  Event = require('../model/post');
const  Db = require('../model/dbconnect');


router.get('/', async(req, res)=>{

    let user = new User(req, res);

    let me = await user.allUsers()
    const news = new Event(req, res);
    let newsData = await news.display({orderby:"date"});
    let recentNews = newsData.slice(0,6);
    let olderNews = newsData.slice(7);

    let shuffledOlderNews = olderNews
    .map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
    
    res.render('index.html',  {recentNews:recentNews, olderNews:shuffledOlderNews})
});


module.exports = router;
