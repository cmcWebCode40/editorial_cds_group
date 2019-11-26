const router = require('express').Router();


const {denyUser} = require('../../middleware/auth');
const ContactUs = require('../../model/contact');
// ************************************************************//
// *********************ADMIN MODE <ABOUT>*********************//
// ************************************************************//
router.get('/', [denyUser], async(req, res)=>{
    const contactUs = new ContactUs();
    let inbox = await contactUs.display();
    console.log(inbox)
    res.render('admin/contactUs.html', {inbox} )
 });
 
module.exports = router;