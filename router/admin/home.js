const router = require('express').Router();
const {denyUser} = require('../../middleware/auth');

const User = require('../../model/user');



 router.get('/', [denyUser], async(req, res)=>{
    const user = new User(req, res);
    
    let allUsers = await user.allUsers();
    allUsers = allUsers.length;

    let admin = await user.allUsers({condition:`permission='Admin'`});
    admin=admin.length
    
    let superAdmin = await user.allUsers({condition:`permission='SuperUser'`});
    superAdmin=superAdmin.length


    context = {allUsers, admin, superAdmin}

    res.render('admin/cdsadmin.html', context)
    
});

module.exports = router;