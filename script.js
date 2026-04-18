// ========== CONFIGURATIE ==========
const SB_URL = "https://orgbdqaxxkwtpvaxxuep.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2JkcWF4eGt3dHB2YXh4dWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTU0NzksImV4cCI6MjA5MTIzMTQ3OX0.TY6hWwzG3q_waVDJhxvuLfFFg5qy0HOxMjcTM0YcJ3Q";

let supabaseClient = null;
let bookingsDB = [];
let realtimeChannel = null;

// ========== INITIALISATIE ==========
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SB_URL, SB_KEY);
    console.log("✅ Supabase client geïnitialiseerd");
    loadBookingsFromSupabase();
    setupRealtimeListener();
    setMinDates();
} else {
    console.error("❌ Supabase library niet gevonden");
    loadMockData();
}

// ========== DATUMBEPERKING ==========
function setMinDates() {
    const vandaag = new Date().toISOString().split('T')[0];
    const checkIn = document.getElementById('taCheckIn');
    const checkOut = document.getElementById('taCheckOut');
    if (checkIn) checkIn.setAttribute('min', vandaag);
    if (checkOut) checkOut.setAttribute('min', vandaag);
}

// ========== REALTIME LISTENER ==========
function setupRealtimeListener() {
    if (!supabaseClient) return;
    realtimeChannel = supabaseClient
        .channel('schema-db-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'boekingen' }, (payload) => {
            console.log('🔔 Nieuwe boeking!', payload.new);
            const exists = bookingsDB.some(b => b.id === payload.new.id);
            if (!exists) {
                bookingsDB.unshift(payload.new);
                refreshUI();
            }
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') console.log('📡 Realtime actief');
        });
}

// ========== DATA LADEN ==========
async function loadBookingsFromSupabase() {
    const { data, error } = await supabaseClient.from('boekingen').select('*').order('created_at', { ascending: false });
    if (!error && data) {
        bookingsDB = data;
        refreshUI();
        console.log(`📚 ${bookingsDB.length} boekingen geladen`);
    } else {
        loadMockData();
    }
}

function loadMockData() {
    bookingsDB = [
        { id: "m1", boekingsnummer: "TA-U1-1505-01", team: "TA", unit_code: "U1", resource_id: "e63df0cc-938b-4f8b-a4c5-bb544679b91f", gast_naam: "Ahmed El Khayat", gast_contact: { email: "a@horizon.com", telefoon: "+212 111" }, check_in: "2026-06-15", check_out: "2026-06-18", metadata: { transfer: true }, totaalprijs: 1200, status: "BEVESTIGD" }
    ];
    refreshUI();
}

// ========== UI RENDERING (COMMANDER) ==========
function refreshUI() {
    renderPanel();
    renderCalendar();
}

function renderPanel() {
    const tbody = document.getElementById('bookingTable');
    if (!tbody) return;
    tbody.innerHTML = bookingsDB.map(b => `
        <tr>
            <td><span class="prefix-example">${b.boekingsnummer || '...'}</span></td>
            <td>${b.gast_naam}</td>
            <td>${b.check_in}</td>
            <td>${b.metadata?.transfer ? '🚗 Ja' : '❌'}</td>
            <td>€${b.totaalprijs}</td>
            <td><span class="badge">${b.status}</span></td>
            <td><button onclick="viewFiche('${b.id}')">Bekijk</button></td>
        </tr>
    `).join('');
}

function renderCalendar() {
    const cal = document.getElementById('calendar');
    if (!cal) return;
    cal.innerHTML = '';
    
    const nu = new Date();
    const year = nu.getFullYear();
    const month = nu.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const maandNamen = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    cal.innerHTML += `<div style="grid-column: span 7; text-align: center; font-weight: bold; margin-bottom: 10px;">${maandNamen[month]} ${year}</div>`;
    
    const dagen = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
    for (let i = 0; i < 7; i++) {
        cal.innerHTML += `<div class="cal-day-header" style="text-align: center; font-weight: bold; padding: 5px;">${dagen[i]}</div>`;
    }
    
    for (let i = 0; i < firstDay; i++) {
        cal.innerHTML += '<div class="cal-day empty"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isBezet = bookingsDB.some(b => dateStr >= b.check_in && dateStr <= b.check_out);
        cal.innerHTML += `
            <div class="cal-day ${isBezet ? 'is-bezet' : ''}">
                <strong>${d}</strong>
                ${isBezet ? '<div class="status-dot"></div>' : ''}
            </div>
        `;
    }
}

