const router = require('express').Router();
const About = require('../model/about');


router.get('/', async(req, res)=>{
    
    const about = new About();
    let aboutPage = await about.display();    
    
    res.render('about.html', await about.context())
});

module.exports = router;
