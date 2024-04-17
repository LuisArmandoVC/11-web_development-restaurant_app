// trigger side dish
// Arrow function that modify DOM depending if user expands side dish option or not
// DOM modification will affect the SVG arrow by making it downside if accordion element is not expanded. If its expanded then SVG arrow will be up
const triggerSideDish = () => {
    let dish__side = document.querySelector(".dish__side");
    let sideDishArrow = document.querySelector(".sideDishArrow");

    dish__side.classList.toggle('dish__side-active');
    if (dish__side.classList.contains('dish__side-active')) {
        sideDishArrow.style.transform = "rotate(0deg)";
    }
    else
    {
        sideDishArrow.style.transform = "rotate(180deg)";
    }
}
// counter
// arrow fuction that allow users to select specific amount of plates.
// If user clicks on 'increase' it will increase by 1 plate at the time. 
// If user clicks on 'decrease' it will decrease by 1 plate at the time. 
let finalCount = 1;
const counter = (count) => {
    let counting = document.querySelector('#counting');

    if(count == 'increase'){
        finalCount = finalCount + 1;
    }
    else if(count == 'decrease' && finalCount > 1)
    {
        finalCount = finalCount - 1;
    }
    counting.innerHTML = finalCount;
}
//Shopping car logic - previous step before going to checkout
const KEY = '57e826694a4fc7b42aa4797ac13fbe28';
// 1. plate object and plate array definition
plate = {
    name: '',
    amount: '',
    description: '',
    individual_price: '',
    total_price: '',
    side_dish_1: '',
    side_dish_2: '',
    side_dish_3: '',
    side_dish_4: '',
}
let orderArray = [];
// 2. Retrieve data from django & send data to localstorage 
function checkout(e) {
    e.preventDefault();
    fetch(`${window.location.href}get-data`)
        .then(response => response.json())
        .then(data => {
            const nestedData  = JSON.parse(data.data);
            const plateInfo = nestedData[0].fields;
            order = mappingPlateValues(plateInfo);
            encryptArrayLocalStorage = consultData();
            if (encryptArrayLocalStorage == null) {
                orderArray.push(order)
                encryptData = encryptData(orderArray, KEY)
                savingDataResult = savingData('info', encryptData);
                if (savingDataResult) {
                    window.location.href = e.target.href;
                }
                else{
                    window.alert('Ups, parece que hubo un problema, por favor vuelve a intentarlo mas tarde')
                }
            }
            else
            {
                descryptedLocalStorageArray = decryptData(encryptArrayLocalStorage, KEY);
                descryptedLocalStorageArray.push(order);
                encryptData = encryptData(descryptedLocalStorageArray, KEY)
                savingDataResult = savingData('info', encryptData);
                if (savingDataResult) {
                    window.location.href = e.target.href;
                }
                else{
                    window.alert('Ups, parece que hubo un problema, por favor vuelve a intentarlo mas tarde')
                }
            }
        })
        .catch(error => console.error('Ups, parece que hubo un error guardando tu plato'));
}
// 3. Mapping django values with plate obj
function mappingPlateValues(plateInfo) {
    plate = {
        name: plateInfo.dish_name,
        amount: parseInt(document.querySelector('#counting').innerHTML),
        description: plateInfo.dish_description,
        individual_price: 0,
        total_price: 0,
        side_dish_1: plateInfo.dish_side_1,
        side_dish_2: plateInfo.dish_side_2,
        side_dish_3: plateInfo.dish_side_3,
        side_dish_4: plateInfo.dish_side_4,
    }
    if (plateInfo.dish_discounted_price > 1 && plateInfo.dish_discounted_price < plateInfo.dish_regular_price) {
        plate.individual_price = plateInfo.dish_discounted_price
    }
    else{
        plate.individual_price = plateInfo.dish_regular_price
    }
    plate.total_price = plate.individual_price * plate.amount
    return plate
}
// 4. encrypt
function encryptData(order, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(order), key).toString();
}
// 5. decrypt
function decryptData(encryptOrder, key) {
    var bytes = CryptoJS.AES.decrypt(encryptOrder, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
// 6. Consult data from localStorage
function consultData() {
    return localStorage.getItem('info');
}
// 7. Saving data on localstorage
function savingData(plate, encryptOrder) {
    localStorage.setItem(plate, encryptOrder);
    return true;
}

