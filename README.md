# NP-Kitchen-Bot

### [Github-page](https://johnsmithdoe.github.io/np-kitchen-bot/)

## Todo rxStore
* Think about: create edit; success fail
## Todos:
* Units: 3 x Kartoffeln, 3 x Spaghetti, 3 x Mehl ...
  * Besser? 500 g Kartoffeln ..., 3 Packungen Spaghetti, 2 kg Mehl ...
  * Alternative UI: Bestandsregler (viel - wenig) mit min max ...
* min amount and warning -> background as well...
* name, zusatz
* multi term search
* abteilung im supermarkt, lagerstandort (oder einfach kategorie)


## Feedback

## ToTest


## Barcode scanning
https://ionic.io/blog/how-to-build-an-ionic-barcode-scanner-with-capacitor

## Bilder speichern mit filesystem api
https://ionicframework.com/docs/angular/your-first-app/saving-photos

## Use-Cases

* Zur Einkaufsliste hinzufügen, wenn man etwas leer macht
* Zum Lager hinzufügen, wenn man etwas einkauft
* Rezept hinzufügen, vorschlagen
* Kalender mit wiederkehrenden Aufgaben

### Lagerhaltung
* Ansicht nach
  * Kategorie
  * Rezept
  * Alphabetisch
  * Standort/Geschäft
  * Anzahl/Soll/Ist
  * Ablaufdatum // 2 x eier, milch ... hmmm

### Inventur
* Erfassen des aktuellen stands
  * Barcode scanning
  * Eingabe
  * Auswahl

### Shopping
* Rezept-Inhalte (fehlende) oder Artikel hinzufügen
* Übertragen, anzeigen, abhaken
* Zum Lager hinzufügen und entfernen

### Recipes
* Liste von Rezepten mit Zutaten

Android
=======

Build
----

"buildOptimizer": false, in production.. modals not showing coz of tree shaking
https://github.com/ionic-team/ionic-framework/issues/28385
> ionic serve --prod

>ionic capacitor build android

Run and Build Apk
---
Install Android Studio and open it once
Open the android folder as a new project
Enable SVM Mode in Bios (on AMD ryzen)
Build signed apk from menu


### Storage Actions

* showCreateDialog
* showCreateGlobalDialog
* showEditDialog
* 
* searchFor
* setDisplayMode
* setSortMode('bestBefore')
* selectCategory
* 
* addItemFromSearch
* addGlobalItem
* removeItem
* 
* changeQuantity
* copyToShoppingList
