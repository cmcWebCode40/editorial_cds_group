const Joi = require("joi");
const slugify = require('slugify');

const path = require("../path.js");
const Db = require("./dbconnect");

class Event extends Db{
    
    constructor(req, res){
        super("events");
        this.req = req;
        this.res = res;
        this.result ="";
        this.err = "";
    }

    async createTable(){
        let cols = ["id  SERIAL PRIMARY kEY", "title TEXT", "slugtitle TEXT", "scr TEXT", "text TEXT", "date TEXT"];
        await super.createTable(cols);
    }
    
    async display(param){
        return await super.find(param);  
    }

    async insert(col, value){
        await super.insert(col, value);
    }
    
    async deleteById(id){
        await super.deleteById(id);
    }

    async editContext(){
        if(!this.id)return [];
        return await this.display({condition:`'id = ' ${this.id}`})
    }

    async formContext(){
        let form = await this.editContext()
        let {id="", scr="", text="", title="" } = form;
        let submit = (!!form.length)? "Edit Event" : "Insert  Event"
        let action = (!!form.length)? "edit" : "add"
        return {id, scr, text, title, submit, action}
    }

    error(){
        return this.err
    }
 
    uploadimage(){ 
        this.image.mv(this.uploadPath, function(err) {
            if (err) return that.res.status(500).send(err);               
        });
    }

    redirect(typ, path, message){
        if(typ=="error") this.req.flash("error",  `${ (message)? message:this.error()}`);
        else this.req.flash(typ,   message);
        this.res.redirect(path);      
    }
    
    validate(schemaCompare){
        let imgExts = ["image/jpeg", "image/png"];
        const schema = {
            mimetype:Joi.string().valid(imgExts).required(),
            text:Joi.string().min(3).required(),  
            title: Joi.string().min(3).required(),
        };
        return Joi.validate(schemaCompare, schema);
    }
   
    checkPost(){
        let {files, body} =this.req;
        if (!files){return this.redirect("error", path.adminEvent, "image is required");}
        let {imagefile, imagefile:{mimetype}, imagefile:{name}} = files;
        let {text, title, id} = body;

        this.image = imagefile;
        let imageName = `${Math.floor(Math.random() * 1000)}${name}`;
        this.uploadPath = `${path.postFolder+imageName}`

        
        let result = this.validate({mimetype, text, title});
        
        if (!result.error){ 
            return {scr:imageName,  text, title, id};
        }else{
            this.err = result.error.details[0].message;
            return {};
        }
    }

    
    async createPost(){

        let result = this.checkPost();
        if (!Object.keys(result).length) return this.redirect("error", path.adminEvent);
      
        let col = ["scr", "text", "title", "slugtitle", "date"];
        let {scr,text,title} = result;

        let value = [scr, text, title, slugify(title), Date.now()]

        this.uploadimage();
        await this.insert(col, value);
   
        return this.redirect("success", path.adminEvent, "The event was uploaded successfully")     
    }


    async editPost(){
        let result = this.checkPost();
        if(!result) return this.redirect("error", path.adminEvent)
    
        let {scr, text, title, id} = result;
        let values = [scr, text, title, Date.now()]
        let condition = {id}
        this.uploadimage();
        await this.update(values, condition);
        return this.redirect("success", path.adminEvent, "The event was updated successfully");
    }          

}



module.exports= Event;