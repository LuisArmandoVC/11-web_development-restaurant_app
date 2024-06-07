
// TODO: CAMBIAR TODAS LAS KEY QUEMADAS CON VARIABLES DE ENTORNO

// How to calculate order summary  
// 1. Definitions
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
const KEY = '57e826694a4fc7b42aa4797ac13fbe28';
products = [];
paymentType = "online";
discountCuponValue = 0;
// 2. Find discount form Y position. It's reading cupon label which is same as input fields
const rect = document.querySelector('.cuponLabel').getBoundingClientRect();
const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("scrollPosition", (rect.top + scrollTop)*0.8);
})
// 2. Read localstorage and decrypt content
function decryptData() {
    try {
        let localStorageValue = localStorage.getItem('info');
        let bytes = CryptoJS.AES.decrypt(localStorageValue, KEY);
        products = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Looks like you got 0 products in shopping car.')
        products.length = 0;
    }
}
// 3. Local storage validation: If localStorage is empty, then products.length == 0. It means we need to redirect user
function validationProducts(productsLength) {
    if (productsLength == 0) {
        document.querySelector('h1').innerHTML = 'Ups, parece que no hay productos en tu carrito. Te vamos a redireccionar a nuestro catalogo de comidas';
        setTimeout( () => {
            window.location.href = '/catalogo/'
        } , 5000)
    }
}
// 4. Check all items + calculate shipping car total
function calculateTotal(platesArray) {
    let total = 0;
    platesArray.forEach(plate => {
        total += plate.total_price
    });
    return total
}
// 5. Once everything is calculated this function will proceed to map everything up
function mappingDOM(total, serviceFee, shippingCost, tip, discount) {
    let tipDefault = 0;
    let discountDefault = 0;
    document.querySelector('.productCosts').innerHTML = `$${total}`;
    document.querySelector('.serviceFeeCosts').innerHTML = `$${serviceFee}` ;
    document.querySelector('.shippingCost').innerHTML =  `$${shippingCost}`;
    if (tip != undefined) {
        tipDefault = tip
        //Execution block for summary component
        let summaryTip = document.querySelector('.summaryTip');
        let summaryTipBlock = document.querySelector('.summaryTipBlock');
        summaryTip.innerHTML=`$${tip}`
        if (summaryTipBlock.classList.contains('hidden')) {
            summaryTipBlock.classList.remove('hidden');
            summaryTipBlock.classList.add('flex');
        }
        //Execution block for detail view popup component
        let tipDetail = document.querySelector('.tipDetail');
        let tipDetailBlock = document.querySelector('.tipDetailBlock');
        tipDetail.innerHTML=`${tip}`
        if (tipDetailBlock.classList.contains('hidden')) {
            tipDetailBlock.classList.remove('hidden');
            tipDetailBlock.classList.add('flex');
        }
    }
    if (discount != undefined) {
        discountDefault = discount
        //Execution block for summary component
        let discountSummary = document.querySelector('.discountSummary');
        let discountSummaryBlock = document.querySelector('.discountSummaryBlock');
        discountSummary.innerHTML=`-$${discount}`
        if (discountSummaryBlock.classList.contains('hidden')) {
            discountSummaryBlock.classList.remove('hidden');
            discountSummaryBlock.classList.add('flex');
        }
        //Execution block for detail component
        let discountDetail = document.querySelector('.discountDetail');
        let discountDetailBlock = document.querySelector('.discountDetailBlock');
        discountDetail.innerHTML=`${discount}`
        if (discountDetailBlock.classList.contains('hidden')) {
            discountDetailBlock.classList.remove('hidden');
            discountDetailBlock.classList.add('flex');
        }
    }
    document.querySelector('.orderTotal').innerHTML =  `$${total + serviceFee + shippingCost + tipDefault - discountDefault}`;
    document.querySelector('.totalDetail').innerHTML =  `${total + serviceFee + shippingCost + tipDefault - discountDefault}`;
    document.querySelector('.preTotalDetail').innerHTML =  `${total + serviceFee + shippingCost + tipDefault - discountDefault}`;
    const finalTotal = total + serviceFee + shippingCost + tipDefault - discountDefault;
    encryptFinalTotal = encryptData(finalTotal, KEY);
    savingDataResult = savingData('checkout', encryptFinalTotal);
}
// 6. Apply submit button logic based on payment method selected by user
function listenPaymentMethod() {
    let checkboxes = document.querySelectorAll("input[name=payment_type]");
    const cash = document.querySelector('#cash');
    const online_payment = document.querySelector('#online_payment');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            if (cash.checked == checkbox.checked) {
                paymentType = 'cash';
            }
            else
            {
                paymentType = 'online';
            }
        })
    });
}
// 7.
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// 8. Global function for checkout page. It will execute step by step all functions above
const checkoutFunction = () => {
    decryptData();
    validationProducts(products.length)
    total = calculateTotal(products);
    mappingDOM(total, 2000, 2000, undefined, undefined);
    listenPaymentMethod();
}
document.addEventListener("DOMContentLoaded", checkoutFunction());


