




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


// const headerSection = document.querySelector('.header__section-head');
const landingPage = document.querySelector('.landing__page');
const card = document.querySelector('.section-a');
const head = document.querySelector('.head');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            head.classList.remove('add');
        } else {
            head.classList.add('add');
        }
    });

});

observer.observe(headerSection);

const animateCard = document.querySelectorAll('.card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            entry.target.style.animation = `animate 1s ${entry.target.dataset.delay} forwards ease-out  `;
        } else {
            entry.target.style.animation = `none`;
        }
    });

});

animateCard.forEach((anima) => {
    cardObserver.observe(anima);
});





//* Jquery ......... 

$(document).ready(function () {
    path = {
        admin: "/cdsadmin"
    }

    $('#addAdmin, #addSuperAdmin, #addUser, #deleteUser').click(function () {
        let checkedUser = [], data = {};
        $('input:checkbox').map(function () { if (this.checked) { checkedUser.push(this.id); } });

        if (checkedUser.length == 0) { return alert(`Pls choose users to ${$(this).html()}`) }


        data.id = checkedUser;
        data.postType = "updateUser";
        data.action = this.name;
        makePost("/cdsadmin/users", data);
        window.location.href = "/cdsadmin/users";
    });


    function makePost(url, data) {
        let para = {
            headers: { "content-type": "application/json; charset= UTF-8" },
            body: JSON.stringify(data),
            method: "POST"
        };
        fetch(url, para);
    }

    $('#togglePost').click(function () {
        $('#dispayAdminPost').toggle();
        $('button#togglePost').html("Show Post")

    });


    $('#userPermission, #userCount').change(function () {
        let permission = $('#userPermission').val();
        let count = Number($('#userCount').val());
        let query = JSON.stringify({ count, permission })
        window.location.href = `/cdsadmin/users?userAction=${query}`
    });





});





function topNav() {
    document.getElementById('side-nav').classList.toggle('active');
};

function myFunc() {
    alert(this)
    alert("working on it")
}