window.viewFiche = (id) => {
    const b = bookingsDB.find(x => x.id === id);
    if (!b) return;
    const metadata = b.metadata || {};
    document.getElementById('modalContent').innerHTML = `
        <p><strong>🏷️ Boekingsnummer:</strong> ${b.boekingsnummer}</p>
        <p><strong>👤 Gast:</strong> ${b.gast_naam}</p>
        <p><strong>📞 Telefoon:</strong> ${b.gast_contact?.telefoon || '-'}</p>
        <p><strong>📧 Email:</strong> ${b.gast_contact?.email || '-'}</p>
        <p><strong>📅 Verblijf:</strong> ${b.check_in} tot ${b.check_out}</p>
        <p><strong>🏠 Team/Unit:</strong> ${b.team} - ${b.unit_code}</p>
        <hr>
        <p><strong>🛠️ Diensten (Betaald):</strong> ${metadata.extra_diensten?.join(', ') || 'Geen'}</p>
        <p><strong>🏇 Activiteiten (Offerte):</strong> ${metadata.activiteiten?.join(', ') || 'Geen'}</p>
        <p><strong>🩺 Zorgwensen:</strong> ${metadata.zorg_wensen || 'Geen'}</p>
        <p><strong>📝 Speciaal:</strong> ${metadata.speciaal || 'Geen'}</p>
        <hr>
        <p><strong>💰 Prijs:</strong> €${b.totaalprijs}</p>
        <p><strong>🔖 Status:</strong> ${b.status}</p>
    `;
    document.getElementById('ficheModal')?.classList.remove('hidden');
};

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('ficheModal')?.classList.add('hidden');
});

// ========== PRIJS BEREKENING (MET CHECKBOXES) ==========
function updatePrices() {
    let totaal = 0;
    const prefix = 'ta';
    
    const checkIn = document.getElementById(`${prefix}CheckIn`)?.value;
    const checkOut = document.getElementById(`${prefix}CheckOut`)?.value;
    const unitSelect = document.getElementById(`${prefix}UnitSelect`);
    
    // 1. Basis overnachtingsprijs
    if (checkIn && checkOut && unitSelect && unitSelect.selectedOptions[0]) {
        const nachten = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
        const prijsPerNacht = parseFloat(unitSelect.selectedOptions[0].dataset.price) || 0;
        if (nachten > 0) {
            totaal += nachten * prijsPerNacht;
        }
    }

    // 2. Extra diensten optellen (checkboxes met data-price)
    document.querySelectorAll('.ta-dienst:checked').forEach(cb => {
        totaal += parseFloat(cb.dataset.price) || 0;
    });

    document.getElementById(`${prefix}Totaalprijs`).value = totaal.toFixed(2);
    
    // Team Bravo
    const tbSelect = document.getElementById('tbPackageSelect');
    if (tbSelect && tbSelect.selectedOptions[0]) {
        document.getElementById('tbTotaalprijs').value = parseFloat(tbSelect.selectedOptions[0].dataset.price).toFixed(2);
    }
}

// ========== BOEKING VERZENDEN ==========
async function handleBooking(prefix) {
    const unitSelect = document.getElementById(`${prefix}UnitSelect`);
    const checkIn = document.getElementById(`${prefix}CheckIn`)?.value;
    const checkOut = document.getElementById(`${prefix}CheckOut`)?.value;
    
    if (!checkIn || !checkOut) {
        alert("❌ Selecteer beide datums.");
        return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
        alert("❌ Check-out moet na check-in liggen.");
        return;
    }
    
    // Verzamel geselecteerde opties uit checkboxes
    const diensten = Array.from(document.querySelectorAll('.ta-dienst:checked')).map(cb => cb.value);
    const activiteiten = Array.from(document.querySelectorAll('.ta-activiteit:checked')).map(cb => cb.value);
    
    const record = {
        team: prefix.toUpperCase(),
        unit_code: unitSelect.value,
        resource_id: unitSelect.selectedOptions[0].dataset.resource,
        gast_naam: document.getElementById(`${prefix}GuestName`)?.value || '',
        gast_contact: {
            email: document.getElementById(`${prefix}GuestEmail`)?.value || '',
            telefoon: document.getElementById(`${prefix}GuestPhone`)?.value || ''
        },
        check_in: checkIn,
        check_out: checkOut,
        metadata: {
            transfer: document.getElementById(`${prefix}Transfer`)?.checked || false,
            speciaal: document.getElementById(`${prefix}Speciaal`)?.value || '',
            woning_type: unitSelect.selectedOptions[0].dataset.type || "Onbekend",
            extra_diensten: diensten,
            activiteiten: activiteiten,
            zorg_wensen: document.getElementById(`${prefix}ZorgWensen`)?.value || ''
        },
        totaalprijs: parseFloat(document.getElementById(`${prefix}Totaalprijs`)?.value) || 0,
        status: "NIEUW"
    };
    
    console.log("📤 Boeking:", record);
    
    const { error } = await supabaseClient.from('boekingen').insert([record]);
    if (error) {
        alert("❌ Fout: " + error.message);
    } else {
        alert("✅ Boeking succesvol! De activiteiten staan genoteerd voor de offerte.");
        location.reload();
    }
}

// ========== EVENT LISTENERS ==========
document.getElementById('taCheckIn')?.addEventListener('change', updatePrices);
document.getElementById('taCheckOut')?.addEventListener('change', updatePrices);
document.getElementById('taUnitSelect')?.addEventListener('change', updatePrices);
document.querySelectorAll('.ta-optie').forEach(el => {
    el.addEventListener('change', updatePrices);
});
document.getElementById('tbPackageSelect')?.addEventListener('change', updatePrices);
document.getElementById('taBookBtn')?.addEventListener('click', () => handleBooking('ta'));
document.getElementById('tbBookBtn')?.addEventListener('click', () => handleBooking('tb'));

// Initialiseer prijzen
updatePrices();