const clickingPayment = () => {
    const encryptedPurchaseAmount = localStorage.getItem('checkout');
    let purchaseAmount = 0;
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedPurchaseAmount, KEY);
        purchaseAmount = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        purchaseAmount = 1000000;
    }
    if(purchaseAmount == 1000000 || purchaseAmount == 0)
    {
        return location.href = '/checkout-error';
    }
    //If purchase amount is not affected or got a proper value, then lets retrieve delivery dates & delivery address
    // Initial input validation
    let inputsValidation = checkInputs();
    if (inputsValidation) {
        const fullname = document.querySelector('#fullname').value;
        const email = document.querySelector('#email').value;
        const phonenumber = document.querySelector('#phonenumber').value;
        const extraAddressInfo = document.querySelector('#extraAddressInfo').value;
        const instructions = document.querySelector('#instructions').value;
        purchaserInfo = {
            fullname: fullname ? fullname : 'no hay información del nombre del usuario',
            email: email ? email : 'no hay información del nombre del correo electronico del usuario',
            phonenumber: phonenumber ? phonenumber : 'no hay información del número de telefono del usuario',
            extraAddressInfo: extraAddressInfo ? extraAddressInfo : 'no hay información de la información complementaria de la dirección del usuario',
            instructions: instructions ? instructions : 'no hay instrucciones de entrega',
        }
    }
    else
    {
        if(document.querySelector('.error-text') != undefined){
            document.querySelector('.error-text').remove();
        }
        const errorMessageElement = document.createElement("div");
        errorMessageElement.classList.add("error-text")
        errorMessageElement.innerHTML = 
        `
            <p class="error-text_element mb-5">Parece que faltó completar algunos de los siguientes campos: </p>
            <p class="error-text_element">Nombre y apellido</p>
            <p class="error-text_element">Correo electrónico</p>
            <p class="error-text_element">Celular</p>
            <p class="error-text_element">Información complementaria</p>
        `

        const summaryDesktop = document.querySelector('#summaryDesktop');
        summaryDesktop.appendChild(errorMessageElement);
    }

    if (paymentType == 'cash') {
        fetch('/catalogo/confirmacion-c', {
            method: "POST",
            // redirect: 'manual',
            body: JSON.stringify({
                "products": products,
                "purchaseAmount": purchaseAmount,
                "purchaserInfo": purchaserInfo,
            }),
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken')
            }
        }).then(
            function(response) {
                if (response.status == 200 ) {
                    localStorage.removeItem('checkout');
                    localStorage.removeItem('info');
                    window.location.href = response.url;
                }
                else
                {
                    location.href = '/checkout-error';
                }
            }
        )
    }
    // else
    // {
    //     let checkout = new WidgetCheckout({
    //         currency: 'COP',
    //         amountInCents: (purchaseAmount)*100,
    //         reference: 'AD002901221',
    //         publicKey: 'pub_test_EIhIc63dgvz2lfsuTHPYc2nrvQ1w99yS',
    //         signature: {
    //             integrity : 'AD0029012211900000COPtest_integrity_7rD2EF8lMk9jtW8hJHViyzOLNjNf4Vqd'
    //         },
    //         redirectUrl: 'https://transaction-redirect.wompi.co/check', 
    //     })
    //     checkout.open(function (result) {
    //         var transaction = result.transaction;
    //         console.log("Transaction ID: ", transaction.id);
    //         console.log("Transaction object: ", transaction);
    //     });
    // }


}

function checkInputs() {
    const fullname = document.querySelector('#fullname').value;
    const email = document.querySelector('#email').value;
    const phonenumber = document.querySelector('#phonenumber').value;
    const extraAddressInfo = document.querySelector('#extraAddressInfo').value;
    if (!(fullname == '') && !(email == '') && !(phonenumber == '') && !(extraAddressInfo == '')) {
        return true;
    }
}

