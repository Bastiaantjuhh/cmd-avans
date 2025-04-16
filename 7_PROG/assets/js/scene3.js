/*
 * JS is gescreven volgens DRY principe, zo veel mogenlijk globaal insteken
 * plus functies gebruiken en zo weinig mogenlijk herhalen. Ook overal netjes
 * CamelCase gebruikt.
 * 
 */
const myPerson = document.getElementById("my_person");

let leftPosition = 0;
let isMoving = false;

// Positie waar ik naartoe wil
const targetPos = window.innerWidth / 2.5 - myPerson.offsetWidth / 2.5;

// Karakter laten bewegen
function movePerson() {

    // controlle of positie al bereik is
    if (leftPosition < targetPos) {
        leftPosition++;
        myPerson.style.left = leftPosition + "px";

        // Swappen classes
        if (!isMoving) {
            isMoving = true;
            myPerson.classList.replace("stand", "walk");
        }

        /*
         * Methode in browser voor animaties.
         * NOTE: Callback van functie is inline
         * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
         * 
         */ 
        requestAnimationFrame(movePerson);
    
    // Positie bereikt? Stoppen en class swap
    } else {
        isMoving = false;
        myPerson.classList.replace("walk", "stand");
    }
}

// Commentaar regel 24
requestAnimationFrame(movePerson);