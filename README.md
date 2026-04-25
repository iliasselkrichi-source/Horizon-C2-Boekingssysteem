# Taxi Booking Templates

Deze repository bevat 5 verschillende taxi booking templates, elk ontworpen voor een specifiek segment van de markt. Alle templates zijn volledig functioneel met een werkend boekingssysteem, routeberekening en lokalisatie.

## Overzicht van Templates

### 1. T1.html - Standaard Taxi Booking
*   **Stijl:** Klassiek, schoon en vertrouwd.
*   **Doel:** Algemeen taxi-vervoer.
*   **Kenmerken:** 4-staps flow, zij-aan-zij kaart en formulier in de booking sectie.
*   **Kleur:** Blauw (#1e6f8c).

### 2. T2.html - Premium Taxi / Limousine
*   **Stijl:** Luxe, donker en elegant.
*   **Doel:** VIP en limousine services.
*   **Kenmerken:** Full-screen hero, glass-morphism effecten, donkere overlay.
*   **Kleur:** Goud (#c9a03d) op Donkerblauw (#0a1a2f).

### 3. T3.html - Snelle Booking (Minimalistisch)
*   **Stijl:** Ultra-minimalistisch met veel witruimte.
*   **Doel:** Gebruikers die direct willen boeken zonder stappen.
*   **Kenmerken:** Alles-op-één-pagina formulier, geen stappenflow, direct resultaat.
*   **Kleur:** Zacht zwart (#333333) op Wit.

### 4. T4.html - Zakelijk / Corporate Taxi
*   **Stijl:** Zakelijk, strak en professioneel.
*   **Doel:** B2B vervoer en bedrijfsaccounts.
*   **Kenmerken:** Extra velden voor Bedrijfsnaam, BTW nummer en Kostenplaats. Focus op facturatie.
*   **Kleur:** Marineblauw (#1e3a5f).

### 5. T5.html - Airport Transfer Specialist
*   **Stijl:** Informatief en gericht op reizigers.
*   **Doel:** Luchthavenvervoer.
*   **Kenmerken:** Luchthavenselectie dropdown, vluchtnummer invoer, bagage-opties en informatie over wachttijden.
*   **Kleur:** Lichtblauw (#e0f2fe).

## Technische Details

*   **Framework:** Tailwind CSS voor styling.
*   **Kaarten:** Leaflet.js met OpenStreetMap (CartoDB tiles).
*   **Geocoding:** Photon API (Komoot) voor adres-suggesties.
*   **Routing:** OSRM (Open Source Routing Machine) voor routeberekening en afstand.
*   **Lokalisatie:** Ondersteuning voor Nederlands (NL), Frans (FR) en Engels (EN) via data-attributen.
*   **Responsive:** Geoptimaliseerd voor Mobiel, Tablet en Desktop.

## Gebruik
Elk HTML bestand is zelfstandig (standalone). Alle CSS en JavaScript is inline of wordt geladen via betrouwbare CDN's. Er zijn geen lokale assets nodig behalve de HTML bestanden zelf.

---
*Operated by Fleetconnect*
*Design by Ryzen Outsourcing*
