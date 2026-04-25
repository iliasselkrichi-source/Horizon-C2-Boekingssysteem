# Taxi Booking Templates

Dit project bevat 5 verschillende taxi/transfer boekings templates, elk geoptimaliseerd voor een specifieke niche binnen de transportsector. Alle templates zijn volledig zelfstandig werkend (standalone) en bevatten een functioneel boekingssysteem met kaartintegratie en adres-suggesties.

## Overzicht van Templates

### T1: Standaard Taxi Booking (`T1.html`)
*   **Stijl:** Klassiek, schoon en vertrouwd.
*   **Focus:** Algemene taxi diensten.
*   **Kenmerken:** Blauwe accenten (#1e6f8c), 50/50 split layout voor kaart en formulier, 4-stappen boekingsflow.

### T2: Premium Taxi / Limousine (`T2.html`)
*   **Stijl:** Luxe, donker en elegant.
*   **Focus:** VIP vervoer en limousines.
*   **Kenmerken:** Donkerblauw/zwart palet met gouden accenten (#c9a03d), full-screen hero, glass-morphism kaarten en luxe extra's.

### T3: Snelle Booking - Minimalistisch (`T3.html`)
*   **Stijl:** Zeer eenvoudig, wit en modern.
*   **Focus:** Snelle conversie.
*   **Kenmerken:** GEEN stappenflow. Het volledige formulier is direct zichtbaar op één pagina voor maximale snelheid.

### T4: Zakelijk / Corporate Taxi (`T4.html`)
*   **Stijl:** Professioneel, strak en zakelijk.
*   **Focus:** B2B vervoer.
*   **Kenmerken:** Marineblauw (#1e3a5f), extra velden voor bedrijfsnaam, BTW-nummer en kostenplaatsen.

### T5: Airport Transfer Specialist (`T5.html`)
*   **Stijl:** Duidelijk en informatief.
*   **Focus:** Luchthavenvervoer.
*   **Kenmerken:** Selectiemenu voor luchthavens (Zaventem, Charleroi, etc.), velden voor vluchtnummers en bagage, routeberekening vanaf luchthavens.

## Technische Specificaties

*   **Frontend:** HTML5, Tailwind CSS, Font Awesome.
*   **Kaarten:** Leaflet.js met CartoDB tiles.
*   **Geocoding:** Photon API (Komoot).
*   **Routing:** OSRM (Open Source Routing Machine).
*   **Talen:** Volledige ondersteuning voor Nederlands, Frans en Engels via `data-i18n`.
*   **Responsiviteit:** Volledig responsive (Mobiel, Tablet, Desktop).

## Verplichte Elementen (Alle Templates)

Elk template voldoet aan de volgende vereisten:
1.  **Semantische HTML:** Gebruik van `<header>`, `<main>`, `<section>`, `<footer>`.
2.  **Sectie ID's:** `main-header`, `hero`, `booking-section`, `map`, `services`, `about`, `main-footer`.
3.  **Branding:** Verplichte footer teksten: "Operated by Fleetconnect" en "Design by Ryzen Outsourcing".
4.  **Placeholders:** Gebruik van `placehold.co` voor alle afbeeldingen.
5.  **Documentatie:** Volledig voorzien van Nederlandstalig commentaar per sectie en functie.

## Gebruik

Open een willekeurig `.html` bestand direct in een moderne webbrower om de template en het boekingssysteem te bekijken en te testen. Er is geen build-stap of server nodig.

---
© 2024 - Ryzen Outsourcing & Fleetconnect
