/*
	Project:    Avans ADSC
	Opdracht:   Eindtoets
	Doel:       Een dikke 10 voor ADSC natuurlijk ;-)
	Datum:      5 Juni 2024
	Naam:       Bastiaan de Hart
	Studentnr:  REMOVED
	eMail:      REMOVED
	Klas:       IJ
	Docent:     Theron Grey
	Verklaring: Ik verklaar deze toets oprecht te maken volgens
					de gegeven richtlijnen en bronvermeldingen te
					doen van alle uit bronnen gekopieerde code en
					alle daarbij gebruikte AI prompts te vermelden!
*/

// Naam toevoegen
document.querySelector("h1").innerHTML = "ADSC Toets 20240605<br>Bastiaan de Hart";

// Array defineren
let afbeeldingenArr = [];

// Met for loop alle afbeledingen toevoegen aan de Array
for(let count = 0; count < 10; count++) {

	afbeeldingenArr.push("plaatjes/GebarenTaal-" + count + ".jpg");
}

// Voor debugging doeleinden;
// console.log(afbeeldingenArr);

// Hele HTML Form selecteren
let formComplete = document.getElementsByName("instellingen");

// Voor debugging doeleinden;
// console.log(formComplete[0].innerHTML);

/*
 * Drie invoervelden in variable gooien
 * In toets stond niet vermeld of het doormiddel van vorige variable
 * geselecteerd moest worden of niet, dus heb ze met ID geselecteerd
 * voor het gemak.
 */ 
let formRand 		= document.getElementById("rand");
let formAfmeting 	= document.getElementById("afmeting");
let formNummer 		= document.getElementById("nummer");

// HTML paragraaf in variable zetten
let paragraaf = document.querySelector("body > p");

// Afbeelding selecteren
let afbeelding = document.querySelector("body > p > img");

// Pijlen selecteren
let pijlVorige 		= document.getElementById("lang");
let pijlVolgende 	= document.getElementById("rang");

// Check box change
formRand.addEventListener("click", checkboxChange);

// Functie voor checkbox
function checkboxChange() {

	/* 
	 * Bron: https://stackoverflow.com/questions/5898656/check-if-an-element-contains-a-class-in-javascript
	 * Gebruik: Opgezocht via Google hoe ik kan kijken of iets een class list heeft
	 * 			Kon dit ook in documentatie zoeken maar simpele Google opdracht bespaarde tijd
	 * 			Heb ook gebruik gemaakt van QuerySelector want liep tegen problemen aan en wilde
	 * 			niet teveel tijd verspillen aan debugging
	 */ 

	// console.log(document.querySelector("body > p").classList.length);

	if(paragraaf.classList.length == 0) {

		paragraaf.classList.add("rand");
	} else {

		paragraaf.classList.remove("rand");
	}
}

// Detectie voor verandering van de afmeting
formAfmeting.addEventListener("change", sizeChange);

// Functie voor de afmeting verandering
function sizeChange() {

	let currentSize = formAfmeting.value;

	/*
	 * Bron: https://www.w3schools.com/jsref/prop_style_width.asp
	 * Gebruik: Documentatie gelezen en opgezocht via Google want
	 * 			was zwaar aan het strugglen. :-( <--- Sad Bastiaan emoji
	 * Bron: https://www.w3schools.com/jsref/prop_style_borderwidth.asp
	 * Gebruik: Snel even in documentatie opgezocht wat de juist property
	 * 			voor de border was.
	 */

	// Paragraaf
	paragraaf.style.width = currentSize + "px";

	// Border
	paragraaf.style.borderWidth = (currentSize / 30) + "px";

	// Afbeelding
	afbeelding.style.height = currentSize + "px";

	// Pijltjes
	pijlVorige.style.fontSize = (currentSize / 3) + "px";
	pijlVolgende.style.fontSize = (currentSize / 3) + "px";
}

// Detectie voor verandering van het nummer
formNummer.addEventListener("change", numberChange);

// Functie voor de afmeting verandering
function numberChange() {

	let currentNumber = formNummer.value;

	if(currentNumber < 0 || currentNumber > 9) {

		let currentNumber = Math.floor(Math.random() * 10);
		changeImage(currentNumber);
	} else {

		changeImage(currentNumber);
	}
}

// Detectie voor klik
pijlVorige.addEventListener("click", clickLeft);

function clickLeft() {

	// Voor debugging doeleinden;
	console.log("CLICK: LEFT");

	let readImage = afbeelding.src;

	/*
	* DIT WERKT NOG NIET. NIET VERDER GEKOMEN....
	* Dit stuk zorgen voor een grote fucking clusterfuck
	* in m'n hoofd dus stopte hier.
	*/
	let arrNumber = afbeeldingenArr.indexOf(readImage);

	if(arrNumber < 0) {

		changeImage((afbeeldingenArr.length = -1))
	} else {

		changeImage(arrNumber);
	}
}

// Detectie voor klik
pijlVolgende.addEventListener("click", clickRight);

function clickRight() {

	// Voor debugging doeleinden;
	console.log("CLICK: RIGHT");

	let readImage = afbeelding.src;
}

function changeImage(input) {

	// Voor debugging doeleinden;
	// console.log(input);
	console.log(afbeeldingenArr[input]);

	// Afbeelding toewijzen
	afbeelding.src = afbeeldingenArr[input];

	// Alt Attribute veranderen
	afbeelding.alt = "Gebaar " + input;

	// Nummer in invoerveld 
	formNummer.value = input;
}