const router = require('express').Router();
const Gallery = require('../model/gallery');


router.get('/', async(req, res)=>{
    const gallery = new Gallery(req, res);
    galleries = await  gallery.display();
    
    res.render('gallery.html', {gallery:galleries})
});

module.exports = router;




