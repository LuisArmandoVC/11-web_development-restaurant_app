// Section 1: Hero banner swiper
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
// Section 2: Special plates swiper
const svgPrev = document.querySelector('.specialPlates-swiper__prev');
const svgNext = document.querySelector('.specialPlates-swiper__next');

const specialPlates = new Swiper('.specialPlatesSwiper', {
    direction: 'horizontal',
    slidesPerView: 1.25,
    spaceBetween: 20,
    autoplay: {
        delay: 7000,
    },
    navigation: {
        nextEl: '.specialPlatesSwiper-button-next',
        prevEl: '.specialPlatesSwiper-button-prev',
    },
    breakpoints: {
        640: {
            slidesPerView: 2.25,
            },
        1024: {
            spaceBetween: 40,
            preventInteractionOnTransition: true,
            watchSlidesProgress: true,
            slidesPerView: "2.5",
            shortSwipes: false
            },
        1280:{
            spaceBetween: 40,
            slidesPerView: "3.2",
        },
        1720:{
            spaceBetween: 40,
            slidesPerView: "4.1",
        }
    },
    on: {
        init: function () {
            if (this.isBeginning) {
                svgPrev.classList.remove('specialPlates-swiper-arrow-btn');
                svgPrev.classList.add('specialPlates-swiper-arrow-btn_disabled');
            }
        },
        slideChange: function (){
            if (this.isBeginning) {
                svgPrev.classList.remove('specialPlates-swiper-arrow-btn');
                svgPrev.classList.add('specialPlates-swiper-arrow-btn_disabled');
            }
            else{
                svgPrev.classList.remove('specialPlates-swiper-arrow-btn_disabled');
                svgPrev.classList.add('specialPlates-swiper-arrow-btn');
            }

            if (this.isEnd) {
                svgNext.classList.remove('specialPlates-swiper-arrow-btn');
                svgNext.classList.add('specialPlates-swiper-arrow-btn_disabled');
            }
            else{
                svgNext.classList.remove('specialPlates-swiper-arrow-btn_disabled');
                svgNext.classList.add('specialPlates-swiper-arrow-btn');
            }
        },
        reachEnd: function () {
            svgNext.classList.remove('specialPlates-swiper-arrow-btn');
            svgNext.classList.add('specialPlates-swiper-arrow-btn_disabled');
        }
    }
}); 
// Section 3: Our service section swiper
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
// Section 4: User review swiper
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