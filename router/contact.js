const router = require('express').Router();
const ContactMessage = require('../model/contact');

router.get('/', async(req, res)=>{
    const message = new ContactMessage(req, res);
    res.render('contact.html')
});


router.post('/', async(req, res)=>{
    const message = new ContactMessage(req, res);
    await message.sendContactMessage();
});

module.exports = router;