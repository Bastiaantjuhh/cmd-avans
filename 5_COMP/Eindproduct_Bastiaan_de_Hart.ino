// Libarries aanroepen
#include <Adafruit_MMA8451.h>
#include <Adafruit_NeoPixel.h>

Adafruit_MMA8451 mma = Adafruit_MMA8451();

// NeoPixel instellingen
/*
 * BRON: https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library-use
 * BRON: https://brightspace.avans.nl/d2l/le/lessons/202565/topics/1444209
 * GEBRUIK: Gebruikt voor het werkend krijgen van de NeoPixel RGB LED. Documentatie
 *          Zorgvuldig gelezen en voor de rest alleen functies opgezocht in docs.
 *          Brightspace voorbeeld is gebruikt om NeoPixel werkend te krijgen.
 *
 */
int neoPixelPin = 10;

// NeoPixel instellen (pixels, pin)
Adafruit_NeoPixel pixels(40, neoPixelPin, NEO_GRB + NEO_KHZ800);

// Pin definities
int potmeterPin = A0;
int speakerPin = 12;
int rgbRoodPin = 7;
int rgbGroenPin = 5;
int rgbBlauwPin = 6;

void setup() {

  /*
   * BRON: https://forum.arduino.cc/t/serial-communication/393697
   * GEBRUIK: Had wat issues met dat de sensor niet werkte dus na enkele Google
   *          opdrachten kwam ik onderstaande 4 lijnen aan code tegen die ik heb
   *          gebruikt voor debugging doeleinden.
   *
   */
  Serial.begin(9600);

  if (!mma.begin()) {
    Serial.println("MMA8451 niet gevonden :-(");
    while (1);
  }
  
  // NeoPixel opstarten
  pixels.begin();
  pixels.show();

  // Bepaal uitgangen
  pinMode(speakerPin,   OUTPUT);
  pinMode(rgbRoodPin,   OUTPUT);
  pinMode(rgbGroenPin,  OUTPUT);
  pinMode(rgbBlauwPin,  OUTPUT);

  // Zet de accelerometer op een 2G meetbereik
  // DOCS: https://learn.adafruit.com/adafruit-mma8451-accelerometer-breakout/wiring-and-test
  mma.setRange(MMA8451_RANGE_2_G);

  // Lees het potentiometer signaal voor volumeregeling
  int potWaarde = analogRead(potmeterPin);
}

void loop() {
  
  // Maak een event object om de accelerometerdata op te slaan
  sensors_event_t event;

  // Pakt de sensor data
  mma.getEvent(&event);

  // Kanteling in de X en Y as.
  // Float omdat het geen heel cijfer is en negatieve getallen kunnen worden.
  float asX = event.acceleration.x; 
  float asY = event.acceleration.y;

  // Map de waarden naar een bruikbare frequentie voor de speaker
  // X-as kanteling naar toonhoogte
  int frequentie = map(asX * 100, -200, 200, 200, 10000);

  // Beperk de frequentie binnen het bereik
  frequentie = constrain(frequentie, 200, 10000);

  // Lees het potentiometer signaal voor volumeregeling
  int potWaarde = analogRead(potmeterPin);

  // Speel een toon gebaseerd op de kanteling en het volume
  toonAfspelen(frequentie, potWaarde);

  // Verander de NeoPixel kleur op basis van de Y-kanteling
  int neoRood   = map(asY * 100, -200, 200, 0, 255);
  int neoBlauw  = 255 - neoRood;
  int neoGroen  = 255;

  // Stel de kleur van de NeoPixel in
  pixels.setPixelColor(0, pixels.Color(neoRood, neoGroen, neoBlauw));
  pixels.show();

  // Aan de hand van de Potmeter waarde wordt de kleur van de RGB led bepaald
  // < 250 is Rood, > 750 is groen, geen van beide is uit.
  if(potWaarde < 250) {
    bepaalKleur(255, 0, 0);
  } else if(potWaarde > 750) {
    bepaalKleur(0,  255, 0);
  } else {
    bepaalKleur(0,  0, 0);
  }

  // Voor Debugging
  Serial.print("Pot: ");
  Serial.print(potWaarde);

  Serial.print(" X: ");
  Serial.print(asX);
  
  Serial.print(" Y: ");
  Serial.println(asY);

  // Kleine pauze voor stabiliteit.
  // Kwam erachter dat bij een constante run de code niet geheel stabiel draait.
  delay(500);
}

void bepaalKleur(int rood, int groen, int blauw) {

  // Functie zorgt ervoor dat de RGB LED aangestuurd word
  // Door deze functie hoef ik niet voor iedere waarde alles opnieuw te definieren
  analogWrite(rgbRoodPin, rood);
  analogWrite(rgbGroenPin, groen);
  analogWrite(rgbBlauwPin, blauw);
}

void toonAfspelen(int frequentie, int toon) {

  // Functie heeft als doel een toon te spelen op de speaker.
  // De periode is de tijd in microseconden
  int periode = 100000 / frequentie;

  // Deze ForLoop zorgt ervoor dat de toon meerdere keren achter elkaar wordt gespeeld voor een X-tijd.
  for (int i = 0; i < 1000; i += periode) {

    // stuurt een PWN signaal naar de speaker om het volume te regelen
    analogWrite(speakerPin, 200);

    // Vetraging
    delayMicroseconds(toon);

    // Speaker uit
    digitalWrite(speakerPin, LOW);

    // Vertraging
    delayMicroseconds(toon);
  }
}