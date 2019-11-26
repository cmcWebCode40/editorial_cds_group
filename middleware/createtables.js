const About = require("../model/about");
const Contact = require("../model/contact");
const Gallery = require("../model/gallery");
const Post = require("../model/post");
const Comment = require("../model/comment")
const User = require("../model/user");



module.exports = async function(req, res, next){
    const about = new About();
    await about.createTable();
    await about.insertDefaultText()

    const contact = new Contact();
    await contact.createTable();

    const gallery = new Gallery();
    await gallery.createTable();

    const post = new Post();
    await post.createTable();

    const comment = new Comment();
    await comment.createTable();

    const user = new User();
    await user.createTable();
    await user.createChiefAdmin();
    
        
}