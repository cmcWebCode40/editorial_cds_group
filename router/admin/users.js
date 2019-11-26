const router = require('express').Router();
const User = require('../../model/user');
const {denyUser} = require('../../middleware/auth');

const fileUpload = require('express-fileupload');
router.use(fileUpload());

// USER
router.post("/", (req, res)=>{
    const user = new User(req, res);
    user.adminUpdateUser(req.body);
});

router.get('/', [denyUser], async(req, res)=>{
    let {userAction}= req.query;
    
    (!!userAction)? userAction = JSON.parse(userAction) : userAction={} 
    
    let permissions = {All:"*", Users:"User", Admin:"Admin", SuperUser:"SuperUser"};
    let counts = [1,2,3,4,5,6,7];

    let selectedCount =userAction.count || counts[5];
    let selectedpermission = userAction.permission || permissions.All;

    let countOption =counts.map((count)=> {
        return {input:`<option value=${count} ${(count==selectedCount)? "selected": ""}>${count}</option>`}
    });

    let permissionOption =Object.keys(permissions).map((key)=> {
        let value = permissions[key]
        return {input:`<option value='${value}' ${(value==selectedpermission)? "selected": ""}>${key}</option>`}
   });

    let querySort, allUsers, userContext;
    const user= new User(req, res);
    if(selectedpermission == "*") { 
        allUsers = await user.allUsers({limit:selectedCount});
    }else{
        allUsers = await user.allUsers({condition:`permission = '${selectedpermission}'`,limit:selectedCount});
    }

    res.render('admin/users.html', {user:allUsers, countOption, permissionOption})

});

module.exports = router;
