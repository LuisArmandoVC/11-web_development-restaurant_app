// 1 hamburger logic 
var hamburger = document.querySelector(".hamburger");
var enablingMenu = document.querySelector('#menu_content');
var navbar_mobile = document.querySelector('#navbar_mobile');

hamburger.addEventListener("click", function() {
    window.scrollTo(0, 0);
    hamburger.classList.toggle("is-active");
    navbar_mobile.classList.toggle('is-active_mobileMenu');
    enablingMenu.classList.toggle("is-active_content");
});
// 2 Shopping car logic
// 2.1. Define amount of products of shopping car
products = [];
const KEY_SHOPPING = '57e826694a4fc7b42aa4797ac13fbe28';
// 2.2. Read localstorage and decrypt content
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
// 2.3. Calculate products length & map product size into shopping car icon
function productsLength(products) {
    const shoppingCarNotificationDesktop = document.querySelector('#shoppingCarNotificationDesktop');
    const shoppingCarNotificationMobile = document.querySelector('#shoppingCarNotificationMobile');
    let amountProducts = products.length;
    shoppingCarNotificationDesktop.innerHTML = amountProducts;
    shoppingCarNotificationMobile.innerHTML = amountProducts;
}
// 2.4. Call global function
const headerShoppingCar = () => {
    decryptData();
    productsLength(products)
    insertShoppingCarItems();
    insertShoppingCarTotalAmount();
}
document.addEventListener("DOMContentLoaded", headerShoppingCar());



// 3. Popup location logic. You will see same logic order as user completes popup location flow



// 3.1. height for popup__background
// Description: popup__background is a element located on master.html template. It is a hidden black background that appears to contrast popup form with body
//              this function will change its height variably, depending on current body height. TIP: body height might change in home, about, catalog or other landing page
window.onload = function() {
    var fullHeightPopupBackground = document.querySelector('.popup__background');
    var bodyHeight = document.body.scrollHeight;
    fullHeightPopupBackground.style.height = bodyHeight + 'px';
}
// 3.2. Key definitions
// Description: this objects defines a geopositioning polygon which means delivery area on initial project stage, including its bounds. Center means polygon center 
let autocomplete;
const center = { lat: 4.651657, lng: -74.130889 };
const north = center.lat + 0.045;
const south = center.lat - 0.018; 
const west = center.lng - 0.010;  
const east = center.lng + 0.045; 
const polygon = [
    { lat: north, lng: center.lng },
    { lat: center.lat, lng: east },
    { lat: south, lng: center.lng },
    { lat: center.lat, lng: west },
    { lat: north, lng: center.lng },
];
const defaultBounds = {
    north: center.lat + 0.2,
    south: center.lat - 0.2,
    east: center.lng + 0.2,
    west: center.lng - 0.2,
};
// 3.3 auto complete function
// Description: google function that reads popup input (screen #1 - id=autocomplete). It call places services to autocomplete user address based on initial input
function initAutocomplete(){
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
            bounds: defaultBounds,
            strictBounds: false,
            componentRestrictions:{'country': ['CO']},
            fields: ['geometry', 'name']
        }
    );
    autocomplete.addListener('place_changed', onPlaceChanged);
}
// 3.3.1  Definitions & Auxiliar function
// Description: key variables to be mapped in google in order to be confirmed by user (placeLat and placeLng). placeName is helpful to map in frontend so business and user will
//              identify their locations. Place name could be found in header and checkout section
//              auxiliar function "onPlaceChanged" its a google function that triggers once user click on auto completed option. It gave us lat, lng and place name
let placeName;
let placeLat;
let placeLng;
let inside = false;