// 7. Modify discount coupon value if backend throws success
function discount(coupon, isActive, value, maxValue, type, createdAt) {
    total = calculateTotal(products);
    if (isActive != 'True') {
        throw "Coupon is not active"
    }
    if(value > maxValue && type=="pesos_colombianos"){
        discountCuponValue = maxValue;
    }
    else if(((total+4000)*(value/100)) > maxValue && type=="porcentaje"){
        discountCuponValue = maxValue;
    }
    else if(((total+4000)*(value/100)) < maxValue && type=="porcentaje"){
        discountCuponValue = (total+4000)*(value/100);
    }
    else if(type=="envio_gratuito"){
        discountCuponValue = 4000;
    }
    else{
        discountCuponValue = value;
    }
    mappingDOM(total, 2000, 2000, undefined, discountCuponValue);
}
// 8. List all saved products in detail popup
// 8.1. Read DOM detail popup view and insert products
document.addEventListener("DOMContentLoaded", () => {
    let subtotalProducts = document.querySelector('#subtotalProducts');
    products.forEach(product => {
        let productAmount = product.amount;
        let productName = product.name;
        let productPrice = product.individual_price;
        subtotalProducts.innerHTML += `
            <div class="mt-5 flex items-start justify-between">
                <p>(${ productAmount }) - ${ productName }</p>
                <div class="flex items-center">
                    <span>$</span><p>${ productPrice }</p>
                </div>
            </div>
        `
    });
    subtotalProducts.innerHTML += `
        <div class="mt-5 flex items-start justify-between font-bold">
            <p>Subtotal de productos</p>
            <div class="flex items-center">
                <span>$</span><p>${calculateTotal(products)}</p>
            </div>
        </div>
    `
});
// 9. Click functions 
// 9.1 Display tooltip if user want to change address in checkout page
const addressTooltip = () => {
    let infoSvg = document.querySelector('.infoAddress');
    if(infoSvg.classList.contains('hidden'))
    {
        infoSvg.classList.remove('hidden');
        infoSvg.classList.add('flex');
    }
    else
    {
        infoSvg.classList.add('hidden');
        infoSvg.classList.remove('flex');
    }
}
// 9.2 Last whim functionalities (counting & triggering)
const counter = (countType, counterObj) => {
    let counting = document.querySelector('#' + counterObj);
    let finalCount = parseInt(counting.innerHTML); 
    if(countType == 'increase'){
        finalCount = finalCount + 1;
    }
    else if(countType == 'decrease' && finalCount > 0)
    {
        finalCount = finalCount - 1;
    }
    counting.innerHTML = finalCount;
}
const lastWhimAdd = () => {
    plates = document.querySelectorAll('.lastWhimItemCounting');
    plates.forEach(plate => {
        if (parseInt(plate.innerHTML) > 0) {
            fetch(`/catalogo/${plate.getAttribute('data-label')}/get-data`)
            .then(response => response.json())
            .then(data => {
                const nestedData  = JSON.parse(data.data);
                const plateInfo = nestedData[0].fields;
                const amount = parseInt(plate.innerHTML);
                order = mappingPlateValues(plateInfo, amount);
                encryptArrayLocalStorage = consultData();
                if (encryptArrayLocalStorage == null) {
                    orderArray.push(order)
                    encryptData = encryptData(orderArray, KEY)
                    savingDataResult = savingData('info', encryptData);
                    if (savingDataResult) {
                        location.href = "/catalogo/finalizar-compra" + "?lastWhim=true";
                    }
                    else{
                        window.alert('Ups, parece que hubo un problema, por favor vuelve a intentarlo mas tarde')
                    }
                }
                else
                {
                    descryptedLocalStorageArray = decryptDataLastWhim(encryptArrayLocalStorage, KEY);
                    let duplicateItem = checkDuplicatesInCarShop(order.name, descryptedLocalStorageArray)
                    if (!(duplicateItem === 'Not duplicate item')) {
                        descryptedLocalStorageArray[duplicateItem].amount = order.amount + descryptedLocalStorageArray[duplicateItem].amount;
                        descryptedLocalStorageArray[duplicateItem].total_price = descryptedLocalStorageArray[duplicateItem].amount * descryptedLocalStorageArray[duplicateItem].individual_price;
                    }
                    else
                    {
                        descryptedLocalStorageArray.push(order);
                    }
                    encryptData = encryptData(descryptedLocalStorageArray, KEY)
                    savingDataResult = savingData('info', encryptData);
                    if (savingDataResult) {
                        location.href = "/catalogo/finalizar-compra" + "?lastWhim=true";
                    }
                    else{
                        window.alert('Ups, parece que hubo un problema, por favor vuelve a intentarlo mas tarde')
                    }
                }
            })
            .catch(error => console.error('Ups, parece que hubo un error guardando tu plato'));
        }
    });
}
// Utilities: functions developed to assists main function "lastWhimAdd" to save user selections into local storage
function mappingPlateValues(plateInfo, amount) {
    plate = {
        name: plateInfo.dish_name,
        amount: amount,
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
function checkDuplicatesInCarShop(identifier, decryptedArray) {
    const duplicateItem = decryptedArray.find(duplicateItem => duplicateItem.name === identifier);
    return duplicateItem ? decryptedArray.indexOf(duplicateItem) : 'Not duplicate item';
}
function encryptData(order, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(order), key).toString();
}
function decryptDataLastWhim(encryptOrder, key) {
    var bytes = CryptoJS.AES.decrypt(encryptOrder, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
function consultData() {
    return localStorage.getItem('info');
}
function savingData(plate, encryptOrder) {
    localStorage.setItem(plate, encryptOrder);
    return true;
}
// 9.3 Tip function
const tipping = (percentage, domObj) => {
    let tipBtns = document.querySelectorAll(".tipBtn");
    let productsPrice = calculateTotal(products);
    let totalPrice = calculateTotal(products)+4000;
    if (discountCuponValue == 4000) {
        totalPrice = totalPrice - 4000;
    }
    let tip = 0;
    tipBtns.forEach(tipBtn => {
        if (tipBtn.classList.contains('tipBtn_active')) {
            tipBtn.classList.remove('tipBtn_active')
        }
    });
    domObj.classList.add('tipBtn_active');
    if(percentage == '5')
    {
        tip = totalPrice*0.05
        mappingDOM(productsPrice, 2000, 2000, tip, discountCuponValue)
    }
    else if(percentage == '8')
    {
        tip = totalPrice*0.08
        mappingDOM(productsPrice, 2000, 2000, tip, discountCuponValue)
    }
    else if(percentage == '10')
    {
        tip = totalPrice*0.1
        mappingDOM(productsPrice, 2000, 2000, tip, discountCuponValue)
    }
    else
    {
        openCheckoutPopup("tippingDialog");
        let noTip = document.querySelector(".noTip");
        let saveCustomTip = document.querySelector(".saveCustomTip");
        noTip.addEventListener('click', () => {
            tip = totalPrice*0
            mappingDOM(productsPrice, 2000, 2000, tip, discountCuponValue);
            closeCheckoutPopup("tippingDialog");
        });
        saveCustomTip.addEventListener('click', () => {
            let tipCustomValue = document.querySelector(".tipCustomValue").value;
            tip = parseInt(tipCustomValue);
            mappingDOM(productsPrice, 2000, 2000, tip, discountCuponValue);
            closeCheckoutPopup("tippingDialog");
        })
    }
}
// 9.4 Popup logic handling
const openCheckoutPopup = (popupType) => {
    let popup;
    popup__background = document.querySelector('.popup__background');
    if (popupType == 'ourCosts') {
        popup = document.querySelector('.dialogOurCost');
    }
    else if(popupType == 'detail')
    {
        popup = document.querySelector('.dialogDetail');
    }
    else if(popupType == 'tippingDialog')
    {
        popup = document.querySelector('.tippingDialog');
    }
    else if(popupType == 'dialogLastWhim')
    {
        popup = document.querySelector('.dialogLastWhim');
    }
    if (popup__background.classList.contains('hidden') && popup.classList.contains('popupClosed')) {
        popup.classList.remove('popupClosed');
        popup__background.classList.remove('hidden');
        var bodyHeight = document.body.scrollHeight;
        popup__background.style.height = bodyHeight + 'px';
    }
}
const closeCheckoutPopup = (popupType) => {
    let popup
    popup__background = document.querySelector('.popup__background');
    if (popupType == 'ourCosts') {
        popup = document.querySelector('.dialogOurCost');
    }
    else if(popupType == 'detail')
    {
        popup = document.querySelector('.dialogDetail');
    }
    else if(popupType == 'tippingDialog')
    {
        popup = document.querySelector('.tippingDialog');
    }
    else if(popupType == 'dialogLastWhim')
    {
        popup = document.querySelector('.dialogLastWhim');
    }
    if (!popup__background.classList.contains('hidden') && !popup.classList.contains('popupClosed')) {
        popup.classList.add('popupClosed');
        popup__background.classList.add('hidden');
        popup__background.style.height = 0 + 'px';
    }
}
function lastWhim(request) {
    setTimeout(()=>{
        openCheckoutPopup('dialogLastWhim');
    }, 5000)
}