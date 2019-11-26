const Joi = require("joi");

const path = require("../path.js");
const Db = require("./dbconnect");

class About extends Db{
    
    constructor(req, res){
        super("about");
        this.req = req;
        this.res = res;
        this.err = "";
    }

    async createTable(){
        let cols = ["id  SERIAL PRIMARY kEY", "about TEXT"];
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

    async update(value){
        await super.update(value, this.id);
    }

    async insertDefaultText(){
        let about = await super.find();
        if(!about.length) await this.insert(["about"], ["this is the about page"])
    }


    validate(schemaCompare){
        const schema = {
            about:Joi.string().min(10).required(), 
        };
        let result = Joi.validate(schemaCompare, schema);

        if (!result.error){ 
            return true;
        }else {
            this.err = result.error.details[0].message;
            return false;
        }
    }

    async error(){
        return  await this.err
    }

    
    redirect(typ, path, message){
        if(typ=="error") this.req.flash("error",  `${ (message)? message:this.error()}`);
        else this.req.flash(typ,  message);
        this.res.redirect(path);      
    }
    
    async updatePage(){
        let {about} = this.req.body;

        let isValid = await this.validate({about});
        if(!isValid) return this.redirect("error", path.admin);
        
        await this.update({about});
        return this.redirect("success", path.about, "update was successful")
    }

    async context(){
        let page = await this.display();
        return {about:page[0].about}
    }

}

module.exports = About;
