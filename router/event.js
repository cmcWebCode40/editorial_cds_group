const router = require('express').Router();
const  Event = require('../model/post');
const  Comment = require('../model/comment');
const  db = require('../model/dbconnect');


router.get('/:title', async(req, res)=>{  
    const events = new Event(req, res);
    const comment = new Comment(req, res);

    let postComment;
    let {title:slugTitle} = req.params;
    
    let event = await events.display({condition:`slugtitle='${slugTitle}'`});
    
    if(!event.length) return res.status(404).send("page not found")
    else postComment= await comment.display( {condition:`postId='${event[0].id}'`});
    
    res.render('event.html', {event:event[0], comment:postComment});
});

router.post('/comment/:postId', async(req, res)=>{
    const comment = new Comment(req, res);
    await comment.createComment()
});

module.exports = router;