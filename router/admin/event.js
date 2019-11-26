const router = require('express').Router();
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const methodOverride = require('method-override');

router.use(methodOverride('_method'))

const {denyUser} = require('../../middleware/auth');
const Event = require('../../model/post');

// ************************************************************//
// ***************************ADMIN MODE***********************//
// ************************************************************//
router.get('/', async(req, res)=>{
    res.render('admin/events.html')

 });

router.post("/", [denyUser], async(req, res)=>{
    const news = new Event(req, res);
    await news.createPost();
});

router.put("/:id", async(req, res)=>{
    const news = new Event(req, res);
    await news.editPost();
});

router.delete("/:id", async(req, res)=>{
    let {id} = req.params;
    const events = new Event(req, res);
    let event = await events.display({condition:`id='${id}'`});
    if(!event.length) return res.status(404).send("page not found");
    await events.deleteById(id);
    req.flash("success",   "Deleted successfully");
    return res.redirect("/");
});

module.exports = router;