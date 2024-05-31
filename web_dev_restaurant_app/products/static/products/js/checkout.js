// TODO: CAMBIAR TODAS LAS KEY QUEMADAS CON VARIABLES DE ENTORNO

// How to calculate order summary  
// 1. Definitions
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

    if (paymentType == 'cash') {
        fetch('/catalogo/confirmacion-c', {
            method: "POST",
            // redirect: 'manual',
            body: JSON.stringify({
                "products": products,
                "purchaseAmount": calculateTotal(products) + 4000
            }),
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken')
            }
        }).then(
            function(response) {
                if (response.status == 200 ) {
                    window.location.href = response.url;
                }
            }
        )
    }
    else
    {
        let checkout = new WidgetCheckout({
            currency: 'COP',
            amountInCents: (calculateTotal(products)+4000)*100,
            reference: 'AD002901221',
            publicKey: 'pub_test_EIhIc63dgvz2lfsuTHPYc2nrvQ1w99yS',
            signature: {
                integrity : 'AD0029012211900000COPtest_integrity_7rD2EF8lMk9jtW8hJHViyzOLNjNf4Vqd'
            },
            redirectUrl: 'https://transaction-redirect.wompi.co/check', 
        })
        checkout.open(function (result) {
            var transaction = result.transaction;
            console.log("Transaction ID: ", transaction.id);
            console.log("Transaction object: ", transaction);
        });
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
        let productName = product.name;
        let productPrice = product.individual_price;
        subtotalProducts.innerHTML += `
            <div class="mt-5 flex items-start justify-between">
                <p>${ productName }</p>
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
// 9.2 Tip function
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
// 9.3 Popup logic handling
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
    if (!popup__background.classList.contains('hidden') && !popup.classList.contains('popupClosed')) {
        popup.classList.add('popupClosed');
        popup__background.classList.add('hidden');
        popup__background.style.height = 0 + 'px';
    }
}