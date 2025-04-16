/*
// Voor debugging doeleinden;
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM volledig geladen");
});
*/

// DOCS: https://p5js.org/reference/ 

// Aanmaken wolken Array
let clouds = [];

/*
 * Setup draait maar 1 keer, bij inladen alleen
 * DOCS: https://p5js.org/reference/p5/setup/
 * 
 */ 
function setup() {

    // console.log("Cloud.js: Canvas wordt aangemaakt & wolken worden gegenereerd");

    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);

    // Z-index moet hoog maar niet boven de tekst dus 100 is een mooi rond getal
    canvas.style("z-index", "100");

    // Maak 6 wolken met random positie
    for (let i = 0; i < 6; i++) {
        clouds.push({
            x: random(width),
            y: random(height * 0.25),
            speed: random(1, 2)
        });
    }
}

// DOCS: https://p5js.org/reference/p5.Framebuffer/draw/
function draw() {

    // console.log("Cloud.js: Tekenen");

    clear(); // Voorkomt gekke sporen/ glitches
    drawClouds();
    moveClouds();
}

function drawClouds() {

    // console.log("Cloud.js: Tekenen wolkjes");
    noStroke();
    fill(255, 255, 255);

    for (let i = 0; i < clouds.length; i++) {
        let cloud = clouds[i];

        // Teken meerdere cirkels om een wolk te vormen
        ellipse(cloud.x, cloud.y, 60, 40);
        ellipse(cloud.x + 20, cloud.y - 10, 80, 50);
        ellipse(cloud.x + 40, cloud.y, 60, 40);
    }
}

function moveClouds() {

    // Alle wolken laten bewegen gaat het eenvoudigste met een For-loop over alle wolken
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].x += clouds[i].speed;

        // Laat wolken opnieuw beginnen als ze buiten beeld zijn
        if (clouds[i].x > width + 50) {

            // console.log("Cloud.js: Reset " + clouds[i]);
            clouds[i].x = -50;
        }
    }
}