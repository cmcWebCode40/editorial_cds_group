const Joi = require("joi");
const path = require("../path.js");

const Db = require("./dbconnect")


class ContactMessage extends Db{
    
    constructor(req, res){
        super("contactmessage");
        this.req = req;
        this.res = res;
        this.result ="";
        this.err = "";
    }

    async createTable(){
        let cols = ["id  SERIAL PRIMARY kEY", "name TEXT", "stateCode TEXT", "email TEXT", "pnumber TEXT", "message TEXT", "date TEXT" ];
        await super.createTable(cols);
    }
    
    async display(param){
        return await super.find(param);  
    }

    async insert(col, value){
        await super.insert(col, value);
    }
    
    async delete(id){
        await super.delete(id);
    }


    
    validate(schemaCompare){
        let schema = {
            name:Joi.string().min(3).required(),
            stateCode:Joi.string().required(),
            email:Joi.string().email().required(),
            pnumber:Joi.number().required(), 
            message:Joi.string().required(),
        }; 
        let result = Joi.validate(schemaCompare, schema);

        if (!result.error){ 
            return result.value;
        }else {
            this.err = result.error.details[0].message;
            result = {};
        }
        return result;
    }

    
    error(){
        return this.err
    }

    redirect(typ, path, message){
        if(typ=="error") this.req.flash("error",  `${ (message)? message:this.error()}`);
        else this.req.flash(typ,   message);
        this.res.redirect(path);      
    }


    async sendContactMessage(){
        let {name, stateCode, email, pnumber, message}=this.req.body
        let result= this.validate({name, stateCode, email, pnumber, message});

        if (!!Object.keys(result).length) { 
            let cols = ["name", "stateCode", "email", "pnumber", "message", "date"];

            let value = Object.values(result);
            value = [...value, Date.now()]
            
            await this.insert(cols, value);
            return this.redirect("success", path.contactus, "Your message was sent successfully");
        }else{
            return this.redirect("error", path.contactus);
        }
    }

}

module.exports = ContactMessage;

