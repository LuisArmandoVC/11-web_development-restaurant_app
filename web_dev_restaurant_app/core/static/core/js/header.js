var hamburger = document.querySelector(".hamburger");
var enablingMenu = document.querySelector('#menu_content');
var navbar_mobile = document.querySelector('#navbar_mobile');

hamburger.addEventListener("click", function() {




    hamburger.classList.toggle("is-active");
    navbar_mobile.classList.toggle('is-active_mobileMenu');
    enablingMenu.classList.toggle("is-active_content");
});
