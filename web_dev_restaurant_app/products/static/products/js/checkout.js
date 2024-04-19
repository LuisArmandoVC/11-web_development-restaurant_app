// TODO: CAMBIAR TODAS LAS KEY QUEMADAS CON VARIABLES DE ENTORNO

// How to calculate order summary  
// 1. Definitions
    const KEY = '57e826694a4fc7b42aa4797ac13fbe28';
    products = [];
// 2. Read localstorage and decrypt content
function decryptData() {
    let localStorageValue = localStorage.getItem('info');
    let bytes = CryptoJS.AES.decrypt(localStorageValue, KEY);
    products = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
// 3. Check all items + calculate shipping car total
function calculateTotal(platesArray) {
    let total = 0;
    platesArray.forEach(plate => {
        total += plate.total_price
    });
    return total
}
// 4. Once everything is calculated this function will proceed to map everything up
function mappingDOM(total, serviceFee, shippingCost) {
    document.querySelector('.productCosts').innerHTML = `$${total}`;
    document.querySelector('.serviceFeeCosts').innerHTML = `$${serviceFee}` ;
    document.querySelector('.shippingCost').innerHTML =  `$${shippingCost}`;
    document.querySelector('.orderTotal').innerHTML =  `$${total + serviceFee + shippingCost}`;
}
// 5. Apply submit button logic based on payment method selected by user
function listenPaymentMethod() {
    let checkboxes = document.querySelectorAll("input[name=payment_type]");
    const cash = document.querySelector('#cash');
    const online_payment = document.querySelector('#online_payment');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            if (cash.checked == checkbox.checked) {
                console.log('el boton de cash fue el seleccionado');
            }
            else
            {
                console.log('el boton de pago en linea fue seleccionado');
            }
        })
    });
}

// 6. instancing new widgetcheckout obj. Wompi 
let checkout = new WidgetCheckout({
    currency: 'COP',
    amountInCents: calculateTotal(products)*100,
    reference: 'AD002901221',
    publicKey: 'pub_fENJ3hdTJxdzs3hd35PxDBSMB4f85VrgiY3b6s1',
    signature: {
        integrity : '3a4bd1f3e3edb5e88284c8e1e9a191fdf091ef0dfca9f057cb8f408667f054d0'
    },
    redirectUrl: 'https://transaction-redirect.wompi.co/check', // Opcional

    customerData: { // Opcional
        email:'lola@gmail.com',
        fullName: 'Lola Flores',
        phoneNumber: '3040777777',
        phoneNumberPrefix: '+57',
    },
    shippingAddress: { // Opcional
        addressLine1: "Calle 123 # 4-5",
        city: "Bogota",
        phoneNumber: '3019444444',
        region: "Cundinamarca",
        country: "CO"
    }
})

// 5. Global function for checkout page. It will execute step by step all functions above
const checkoutFunction = () => {
    decryptData();
    total = calculateTotal(products);
    mappingDOM(total, 2000, 2000)
    listenPaymentMethod();
}
document.addEventListener("DOMContentLoaded", checkoutFunction());