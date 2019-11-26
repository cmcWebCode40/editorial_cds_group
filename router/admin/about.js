const router = require('express').Router();

const methodOverride = require('method-override');
router.use(methodOverride('_method'))

const {denyUser} = require('../../middleware/auth');
const About = require('../../model/about');
// ************************************************************//
// *********************ADMIN MODE <ABOUT>*********************//
// ************************************************************//
router.get('/', [denyUser], async(req, res)=>{
    const about = new About();
    let aboutContext = await about.context();
    res.render('admin/about.html', {about:aboutContext} )
 });
 

router.put("/", (req, res)=>{
    const about = new About(req, res);
    about.updatePage()
});
 
 
module.exports = router;
