# Fleetconnect Booking Templates & Dashboard

Dit project bevat een suite van 10 standalone HTML-templates voor verschillende vervoers- en verblijfsdiensten, samen met een centraal beheer-dashboard voor Fleetconnect.

## Overzicht van Templates

### Taxi & Limousine (H-serie)
1.  **T1.html (H1)** - Standaard Taxi: Klassiek en vertrouwd ontwerp.
2.  **T2.html (H2)** - Premium Limo: Luxe donker ontwerp met goud-accenten.
3.  **T3.html (H3)** - Fleet Direct: Minimalistisch wit ontwerp voor snelle boekingen.
4.  **T4.html (H4)** - Fleet Business: Zakelijk ontwerp met BTW/Bedrijfsvelden.
5.  **T5.html (H5)** - Airport Transfer: Gespecialiseerd voor luchthavens met vluchtnummers.

### Hotels & Accommodatie (HT-serie)
6.  **H1_hotel_luxe.html (HT1)** - Luxury Stay: Elegant boekingsformulier voor high-end hotels.
7.  **H2_hotel_budget.html (HT2)** - Urban Stay: Modern en efficiënt voor stadshotels.

### Reisagentschap & Tours (RA-serie)
8.  **A1_reis_pakket.html (RA1)** - Travel Package: Voor volledige vakantiepakketten.
9.  **A2_vlucht_hotel.html (RA2)** - Flight + Hotel: Gecombineerde boekingsflow.
10. **A3_rondreis.html (RA3)** - Tour Discovery: Voor meerdaagse rondreizen met route-overzicht.

## Beheer Dashboard
- **dashboard.html**: Een centraal administratiepaneel dat ritten van alle 10 templates ontvangt via Supabase. Bevat functionaliteit voor dispatching, chauffeurstoewijzing (Driver CRUD), dagschema's, financiële rapportage en data-export.

## Kernfunctionaliteiten
- **Supabase Integratie**: Alle boekingen worden live opgeslagen in een centrale database.
- **Interactieve Kaarten**: Routevisualisatie via Leaflet.js en OSRM.
- **Meertaligheid**: Volledige ondersteuning voor NL, FR en EN.
- **Responsiviteit**: Geoptimaliseerd voor elk schermformaat.
- **Branding**: Voorzien van verplichte "Operated by Fleetconnect" en "Design by Ryzen Outsourcing" vermeldingen.

## Technische Stack
- **Frontend**: HTML5, Tailwind CSS, Font Awesome.
- **Maps**: Leaflet.js, Photon (Geocoding), OSRM (Routing).
- **Backend**: Supabase (PostgreSQL + Realtime).
- **Calendar**: FullCalendar 6.

---
Operated by Fleetconnect
Design by Ryzen Outsourcing
