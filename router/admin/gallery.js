const router = require('express').Router();
const fileUpload = require('express-fileupload');

router.use(fileUpload());


const methodOverride = require('method-override');
router.use(methodOverride('_method'))

const {denyUser} = require('../../middleware/auth');
const Gallery = require('../../model/gallery');



// ************************************************************//
// ***************************ADMIN MODE***********************//
// ************************************************************//


router.post("/", async(req, res)=>{
    const gallery = new Gallery(req, res);
    await gallery.create();
});
router.get('/', [denyUser], async(req, res)=>res.render('admin/gallery.html'));


router.delete("/:id", async(req, res)=>{
    let {id} = req.params;
    const gallery = new Gallery(req, res);
    let galleries = await gallery.display({condition:`id = ${id}`})
    if(!galleries.length) return res.status(404).send("page not found");
    await gallery.deleteById(id);
    req.flash("success",   "Deleted successfully");
    return res.redirect("/");
});



module.exports = router;