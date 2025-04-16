/*
 * JS is gescreven volgens DRY principe, zo veel mogenlijk globaal insteken
 * plus functies gebruiken en zo weinig mogenlijk herhalen. Ook overal netjes
 * CamelCase gebruikt.
 * 
 */
const myPerson = document.getElementById("my_person");

let isKeyPressed = false;
let isKeyDown = false;
let keyDownTime = 0;
let position = 0;

// Keydown listener, Keydown = ingedrukt
document.addEventListener("keydown", (event) => {

    // Pijltje naar rechts detectie
    if (event.code === "ArrowRight") {

        // Preventie tegen opgewenste acties
        event.preventDefault();

        // Classen swap
        if (!isKeyPressed) {
            isKeyPressed = true;
            myPerson.classList.replace("stand", "walk");
        }

        if (!isKeyDown) {
            isKeyDown = true;
            keyDownTime = event.timeStamp;
            movePerson();
        }
    }
});

// Keyup listener, keyup = losgelaten
document.addEventListener("keyup", (event) => {

    // Pijltje naar rechrs losgelaten?
    if (event.code === "ArrowRight") {
        isKeyPressed = false;
        isKeyDown = false;
        myPerson.classList.replace("walk", "stand");
    }
});

// Karakter laten bewegen
function movePerson() {
    if (isKeyDown) {
        if (performance.now() - keyDownTime > 1) {

            position += 7;

            // console.log(position);
            myPerson.style.transform = "translateX(" + position + "px)";
            keyDownTime = performance.now();
        }

        /*
         * Methode in browser voor animaties.
         * NOTE: Callback van functie is inline
         * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
         * 
         */ 
        requestAnimationFrame(movePerson);
    }
}

// Kijken of gewenste positie is bereikt. Als dat zo is naar volgende scene.
function checkPosition() {

    /*
     * "Cordinaten" bepaling van het element
     * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
     * 
     */ 
    if (myPerson.getBoundingClientRect().right >= 1900) {
        window.location.href = "scene3.html";
    }
}

setInterval(checkPosition, 100);