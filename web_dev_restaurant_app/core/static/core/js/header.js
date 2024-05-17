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
}
document.addEventListener("DOMContentLoaded", headerShoppingCar());

// 3. Popup location logic
// 3.1. Custom height for popup__background elemento depending on body height 
window.onload = function() {
    var fullHeightPopupBackground = document.querySelector('.popup__background');
    var bodyHeight = document.body.scrollHeight;
    fullHeightPopupBackground.style.height = bodyHeight + 'px';
}
// 3.2. Autocomplete user address using google services. 
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
// 3.3 Retrieve key information by user.
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

// 3.5 CTA user clicks after introduce location info
// description: This function will hide stage 1 and show stage 2 of location popup


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
        }
        else if (inside && confirmAddressBtn.classList.contains('btn-not-allowed')) {
            confirmAddressBtn.classList.remove('btn-not-allowed');
            confirmAddressBtn.disabled = false;

        }
    }, 350)
}




// 3.4 Print map with coords given by user, add a marker also
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
// 3.6 get current position if user decides it 
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

// 3.6 Go back if user is in stage 2 and wants to modify something else
function goBack() {

    document.querySelector('#autocomplete').value = "";

    const stage__1 = document.querySelector('#stage__1');
    const stage__2 = document.querySelector('#stage__2');
    if (!stage__2.classList.contains('hidden') && stage__1.classList.contains('hidden')) {
        stage__2.classList.add('hidden')
        stage__1.classList.remove('hidden')
    }
}

// 3.8 Confirm address
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

function goBackSt3() {

    document.querySelector('#autocomplete').value = "";


    const stage__1 = document.querySelector('#stage__1');
    const stage__3 = document.querySelector('#stage__3');
    if (!stage__3.classList.contains('hidden') && stage__1.classList.contains('hidden')) {
        stage__3.classList.add('hidden')
        stage__1.classList.remove('hidden')
    }
}

// 3.10 Add user location to local storage
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

// document.addEventListener("itemInserted", checkUserLocation, false);
document.addEventListener('DOMContentLoaded', checkUserLocation());

function checkUserLocation() {
    const headerLocation = document.querySelectorAll('.headerLocation');
    let userLocation = localStorage.getItem('userLocation');
    const userLocationJSON = JSON.parse(userLocation);
    
    for (let i = 0; i < headerLocation.length; i++) {
        headerLocation[i].textContent = userLocationJSON.name;
    }
}



