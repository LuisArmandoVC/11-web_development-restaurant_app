products = [];
// TODO: CAMBIAR TODAS LAS KEY QUEMADAS CON VARIABLES DE ENTORNO
// TODO: CAMBIAR BIBLIOTECAS CDNs QUEMADAS POR BIBLIOTECAS DE VENDOR (INTERNAS)
const KEY = '57e826694a4fc7b42aa4797ac13fbe28';
let localStorageValue = localStorage.getItem('info');
let bytes = CryptoJS.AES.decrypt(localStorageValue, KEY);
products = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));