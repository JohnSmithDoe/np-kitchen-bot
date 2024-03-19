# NP-Kitchen-Bot

### [Github-page](https://johnsmithdoe.github.io/np-kitchen-bot/)

## Todo rxStore
* Think about: create edit; success fail
* Is it feasable to have one feature for each list
  * globalState with a map of lists could get rid of a lot of code (action + listid)
    * one reducer, one action and effects instead of 4
    * different types? storage and shopping

globalState = {
lists: Record<string, Itemlist<any>>
}

storageList(itemList<any>): itemList is ItemList<IStorageItem>
=> itemList.type === 'storage'

     
## Todos:
* Kalender mit wiederkehrenden Aufgaben
* Rezept hinzufügen, vorschlagen
### Vorräte
* Ansicht nach
  * Rezept
  * Standort/Geschäft
  * Anzahl/Soll/Ist
### Inventur
* Erfassen des aktuellen stands
  * Barcode scanning
### Shopping
* Rezept-Inhalte (fehlende) oder Artikel hinzufügen
### Recipes
* Liste von Rezepten mit Zutaten
### Allgemein
* Units: 3 x Kartoffeln, 3 x Spaghetti, 3 x Mehl ...
  * Besser? 500 g Kartoffeln ..., 3 Packungen Spaghetti, 2 kg Mehl ...
  * Alternative UI: Bestandsregler (viel - wenig) mit min max ...
* min amount and warning -> background as well...
* name, zusatz
* multi term search
* abteilung im supermarkt, standort (oder einfach kategorie)
* multiple todo lists... 

## Feature-Set

### Use Cases
* Zur Einkaufsliste hinzufügen, wenn man etwas leer macht
* Zum Vorrat hinzufügen, wenn man etwas einkauft

### Vorräte
* Ansicht nach
  * Kategorie
  * Alphabetisch
  * Ablaufdatum

### Inventur
* Erfassen des aktuellen stands
  * Eingabe
  * Auswahl

### Shopping
* Vom Vorrat übertragen,
* Abhaken
* Zum Vorrat hinzufügen und entfernen
  https://ionicframework.com/docs/angular/your-first-app/saving-photos

### Future Tasks
## Barcode scanning
  https://ionic.io/blog/how-to-build-an-ionic-barcode-scanner-with-capacitor

## Bilder speichern mit filesystem api


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
