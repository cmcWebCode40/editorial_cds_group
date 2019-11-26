const Joi = require("joi");

const path = require("../path.js");
const Db = require("./dbconnect")


class Comment extends Db{
    
    constructor(req, res){
        super("comment");
        this.req = req;
        this.res = res;
        this.err = "";
    }

    async createTable(){
        let cols = ["id  SERIAL PRIMARY kEY", "postId TEXT", "name TEXT", "comment Text", "date TEXT"];
        await super.createTable(cols);
    }

    async display(param){
        return await super.find(param);  
    }

    async insert(param){
        await super.insertI(param);
    }

    
    error(){
        return this.err
    }

    redirect(typ, path, message){
        if(typ=="error") this.req.flash("error",  `${ (message)? message:this.error()}`);
        else this.req.flash(typ, message);
        this.res.redirect(path);      
    }

    validateComment(schemaCompare){
        const schema = {
            postId:Joi.number().required(),
            name:Joi.string().min(5).required(),
            comment:Joi.string().min(3).required(),  
        };
        return Joi.validate(schemaCompare, schema);
    }


    checkComment(){
        let {name, comment, slugTitle} =this.req.body;
        let {postId} =this.req.params;        
        let result = this.validateComment({postId, name, comment});
        
        if (!result.error){ 
            return {postId, name, comment, slugTitle};
        }else{
            this.err = result.error.details[0].message;
            return {};
        }
    }

    async createComment(){

        let result = this.checkComment();
        let {postId, name, comment} = result;

        if (!Object.keys(result).length) return this.redirect("error", path.event+"/"+result.slugTitle);
        
        await this.insert({postId, name, comment, date:Date.now()});
        return this.redirect("success",  path.event+"/"+result.slugTitle, "successful")     
    }

}

module.exports= Comment;