// Hero banner swiper
const heroBannerSwiper = new Swiper('.heroBannerSwiper', {
    direction: 'horizontal',
    loop: true,
    autoplay: {
        delay: 5000,
    },
    pagination: {
        el: '.swiper-pagination-heroBanner',
        clickable: true
    },
}); 

// Our service section swiper
const ourServicesSwiper = new Swiper('.ourServicesSwiper', {
    direction: 'horizontal',
    slidesPerView: 1.15,
    loop: true,
    autoplay: {
        delay: 5000,
    },
    breakpoints: {
        640: {
            slidesPerView: 2.15,
            },
        1024: {
            slidesPerView: 3,
            },
        }
});

// User review swiper
const reviewSwiper = new Swiper('.reviewSwiper', {
    direction: 'horizontal',
    spaceBetween: 15,
    slidesPerView: 1.15,
    loop: true,
    autoplay: {
        delay: 5000,
    },
    breakpoints: {
        640: {
            slidesPerView: 2.15,
            },
        1024: {
            slidesPerView: 3,
            }
        }
});