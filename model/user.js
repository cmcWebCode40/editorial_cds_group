const config = require("../config");
const Joi = require("joi");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const path = require("../path.js");
const Db = require("./dbconnect");

class Users extends Db {

    constructor(req, res) {
        super("users");
        this.req = req;
        this.res = res;
        this.result = "";
        this.err = "";
    }

    async createTable() {
        let cols = ["id  SERIAL PRIMARY kEY", "state_code TEXT", "password TEXT", "permission TEXT", "date TEXT"];
        await super.createTable(cols);
    }


    async createChiefAdmin() {
        let password = config.adminPassword;
        let state_code = config.adminStateCode;
        
        if(!password || !state_code){  
            console.error(`FATAL ERROR: adminPassword or adminStateCode is not set.`);
            process.exit(1);
        }

        const hashedPassword = await this.hashedPassword(password);

        let superUser = await this.allUsers({ condition: `permission = 'SuperUser'` });

        if (!superUser.length) {
            await this.insert(["state_code", "password", "permission", "date"], [config.adminStateCode, hashedPassword, "SuperUser", Date.now()]);
        }
        if(superUser[0].state_code !== state_code) {await this.update({state_code:`${state_code}`}, `permission = 'SuperUser'`)};

        let verifyPassword = await bcrypt.compare( password,  superUser[0].password);
        
        if (!verifyPassword) await this.update({password:`${hashedPassword}`}, `permission = 'SuperUser'`);        
    }

    async superUserId() {
        let superUser = await this.allUsers({ condition: `permission = 'SuperUser'` });
        return superUser[0].id;
    }

    async removeSuperUserIdFromList(list) {
        let id = await this.superUserId();
        let newList = [];
        let me = list.map((e) => { if (eval(e) !== id) newList.push(eval(e)) });
        return newList;
    }


    async allUsers(param) {
        return await super.find(param);
        
    }

    async insert(col, value) {
        await super.insert(col, value);
    }

    async delete(id) {
        await super.delete(id);
    }


    async deleteById(id) {
        await super.deleteById(id);
    }
    async update(value, condition){
        await super.update(value, condition)
    }

    async updateUserById(value, id) {
        await super.updateById(value, id)
    }
    
    generateAuthToken(payload) {
        return jwt.sign(payload, config.jwtPass);
    }

    async adminChangePermission(user) {
        let value = `permission = '${user.permission}'`
        user.id.map(async (id) => await this.updateUserById(id, value));
    }

    error() {
        return this.err;
    }


    validateRegistration(schemaCompare) {
        let pattern = /^([O, Y]{2}\/)([0-9]{2}[A,B,C]\/)([0-9]{4})$/;
        let stateCodeErr = "State code is required and must be of this pattern 'OY/19B/0000'";

        const schema = {
            state_code: Joi.string().regex(pattern).required().error(error => { return { message: stateCodeErr } }),
            password: Joi.string().trim().required(),
            confirm_password: Joi.string().trim().required(),
        };
        let result = Joi.validate(schemaCompare, schema);

        if (!result.error) {
            return true;
        } else {
            this.err = result.error.details[0].message;
            return false;
        }
    }


    redirect(typ, path, message) {
        if (typ == "error") this.req.flash("error", `${(message) ? message : this.error()}`);
        else this.req.flash(typ, message);
        this.res.redirect(path);
    }

    async hashedPassword(password) {
        let salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }


    async register() {
        let { state_code, password, confirm_password } = this.req.body;

        let inputIsValid = this.validateRegistration({ state_code, password, confirm_password });
        if (!inputIsValid) return this.redirect("error", path.signUp);

        let userExist = await this.allUsers({ condition: `state_code = '${state_code}'` });

        if (!!userExist.length) return this.redirect("error", path.signUp, "user already exist");

        let hashedPassword = await this.hashedPassword(password);
      

        await this.insert(["state_code", "password", "permission", "date"], [state_code, hashedPassword, "User", Date.now()]);
        return this.redirect("success", path.signUp, "Your registration was successful")
    }

    // login
    async authenticate() {
        let { state_code, password } = this.req.body;

        let userExist = await this.allUsers({ condition: `state_code = '${state_code}'` });
        if (userExist.length < 1) return this.redirect("error", path.login, "State 1 code or password incorrect");

        let [user] = userExist;

        let verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) return this.redirect("error", path.login, "State  code or password incorrect");

        let id = user.id;
        let permission = user.permission
        state_code = user.state_code

        let token = this.generateAuthToken({ id, permission, state_code });
        this.res.cookie("token", token).status(200);
        return this.redirect("success", path.home, "login successful");
    }





    async adminUpdateUser(input) {
        let { id, action } = input;
        id = await this.removeSuperUserIdFromList(id)
        if (action == "Delete User") {
            id.map(async (e) => await this.deleteById(e));
        }

        if (action == "User") {
            id.map(async (e) => await this.updateUserById({ permission: "User" }, e));
        }

        if (action == "Admin") {
            id.map(async (e) => await this.updateUserById({ permission: "Admin" }, e));
        }
    }

}

module.exports = Users;