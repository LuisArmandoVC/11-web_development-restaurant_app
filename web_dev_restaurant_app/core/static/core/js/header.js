// hamburger logic 
var hamburger = document.querySelector(".hamburger");
var enablingMenu = document.querySelector('#menu_content');
var navbar_mobile = document.querySelector('#navbar_mobile');

hamburger.addEventListener("click", function() {
    window.scrollTo(0, 0);
    hamburger.classList.toggle("is-active");
    navbar_mobile.classList.toggle('is-active_mobileMenu');
    enablingMenu.classList.toggle("is-active_content");
});
// Shopping car logic
// 1. Define amount of products of shopping car
products = [];
const KEY_SHOPPING = '57e826694a4fc7b42aa4797ac13fbe28';
// 2. Read localstorage and decrypt content
function decryptData() {
    try {
        let localStorageValue = localStorage.getItem('info');
        let bytes = CryptoJS.AES.decrypt(localStorageValue, KEY_SHOPPING);
        products = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Looks like you got 0 products in shopping car.')
        products.length = 0;
    }
}
// 3. Calculate products length & map product size into shopping car icon
function productsLength(products) {
    const shoppingCarNotificationDesktop = document.querySelector('#shoppingCarNotificationDesktop');
    const shoppingCarNotificationMobile = document.querySelector('#shoppingCarNotificationMobile');
    let amountProducts = products.length;
    shoppingCarNotificationDesktop.innerHTML = amountProducts;
    shoppingCarNotificationMobile.innerHTML = amountProducts;
}
// 4. Call global function
const headerShoppingCar = () => {
    decryptData();
    productsLength(products)
}
document.addEventListener("DOMContentLoaded", headerShoppingCar());