
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

const toggleMenu = () => {

    menuBtn.classList.add('close');
    menu.classList.add('show');
    menuNav.classList.add('show');
    headerSection.classList.add('close');
    navItems.forEach(item => item.classList.add('show'));
}


const closeMenu = () => {
    menuBtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    headerSection.classList.remove('close');
    navItems.forEach(item => item.classList.remove('show'));
}
menuBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', closeMenu);


//*********Animation Using Intersection Observer*************//


const cards = document.querySelectorAll('.card-anime');

cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            entry.target.style.animation = `anime 1s linear forwards ${entry.target.dataset.delay}`
        } else {
            entry.target.style.animation = `none`
        }
    })
})

cards.forEach(card => {
    cardObserver.observe(card)
});



//  slicing the news text....
const shortWord = document.querySelector('.short-word');
const shortWordSplit = shortWord.innerText.split(" ");
const outputText = ` ${shortWordSplit.slice(0, 20).join(' ')}......`;

shortWord.innerText = outputText;



