////////////////////////////////////////////////////////////////////////////////
//
// Student:        Bastiaan de Hart
// Studentnummer:  REMOVED
// Groepnummer:    IJ
// Docent:         Bas Degen
// Datum:          23-04-2024
// Opdrachtnummer: EINDPRODUCT
// Titel:          Eindproduct
// Beschrijving:   Mini game: Vang de bal
//
////////////////////////////////////////////////////////////////////////////////

boolean gameStarted = false; // Variabele om bij te houden of het spel gestart is

// Variabelen voor het spel
int score = 0; // Score van de speler
int timeLeft = 20; // Tijd in seconden
int totalBalls = 20; // Totaal aantal ballen in het spel
float objX, objY; // Positie van het object
float objSpeed = 5; // Snelheid van het object
int objSize = 50; // Grootte van de paddenstoel

int[] ballX = new int[totalBalls]; // X-positie van elke bal
int[] ballY = new int[totalBalls]; // Y-positie van elke bal
int[] ballSpeed = new int[totalBalls]; // Snelheid van elke bal
int[] ballColor = new int[totalBalls]; // Kleur van elke bal

// Informatieve teksten (uitleg aan begin)
String info1 = "Welkom bij mijn mini game genaamd: Vang de bal.";
String info2 = "Je zal gebruik moeten maken van de A en D toetsen.";
String info3 = "Het doel is zoveel mogenlijk ballen te vangen.";

// Kleuren
color cBackground = color(255,255,255); // Achtergrond
color cBgGameover = color(255,0,0); // Game over achtergrond
color cMainCaracter = color(0, 0, 0); // Het object dat de bal moet vangen

int txtSize = 20;

void setup() {
  
  size(600, 400);
  runGame();
}

void draw() {
  
  background(cBackground);
  
  if (!gameStarted) {
    
    drawStartScreen();
  } else {
    
    drawGame();
  }
}

void drawStartScreen() {
  
  // Tekenen van de startknop
  fill(0, 0, 0);
  rect(width / 2 - 50, height / 2 - 25, 100, 50);
  
  // Tekenen van de teksten en startknop
  // Introductie tekst
  text(info1, width / 2, 60);
  
  // Uitleg tekst
  text(info2, width / 2, 120);
  text(info3, width / 2, 140);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Start", width / 2, height / 2);
  
  /*
   * Controleren of de muisknop is ingedrukt binnen de grenzen van de startknop
   * Ik wist niet zo goed hoe ik de knoo klikbaar moest maken.
   * Code is daarom deels afkomstig van documentatie van Processing zelf
   * BRON: https://processing.org/examples/button.html
   */
  if (mousePressed && mouseX >= width / 2 - 50 && mouseX <= width / 2 + 50 && mouseY >= height / 2 - 25 && mouseY <= height / 2 + 25) {
    
    gameStarted = true;
  }
}

void drawGame() {
  // Beweging van de paddenstoel
  if (keyPressed) {
    
    /*
     * Probleem, waneer CAPS aanstaat werkt de keuze niet
     * Dit probleem heeft me een hoop onodige tijd gekost
     * Probleem opgelost door ook de Hoofdletters bij te voegen.
     */
    if (key == 'a' || key == 'A') {
      
      objX -= objSpeed;
    }
    
    if (key == 'd' || key == 'D') {
      
      objX += objSpeed;
    }
    
    // Zorg ervoor dat het object binnen het scherm blijft
    objX = constrain(objX, objSize / 2, width - objSize / 2);
  }
  
  // Tekenen van het object
  fill(cMainCaracter);
  rect(objX, height - objSize / 2, objSize, objSize);
  
  // Tekenen van de ballen
  for (int i = 0; i < totalBalls; i++) {
    
    fill(ballColor[i]);
    ellipse(ballX[i], ballY[i], 20, 20);
    ballY[i] += ballSpeed[i];
    
    // Controleren of object een bal heeft gevangen
    if (dist(objX, height - objSize / 2, ballX[i], ballY[i]) < objSize / 2) {
      
      score++;
      resetBall(i);
    }
    
    // Controleren of de bal het onderste deel van het scherm heeft bereikt
    if (ballY[i] > height) {
      
      resetBall(i);
    }
  }
  
  // Tekenen van de score en tijd
  fill(0);
  textSize(txtSize);
  text("Score: " + score, 40, 10);
  
  /*
   * ALs er minder dan 10 sexonden zijn veranderd de kleur naar ROOD
   * Om aan te duiden dat de tijd bijna op is.
   */
  if(timeLeft < 10) {
    
    fill(255,0,0);
  }
  
  text("Tijd over: " + timeLeft, width - 60, 10);
  
  // Aftellen van de tijd
  if (frameCount % 60 == 0 && timeLeft > 0) {
    
    timeLeft--;
  }
  
  // Controleren of de tijd op is
  if (timeLeft == 0) {
    
    gameOver();
  }
}

void runGame() {
  // Plaats het object in het midden onderaan het scherm
  objX = width / 2;
  objY = height - objSize / 2;
  
  // Plaats elke bal op een willekeurige positie bovenaan het scherm
  for (int i = 0; i < totalBalls; i++) {
    
    ballX[i] = int(random(width));
    ballY[i] = int(random(-height, 0));
    ballSpeed[i] = int(random(2, 5));
    ballColor[i] = color(random(255), random(255), random(255));
  }
}

void resetBall(int index) {
  
  ballX[index] = int(random(width));
  ballY[index] = int(random(-height, 0));
  ballSpeed[index] = int(random(2, 5));
  ballColor[index] = color(random(255), random(255), random(255));
}

void gameOver() {
  
  /*
   * Tekenen van het eindscherm
   * Er zit een kleine Bug in deze functie dat de score blijft oplopen
   * Op de achtergrond loopt de game dus nog
   * Helaas geen tijd meer over om dit op te kunnen lossen
   */
   
  background(cBgGameover);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(60);
  text("GAME OVER", width / 2, height / 2 - 30);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 + 20);
}
