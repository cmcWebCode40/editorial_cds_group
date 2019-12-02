
// * Scripts for the new version Website 


// ? side Menu Toggle Button

const menuBtn = document.querySelector('.toggle__icon');
const menu = document.querySelector('.side__navbar');
const menuNav = document.querySelector('.side__navbar-content');
const navItems = document.querySelectorAll('.side__navbar-item');
const title = document.querySelector('.landing__page-title ');
const headerSection = document.querySelector('.header__section-head');
const bodyCover = document.querySelector('.body-cover');
const closeBtn = document.querySelector('.closeBtn');


//? initializing the Menu state 

// let displayMenuBar = false;

const toggleMenu = () => {

    menuBtn.classList.add('close');
    menu.classList.add('show');
    menuNav.classList.add('show');
    // title.classList.add('close');
    headerSection.classList.add('close');
    navItems.forEach(item => item.classList.add('show'));
}


const closeMenu = () => {
    menuBtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    // title.classList.remove('close');
    headerSection.classList.remove('close');
    navItems.forEach(item => item.classList.remove('show'));
}



menuBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', closeMenu);

