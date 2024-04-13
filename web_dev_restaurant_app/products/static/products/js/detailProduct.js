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






//
// 1. plate definition
plate = {
    name: '',
    price: '',
    side_dish_1: '',
    side_dish_2: '',
    side_dish_3: '',
    side_dish_4: '',
}
// 2. Mapping current DOM values with 