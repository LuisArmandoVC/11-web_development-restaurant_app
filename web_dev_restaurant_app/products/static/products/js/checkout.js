// TODO: CAMBIAR TODAS LAS KEY QUEMADAS CON VARIABLES DE ENTORNO

// How to calculate order summary  
// 1. Definitions
    const KEY = '57e826694a4fc7b42aa4797ac13fbe28';
    products = [];
    paymentType = "";
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
        } , 3000)
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
function mappingDOM(total, serviceFee, shippingCost) {
    document.querySelector('.productCosts').innerHTML = `$${total}`;
    document.querySelector('.serviceFeeCosts').innerHTML = `$${serviceFee}` ;
    document.querySelector('.shippingCost').innerHTML =  `$${shippingCost}`;
    document.querySelector('.orderTotal').innerHTML =  `$${total + serviceFee + shippingCost}`;
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

// 8. Global function for checkout page. It will execute step by step all functions above
const checkoutFunction = () => {
    decryptData();
    validationProducts(products.length)
    total = calculateTotal(products);
    mappingDOM(total, 2000, 2000)
    listenPaymentMethod();
}
document.addEventListener("DOMContentLoaded", checkoutFunction());


const clickingPayment = () => {
    let checkout = new WidgetCheckout({
        currency: 'COP',
        amountInCents: calculateTotal(products)*100,
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