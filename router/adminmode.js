const router = require('express').Router();
const fileUpload = require('express-fileupload');
const {denyUser} = require('../middleware/auth');
const path = require('../path')

const About = require('../model/about');
const User = require('../model/user');
const News = require('../model/post');
const Gallery = require('../model/gallery');

router.use(fileUpload());


 router.get('/', async(req, res)=>{
    let {deleteEvent, deleteGallery, userAction}= req.query;
    
    (!!userAction)? userAction = JSON.parse(userAction) : userAction={} 
    
    let permissions = {All:"*", Users:"User", Admin:"Admin", SuperUser:"superUser"};
    let counts = [1,2,3,4,5,6,7];

    let selectedCount =userAction.count || counts[0];
    let selectedpermission = userAction.permission || permissions.All;

    let countOption =counts.map((count)=> {
        return {input:`<option value=${count} ${(count==selectedCount)? "selected": ""}>${count}</option>`}
    });

    let permissionOption =Object.keys(permissions).map((key)=> {
        let value = permissions[key]
        return {input:`<option value='${value}' ${(value==selectedpermission)? "selected": ""}>${key}</option>`}
   });

   
    // user
    let querySort, allUsers, userContext;
    const user= new User(req, res);
    if(selectedpermission == "*") { 
        allUsers = await user.allUsers({limit:selectedCount});
    }else{
        allUsers = await user.allUsers({condition:`permission = '${selectedpermission}'`,limit:selectedCount});
    }
    userContext={user:allUsers, countOption, permissionOption};


    

    // events
    let newsData, newsContext, value;
    const news = new News(req, res);
    newsData = await news.display();
    value = await news.formContext();
    if(deleteEvent){
        await news.deleteById(deleteEvent);
        return res.redirect(path.admin); 
    }
    newsContext={news:newsData, value};
    
    // About
    const about = new About();
    let aboutContext
    aboutContext = await about.context();

    // // gallery
    const gallery = new Gallery(req, res);
    if(deleteGallery){
        await gallery.deleteById(deleteGallery);
        return res.redirect(path.admin); 
    }
    galleries = await  gallery.display();
    
    context={
        about:aboutContext,  
        userContext:userContext, 
        newsContext:newsContext,
        gallery:galleries
    };
    res.render('admin/cdsadmin.html', context)
});
  





router.post('/', async(req, res)=>{
    let input  = req.body;

    if(input.postType === 'updateUser'){
        const user = new User(req, res);
        user.adminUpdateUser(input);
    }
  
    if(input.reqName === "Update about page"){ 
        const about = new About(req, res);
        about.updatePage() 
    }
      
    if(input.reqName === "Insert Event"){
        const news = new News(req, res);
        news.createPost()
    }

    if(input.reqName === "Edit Event"){ 
        const news = new News(req, res);
        news.editPost();
    }

    if(input.reqName === "Insert gallery"){     
        const gallery = new Gallery(req, res);
        gallery.create();
    }

});

module.exports = router;