const Joi = require("joi");

const path = require("../path.js");
const Db = require("./dbconnect");


class Gallery extends Db{
    
    constructor(req, res){
        super("gallery");
        this.req = req;
        this.res = res;
        this.result ="";
        this.err = "";
    }
    
    async createTable(){
        let cols = ["id  SERIAL PRIMARY kEY", "scr TEXT","text TEXT", "date TEXT"];
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

    async deleteById(id){
        await super.deleteById(id);
    }
    
    error(){
        return this.err
    }

    redirect(typ, path, message){
        if(typ=="error") this.req.flash("error",  `${ (message)? message:this.error()}`);
        else this.req.flash(typ,   message);
        this.res.redirect(path);      
    }



    validate(schemaCompare){
        let imgExts = ["image/jpeg", "image/png"];
        const schema = {
            imagefile:Joi.any().required(),
            mimetype:Joi.string().valid(imgExts).required(),
            text:Joi.string().min(3).required(),  
        };
        let result = Joi.validate(schemaCompare, schema);

        if (!result.error){ 
            return true;
        }else {
            this.err = result.error.details[0].message;
            return false;
        }
    }

    
    checkInput(){
        let {files, body} =this.req;
        if (!files){return this.redirect("error", path.admin, "image is required");}
        let {imagefile, imagefile:{mimetype}, imagefile:{name}} = files;
        let {text} = body;
                
        this.image = imagefile;
        let imageName = `${Math.floor(Math.random() * 1000)}${name}`;
        this.uploadPath = `${path.galleryFolder}/${imageName}`

        
        let result = this.validate({imagefile, mimetype, text});
        if (result){ 
            return {imageName, text}
        }else {
            return {};
        }
        
    }

    
    uploadimage(){ 
        this.image.mv(this.uploadPath, function(err) {
            if (err) return that.res.status(500).send(err);               
        });
    }

    async create(){  
        let result = this.checkInput();
        if (!Object.keys(result).length) return this.redirect("error", path.admin);
        
        let cols = ["scr", "text", "date"];
        let value = Object.values(result);
        value = [...value, Date.now()]
        
        await this.insert(cols, value);
        await this.uploadimage();
        return this.redirect("success", path.gallery, "Your message was sent successfully");
       
    }

}

module.exports = Gallery; 