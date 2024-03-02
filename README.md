# NP-Kitchen-Bot

## Todos:
* Units: 3 x Kartoffeln, 3 x Spaghetti, 3 x Mehl ...
  * Besser? 500 g Kartoffeln ..., 3 Packungen Spaghetti, 2 kg Mehl ...
  * Alt UI: Bestandsregler (viel - wenig) mit min max ...
* min amount and warning
* name, zusatz
* multi search
* clear category on search or search only category
* sort
* created timestemp
* abteilung im supermarkt

## Feedback

## ToTest
* swipe ratio

colors
{"Raw umber":"916953","Rosy brown":"cf8e80","Melon":"fcb5b5","Mimi Pink":"fcddf2","Snow":"faf6f6"}

<palette>
  <color name="Raw umber" hex="916953" r="145" g="105" b="83" />
  <color name="Rosy brown" hex="cf8e80" r="207" g="142" b="128" />
  <color name="Melon" hex="fcb5b5" r="252" g="181" b="181" />
  <color name="Mimi Pink" hex="fcddf2" r="252" g="221" b="242" />
  <color name="Snow" hex="faf6f6" r="250" g="246" b="246" />
</palette>


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



Android
=======

Build
----

"buildOptimizer": false, in production.. modals not showing
https://github.com/ionic-team/ionic-framework/issues/28385
> ionic serve --prod

>ionic capacitor build android

Run and Build Apk
---
Install Android Studio and open it once
Open the android folder as a new project
Enable SVM Mode in Bios (on AMD ryzen)
Build signed apk from menu
