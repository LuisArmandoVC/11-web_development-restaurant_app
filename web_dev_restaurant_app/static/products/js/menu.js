const initialCategory = document.querySelector('#initialCategory');
const allPlates = document.querySelectorAll('[data-category]');

platesManipulationDOM = (category, element) => {
    if (initialCategory.classList.contains('text-secondary')) {
        initialCategory.classList.remove('text-secondary');

        initialCategory.classList.remove('border-secondary');
        initialCategory.classList.add('border-black');

        initialCategory.classList.remove('border-b-2');
        initialCategory.classList.add('border-b-[1px]');
    }
    if (category == 'Corrientazos' || category == 'Postres' || category == 'Especiales') {
        container = document.querySelector('#categoryContainer');
        const corrientazosWidth = element.offsetWidth;
        const containerWidth = container.offsetWidth;
        const elementLeft = element.offsetLeft;
        const containerScrollLeft = container.scrollLeft;
        const scrollLeft = elementLeft - containerWidth / 2 + corrientazosWidth / 2;
        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    allPlates.forEach(plate => {
        if (category == plate.getAttribute('data-category')) {
            plate.classList.remove('hidden');
        }
        if (category != plate.getAttribute('data-category')) {
            plate.classList.add('hidden');
        }
    });
};
initialCategory.addEventListener('click', () => {
    allPlates.forEach(plate => {
        if (plate.classList.contains('hidden')) {
            plate.classList.remove('hidden');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    setTimeout( ()=>{
        const currentURL = new URL(location.href);
        const addedConfirmation = currentURL.searchParams.get('added');
        console.log(addedConfirmation);
        if (addedConfirmation == 'true') {
            carShoppingToggle();
        }
    }, 1000 )
})