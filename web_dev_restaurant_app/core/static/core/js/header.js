var hamburger = document.querySelector(".hamburger");
var enablingMenu = document.querySelector('#menu_content')

hamburger.addEventListener("click", function() {




    hamburger.classList.toggle("is-active");
    enablingMenu.classList.toggle("is-active_content");
});
