"use strict"; // Strikte syntax volgens protocol

console.log("Javascript ingeladen (main.js)");

/*
 * BRON: 	https://brightspace.avans.nl/d2l/le/lessons/202566/topics/1484959
 * GEBRUIK:	Standaard code zoals aangeleverd in de "opfris cursus"
 * 
 */
if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker.register("/assets/js/sw.js").then(function(registration) {
            console.log("ServiceWorker registratie succesvol: ", registration.scope);
        }, function(error) {
            console.log("ServiceWorker registratie gefaald: ", error);
        });
    });
}

// Functie voor notificaties
function sendNotification(tekst) {

	/*
	 * Controle of er rechten zijn voor notificaties
	 * Indien die er niet zijn, vragen om rechten
	 * 
	 * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Notification 
	 * 
	 */ 

	if (Notification.permission === "granted") {

		// Nieuwe notificatie sturen
		new Notification("Nieuwe taak toegevoegd!", {
			body: tekst,
			icon: "/assets/icons/icon_128x128.png"
		});

		console.log("Notificatie verzonden");

	} else if (Notification.permission !== "denied") {

		console.log("Notificaties heeft geen toestemming");

		// Geen toestemming.
		// Vraag om toestemming en dan functie opnieuw uitvoeren.
		Notification.requestPermission().then(permission => {

			if (permission === "granted") {

				console.log("Notificaties toestemming verkregen.");
				sendNotification(tekst);
			}
		});
	}
}

/*
 * Functie voor geolocatie
 * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation
 * 
 * TODO: Fixing console probleem;
 * 		 main.js:67 [Violation] Only request geolocation information in response to a user gesture.
 */ 
function showGeolocation() {
	if ("geolocation" in navigator) {

		// Verkrijgen van de huidige coordinaten.
		navigator.geolocation.getCurrentPosition((position) => {

			// Lot & Lat instellen met coordinaten.
			const { latitude, longitude } = position.coords;

			console.log("Locatie coordinaten: " + position.coords);

			// Manipuleer DOM met locatie coordinaten.
			document.getElementById("geolocation-info").textContent = 
				"Je huidige locatie is: Lat: " + latitude + " Lon: " + longitude;
		});
	}
}

/*
 * Taken opslaan in LocalStorage
 * Met als reden dat deze dan voor altijd op het apparaat
 * waar deze op aangemaakt zijn bewaard worden (mits de
 * gebruiker zijn browser gegevens niet wist)
 * 
 * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * 
 */ 
function saveTasksToLocalStorage(tasks) {

	/*
	 * Opslaan als JSON object.
	 *
	 * TODO: BASE64 encoding voor vreemde tekens in taken.
	 * 		 Bepaalde Unicode karakters zorgen voor problemen.
	 * 
	 */ 
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

/*
 * Taken laden uit LocalStorage
 */ 
function loadTasksFromLocalStorage() {

	// Taken inladen & parsen als JSON object.
	const tasks = localStorage.getItem("tasks");

	// console.log(tasks);
	
	if (tasks) {
		return JSON.parse(tasks);
	} else {
		return [];
	}
}

// Taak toevoegen aan de lijst (alleen DOM).
function renderTask(task) {
	const taskList = document.getElementById("task-list");
	const listItem = document.createElement("li");

	// Toevoegen van Bootstrap CSS classes.
	listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

	// Taak tekst
	const taskText = document.createElement("span");
	taskText.textContent = task;
	listItem.appendChild(taskText);

	// Verwijder knop (kruisje).
	const deleteButton = document.createElement("button");
	deleteButton.innerHTML = "&times;";

	// Toevoegen van Bootstrap CSS classes voor knop
	deleteButton.classList.add("btn", "btn-danger", "btn-sm", "delete-btn");
	deleteButton.addEventListener("click", () => {
		removeTask(task);
		listItem.remove();
	});

	// Toepassen in DOM.
	listItem.appendChild(deleteButton);
	taskList.appendChild(listItem);
}

// Taak toevoegen aan zowel DOM als LocalStorage.
function addTask(task) {
	// Voeg de taak toe aan de DOM.
	renderTask(task);

	// Voeg de taak toe aan LocalStorage.
	const tasks = loadTasksFromLocalStorage();
	tasks.push(task);
	saveTasksToLocalStorage(tasks);
}

// Taak verwijderen uit LocalStorage.
function removeTask(task) {
	let tasks = loadTasksFromLocalStorage();
	
	tasks = tasks.filter(function(t) {
		return t !== task;
	});

	saveTasksToLocalStorage(tasks);

	sendNotification("TODO item verwijderd.");
}

// Event listener voor het toevoegen van een taak.
document.getElementById("add-task-btn").addEventListener("click", () => {
	const taskInput = document.getElementById("task-input");
	const task = taskInput.value.trim();

	if (task) {
		addTask(task);
		taskInput.value = "";
		sendNotification("Nieuw TODO item toegevoegd.");
	}
});

// Takenlijst laden bij het opstarten.
function displayTasks() {

	const tasks = loadTasksFromLocalStorage();

	// Render alleen de taken in de DOM zonder ze opnieuw op te slaan.
	tasks.forEach(renderTask);
}

/*
 * Web Share API
 * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
 * 
 */ 
document.getElementById("share-btn").addEventListener("click", () => {

	// Inladen taken van Local Storage.
	const tasks = loadTasksFromLocalStorage();

	// Taken tekst ENTEREN.
	const taskText = tasks.join("\n");

	// Delen met WebShare API volgens Mozilla.
	if (navigator.share) {
		navigator.share({
			title: "Mijn Takenlijst",
			text: "Bekijk mijn takenlijst:\n" + taskText,
			url: window.location.href
		});
	}

	sendNotification("TODO lijst succesvol gedeeld.");
});

/*
 * Trillingen feedback (device functie)
 * DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
 * 
 */ 
document.getElementById("notify-btn").addEventListener("click", () => {

	// Vibratie en sturen notificatie
	window.navigator.vibrate(200);
	sendNotification("Nieuw TODO item toegevoegd.");
});

// Geolocatie tonen.
showGeolocation();

// Taken weergeven bij opstarten.
displayTasks();