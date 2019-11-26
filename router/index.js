const express = require('express');
const contact = require('./contact');
const home = require('./home');
const gallery = require('./gallery');
const user = require('./user');
const about = require('./about');
const event = require('./event');

const adminHome = require('./admin/home');
const adminAbout = require('./admin/about');
const adminEvents = require('./admin/event');
const adminGallery = require('./admin/gallery');
const adminUsers = require('./admin/users');
const inbox = require('./admin/contactUsInbox');


module.exports = function(app){
    app.use('/', home );
    app.use('/event', event);
    app.use('/contact', contact);
    app.use('/gallery', gallery);
    app.use('/account', user );
    app.use('/about', about );
    
    app.use('/cdsadmin/about', adminAbout);
    app.use('/cdsadmin/event', adminEvents);
    app.use('/cdsadmin/gallery', adminGallery);
    app.use('/cdsadmin/users', adminUsers);
    app.use('/cdsadmin/inbox', inbox);
    app.use('/cdsadmin', adminHome); //last
    
}