function onPlaceChanged(){
    place = autocomplete.getPlace();
    if (!place.geometry) {
        console.log('enter a place!');
    }
    else
    {
        placeName = place.name;
        placeLat = place.geometry.location.lat();
        placeLng = place.geometry.location.lng();
    }
}
// 3.4 CTA user clicks after introduce location info
// description: This function will hide stage 1 and show stage 2 of location popup.
function lookForLocation(btnArg) {
    const stage__1 = document.querySelector('#stage__1');
    const stage__2 = document.querySelector('#stage__2');
    
    if (!stage__1.classList.contains('hidden') && stage__2.classList.contains('hidden')) {
        stage__1.classList.add('hidden')
        stage__2.classList.remove('hidden')
    }
    
    if (btnArg == 'autoComplete') {
        initMap();
    }
    else
    {
        currentPosition();
    }
    const confirmAddressBtn = document.querySelector('.confirmAddressBtn');
    setTimeout(()=> {
        if(!inside)
        {
            confirmAddressBtn.classList.add('btn-not-allowed');
            confirmAddressBtn.disabled = true;
            let outDeliveryZone = document.querySelector('#outDeliveryZone');
            const errorMessageoutDeliveryZone = document.createElement("div");
            errorMessageoutDeliveryZone.classList.add("error-text");
            errorMessageoutDeliveryZone.innerHTML = 
            `
                <p class="error-text_element mt-5">Ups! Parece que no tenemos cobertura en esta dirección. No te preocupes, agrega otra dirección mientras trabajamos duro para cubrir tu área!</p>
            `
            outDeliveryZone.appendChild(errorMessageoutDeliveryZone);
        }
        else if (inside && confirmAddressBtn.classList.contains('btn-not-allowed')) {
            confirmAddressBtn.classList.remove('btn-not-allowed');
            confirmAddressBtn.disabled = false;
            let outDeliveryZone = document.querySelector('#outDeliveryZone');
            outDeliveryZone.innerHTML="";
        }
    }, 350)
}
// 3.5 Print map with coords given by user, add a marker also
// Description: this function will execute only if user decides to use autocomplete options (it triggers if user clicks in magnifying glass icon)
function initMap() {
    centerUser = { lat: placeLat, lng: placeLng };
    location__name = document.querySelector('#location__name');
    location__name.innerHTML = placeName.toString();
    let map = new google.maps.Map(document.getElementById('map'), {
        center: centerUser,
        zoom: 15
    });
    var marker = new google.maps.Marker({
        position: centerUser,
        map: map,
        title: 'Mi Ubicación'
    });
    if (pointInPolygon(centerUser, polygon)) {
        inside = true;
    }
    else
    {
        inside = false;
    }
}
// 3.6 get current position & print them in google maps
// Description: this function triggers if user clicks on "Usar mi ubicacion" which means did not use autocomplete option but we read user location through browser. 
//              then, we use geocode google services to translate coords into map location
function currentPosition() {
    navigator.geolocation.getCurrentPosition(showPosition,showError);
}
async function showPosition(position) {
    placeLat = position.coords.latitude;
    placeLng = position.coords.longitude;
    let latlng = `${placeLat},${placeLng}`
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=AIzaSyAm7duhLPL5kqqtkOHH1qWEmaX0oU9a2NQ";
    let centerUser = { lat: placeLat, lng: placeLng };
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener la respuesta de la API');
        }
        const data = await response.json();
        placeName = data.results[0].formatted_address;
    } 
    catch (error) {
        console.error('Error durante el proceso:', error);
    }
    location__name = document.querySelector('#location__name');
    location__name.innerHTML = placeName.toString();
    let map = new google.maps.Map(document.getElementById('map'), {
        center: centerUser,
        zoom: 15
    });
    var marker = new google.maps.Marker({
        position: centerUser,
        map: map,
        title: 'Mi Ubicación'
    });
    if (pointInPolygon(centerUser, polygon)) {
        inside = true;
    }
    else
    {
        inside = false;
    }
}
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
        console.log("El usuario denegó la solicitud de geolocalización.");
        break;
        case error.POSITION_UNAVAILABLE:
        console.log("La información de ubicación no está disponible.");
        break;
        case error.TIMEOUT:
        console.log("Se ha agotado el tiempo para obtener la ubicación del usuario.");
        break;
        case error.UNKNOWN_ERROR:
        console.log("Ocurrió un error desconocido al obtener la ubicación.");
        break;
    }
}
// 3.7 ray-casting algorithm
// Description: this algorithm reads delivery zone and user location. If user is in geo polygon then, we enable continue button. If not, then continue button will be disabled
function pointInPolygon(point, polygon) {
    const x = point.lat, y = point.lng;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat, yi = polygon[i].lng;
        const xj = polygon[j].lat, yj = polygon[j].lng;
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
// 3.8 Go back if user is in stage 2 and wants to modify something else
function goBack() {
    document.querySelector('#autocomplete').value = "";
    const stage__1 = document.querySelector('#stage__1');
    const stage__2 = document.querySelector('#stage__2');
    if (!stage__2.classList.contains('hidden') && stage__1.classList.contains('hidden')) {
        stage__2.classList.add('hidden')
        stage__1.classList.remove('hidden')
    }
}
// 3.9 Confirm address
// description: This function will hide stage 2 and show stage 3 of location popup.
function saveAddress() {
    if (inside) {
        const stage__2 = document.querySelector('#stage__2');
        const stage__3 = document.querySelector('#stage__3');
        const location__name_stage3 = document.querySelector('#location__name_stage3');
        location__name_stage3.innerHTML = placeName.toString();
        if (!stage__2.classList.contains('hidden') && stage__3.classList.contains('hidden')) {
            stage__2.classList.add('hidden')
            stage__3.classList.remove('hidden')
        }
    }
}
// 3.10 Go back from stage 3 to stage 1
// description: This function will hide stage 3 and show stage 1 of location popup.
function goBackSt3() {
    document.querySelector('#autocomplete').value = "";
    const stage__1 = document.querySelector('#stage__1');
    const stage__3 = document.querySelector('#stage__3');
    if (!stage__3.classList.contains('hidden') && stage__1.classList.contains('hidden')) {
        stage__3.classList.add('hidden')
        stage__1.classList.remove('hidden')
    }
}
// 3.11 Add user location to local storage
// Description: once everything is set up, we save user location information in local storage and close popup
function completeAddressProcess(){
    details = document.querySelector('#addressDescription').value;
    userLocation = {
        'name': placeName,
        'addressDetails': details,
        'lat': placeLat,
        'lng': placeLng,
        'inside': inside
    }
    localStorage.setItem("userLocation", JSON.stringify(userLocation));
    checkUserLocation();
    closePopup();
}
// 3.12 Close and open popups function. These functions will handle all DOM logic related to open and close location popup
function closePopup() {
    popup = document.querySelector('.dialog');
    popup__background = document.querySelector('.popup__background');
    if (!popup__background.classList.contains('hidden') && !popup.classList.contains('popupClosed')) {
        popup.classList.add('popupClosed');
        popup__background.classList.add('hidden');
        popup__background.style.height = 0 + 'px';
    }
}
function openPopup() {
    popup = document.querySelector('.dialog');
    popup__background = document.querySelector('.popup__background');
    if (popup__background.classList.contains('hidden') && popup.classList.contains('popupClosed')) {
        popup.classList.remove('popupClosed');
        popup__background.classList.remove('hidden');
        var bodyHeight = document.body.scrollHeight;
        popup__background.style.height = bodyHeight + 'px';
    }
}
// 3.13 paint user location in all frontend spaces that uses ".headerLocation" class
document.addEventListener('DOMContentLoaded', checkUserLocation());

function checkUserLocation() {
    const headerLocation = document.querySelectorAll('.headerLocation');
    let userLocation = localStorage.getItem('userLocation');
    if (userLocation) {
        const userLocationJSON = JSON.parse(userLocation);
        
        for (let i = 0; i < headerLocation.length; i++) {
            headerLocation[i].textContent = userLocationJSON.name;
        }
    }
}

// 4. Shopping car
// 4.1 Reading products and inyecting info in shopping car DOM. This fuction will be call in step 2.4 as part of global (main thread) call 
function insertShoppingCarItems() {
    let currentURL = new URL(location.href);
    let host = currentURL.origin;
    let shoppingCarItems = document.querySelector('#shoppingCarItems');
    products.forEach(product => {
        shoppingCarItems.innerHTML += `
        <div class="flex items-center shopping_car-shadows">
            <img style="width: 76px; height: 76px;" src="${host}/media/${product.dish_image_preview}" alt="${product.name}" />
            <div>
                <div>
                    <p class="font-bold text-mobile-paragraph-standard lg:text-desktop-paragraph-standard">${ product.name }</p>
                    <p class="mt-3 text-mobile-paragraph-standard lg:text-desktop-paragraph-standard">${ product.description }</p>
                </div>
                <div class="flex items-center gap-3 mt-4 shopping_car-price">
                    <p class="text-primary font-bold text-mobile-paragraph-standard lg:text-desktop-paragraph-standard">$${ product.individual_price }</p>
                    <div class="flex items-center justify-center gap-3">
                        <div onclick="counterShoppingCar('decrease', '${product.name.replace(/\s+/g, '_')}', '${product.name}')">
                            <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6M10 11V17M14 11V17" stroke="#FD7400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                                        
                        </div>
                        <p id="${product.name.replace(/\s+/g, '_')}" class="" data-label="${product.name }">${ product.amount }</p>
                        <div onclick="counterShoppingCar('increase', '${product.name.replace(/\s+/g, '_')}', '${product.name}')">
                            <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M12 5V19" stroke="#FD7400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    });
}
// 4.2 Inserting total amount in DOM
function insertShoppingCarTotalAmount() {
    let shoppingCarTotalAmount = document.querySelector('#shopping_car--total');
    let purchaseAmount = 0;
    try {
        products.forEach(product => {
            purchaseAmount += product.total_price
        });
    } catch (error) {
        purchaseAmount = 0;
    }
    shoppingCarTotalAmount.innerHTML = purchaseAmount;
}
// 4.3 
const counterShoppingCar = (countType, counterObj, objName) => {
    decryptData()
    let counting = document.querySelector('#' + counterObj);
    let finalCount = parseInt(counting.innerHTML); 
    if(countType == 'increase'){
        finalCount = finalCount + 1;
        const itemModified = products.find(itemModified => itemModified.name === objName);
        itemModified.amount = itemModified.amount + 1;
        itemModified.total_price = itemModified.amount * itemModified.individual_price;
        modifyProductsArray = CryptoJS.AES.encrypt(JSON.stringify(products), KEY_SHOPPING).toString();
        localStorage.setItem("info", modifyProductsArray);
        insertShoppingCarTotalAmount();
    }
    else if(countType == 'decrease' && finalCount > 1)
    {
        finalCount = finalCount - 1;
        const itemModified = products.find(itemModified => itemModified.name === objName);
        itemModified.amount = itemModified.amount - 1;
        itemModified.total_price = itemModified.amount * itemModified.individual_price;
        modifyProductsArray = CryptoJS.AES.encrypt(JSON.stringify(products), KEY_SHOPPING).toString();
        localStorage.setItem("info", modifyProductsArray);
        insertShoppingCarTotalAmount();
    }
    else if(countType == 'decrease' && finalCount == 1)
    {
        const itemModified = products.find(itemModified => itemModified.name === objName);
        let index = products.indexOf(itemModified);
        products.splice(index, 1);
        modifyProductsArray = CryptoJS.AES.encrypt(JSON.stringify(products), KEY_SHOPPING).toString();
        localStorage.setItem("info", modifyProductsArray);
        document.querySelector('#shoppingCarItems').innerHTML = "";
        productsLength(products);
        insertShoppingCarItems();
        insertShoppingCarTotalAmount();
    }
    counting.innerHTML = finalCount;
}
// 4.4 Open or close car shopping 
const carShoppingToggle = () => {
    let carShoppingState = document.querySelector('.animated-shopping_car');
    // carShoppingState.classList.toggle('show');

    if (carShoppingState.classList.contains('show')) {
        carShoppingState.classList.remove('show');
        carShoppingState.classList.add('hide');
        
        carShoppingState.addEventListener('animationend', function() {
            carShoppingState.classList.remove('hide');
            carShoppingState.style.visibility = 'hidden';
        }, { once: true });
    } else {
        carShoppingState.style.visibility = 'visible';
        carShoppingState.classList.add('show');
    }
}
// 4.5 clearShoppingCarPopup
const clearShoppingCarPopup = () => {
    let shopping_carArticle = document.querySelector('#shopping_carArticle');
    let deleteConfirmation = document.querySelector('#deleteConfirmation');
    shopping_carArticle.classList.toggle('shopping_car-hidden_content');
    if (deleteConfirmation.classList.contains('hidden')) {
        deleteConfirmation.classList.remove('hidden');
        deleteConfirmation.classList.add('flex');
    }
}
// 4.6 Clear shopping car 
const clearShoppingCar = () => {
    localStorage.removeItem('info');
    localStorage.removeItem('checkout');
    let shoppingCarItems = document.querySelector('#shoppingCarItems');
    let shoppingCarTotalAmount = document.querySelector('#shopping_car--total');
    const shoppingCarNotificationDesktop = document.querySelector('#shoppingCarNotificationDesktop');
    const shoppingCarNotificationMobile = document.querySelector('#shoppingCarNotificationMobile');
    shoppingCarItems.innerHTML = "";
    shoppingCarTotalAmount.innerHTML = 0;
    shoppingCarNotificationMobile.innerHTML = 0;
    shoppingCarNotificationDesktop.innerHTML = 0;

    let shopping_carArticle = document.querySelector('#shopping_carArticle');
    let deleteConfirmation = document.querySelector('#deleteConfirmation');
    shopping_carArticle.classList.toggle('shopping_car-hidden_content');
    if (deleteConfirmation.classList.contains('flex')) {
        deleteConfirmation.classList.remove('flex');
        deleteConfirmation.classList.add('hidden');
    }
}
// 4.7 cancel empty action 
const cancelShoppingCarCleaning = () => {
    let shopping_carArticle = document.querySelector('#shopping_carArticle');
    let deleteConfirmation = document.querySelector('#deleteConfirmation');
    shopping_carArticle.classList.toggle('shopping_car-hidden_content');
    if (deleteConfirmation.classList.contains('flex')) {
        deleteConfirmation.classList.remove('flex');
        deleteConfirmation.classList.add('hidden');
    }
}



