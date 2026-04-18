// ========== CONFIGURATIE ==========
const SB_URL = "https://orgbdqaxxkwtpvaxxuep.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2JkcWF4eGt3dHB2YXh4dWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTU0NzksImV4cCI6MjA5MTIzMTQ3OX0.TY6hWwzG3q_waVDJhxvuLfFFg5qy0HOxMjcTM0YcJ3Q";

let supabaseClient = null;
let bookingsDB = [];
let realtimeChannel = null;

// Prijzen voor extra diensten (optioneel)
const dienstenPrijzen = {
    'schoonmaak_extra': 25,
    'chef_prive': 150,
    'boodschappen': 35,
    'wasserij': 20,
    'babysit': 50
};

const activiteitenPrijzen = {
    'paardrijden_strand': 45,
    'quad_tour': 60,
    'surf_les': 40,
    'kamelentocht': 30,
    'kookworkshop': 55
};

// ========== INITIALISATIE ==========
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SB_URL, SB_KEY);
    console.log("✅ Supabase client geïnitialiseerd");
    loadBookingsFromSupabase();
    setupRealtimeListener();
} else {
    console.error("❌ Supabase library niet gevonden");
    loadMockData();
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

// ========== UI RENDERING ==========
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
    const year = 2026, month = 5;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) cal.innerHTML += '<div class="cal-day"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayBookings = bookingsDB.filter(b => dateStr >= b.check_in && dateStr <= b.check_out);
        const markers = dayBookings.map(b => `<div class="booking-marker" style="background:${b.team === 'TA' ? '#dbeafe' : '#fef3c7'}">${b.unit_code}${b.metadata?.transfer ? ' 🚗' : ''}</div>`).join('');
        cal.innerHTML += `<div class="cal-day"><strong>${d}</strong>${markers}</div>`;
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
        <p><strong>🚗 Transfer:</strong> ${metadata.transfer ? 'Ja' : 'Nee'}</p>
        <p><strong>🛠️ Extra Diensten:</strong> ${metadata.extra_diensten?.join(', ') || 'Geen'}</p>
        <p><strong>🏇 Activiteiten:</strong> ${metadata.activiteiten?.join(', ') || 'Geen'}</p>
        <p><strong>🩺 Zorgwensen:</strong> ${metadata.zorg_wensen || 'Geen'}</p>
        <p><strong>📝 Speciaal:</strong> ${metadata.speciaal || 'Geen'}</p>
        <p><strong>💰 Prijs:</strong> €${b.totaalprijs}</p>
        <p><strong>🔖 Status:</strong> ${b.status}</p>
    `;
    document.getElementById('ficheModal')?.classList.remove('hidden');
};

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('ficheModal')?.classList.add('hidden');
});

// ========== PRIJS BEREKENING (MET EXTRA DIENSTEN) ==========
function updatePrices() {
    // Team Alpha prijsberekening
    const taIn = document.getElementById('taCheckIn')?.value;
    const taOut = document.getElementById('taCheckOut')?.value;
    const taSelect = document.getElementById('taUnitSelect');
    let totaal = 0;
    
    if (taIn && taOut && taSelect) {
        const nachten = (new Date(taOut) - new Date(taIn)) / (1000 * 60 * 60 * 24);
        const prijsPerNacht = parseFloat(taSelect.selectedOptions[0]?.dataset.price);
        if (nachten > 0 && prijsPerNacht) {
            totaal = nachten * prijsPerNacht;
        }
    }
    
    // Extra kosten voor geselecteerde diensten
    const dienstenSelect = document.getElementById('taDiensten');
    if (dienstenSelect) {
        Array.from(dienstenSelect.selectedOptions).forEach(opt => {
            totaal += dienstenPrijzen[opt.value] || 0;
        });
    }
    
    // Extra kosten voor geselecteerde activiteiten
    const activiteitenSelect = document.getElementById('taActiviteiten');
    if (activiteitenSelect) {
        Array.from(activiteitenSelect.selectedOptions).forEach(opt => {
            totaal += activiteitenPrijzen[opt.value] || 0;
        });
    }
    
    document.getElementById('taTotaalprijs').value = totaal.toFixed(2);
    
    // Team Bravo prijs (vast)
    const tbSelect = document.getElementById('tbPackageSelect');
    if (tbSelect) {
        document.getElementById('tbTotaalprijs').value = parseFloat(tbSelect.selectedOptions[0]?.dataset.price).toFixed(2);
    }
}

// ========== BOEKING VERZENDEN ==========
async function handleBooking(prefix) {
    const unitSelect = document.getElementById(`${prefix}UnitSelect`) || document.getElementById(`${prefix}PackageSelect`);
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
    
    // Verzamel extra velden
    const dienstenSelect = document.getElementById(`${prefix}Diensten`);
    const activiteitenSelect = document.getElementById(`${prefix}Activiteiten`);
    
    const geselecteerdeDiensten = dienstenSelect ? Array.from(dienstenSelect.selectedOptions).map(o => o.value) : [];
    const geselecteerdeActiviteiten = activiteitenSelect ? Array.from(activiteitenSelect.selectedOptions).map(o => o.value) : [];
    
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
            extra_diensten: geselecteerdeDiensten,
            activiteiten: geselecteerdeActiviteiten,
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
        alert("✅ Boeking succesvol!");
        // Reset formulier
        document.getElementById(`${prefix}GuestName`).value = '';
        document.getElementById(`${prefix}GuestEmail`).value = '';
        document.getElementById(`${prefix}GuestPhone`).value = '';
        document.getElementById(`${prefix}CheckIn`).value = '';
        document.getElementById(`${prefix}CheckOut`).value = '';
        document.getElementById(`${prefix}Transfer`).checked = false;
        document.getElementById(`${prefix}Speciaal`).value = '';
        if (document.getElementById(`${prefix}ZorgWensen`)) document.getElementById(`${prefix}ZorgWensen`).value = '';
        if (dienstenSelect) dienstenSelect.selectedIndex = -1;
        if (activiteitenSelect) activiteitenSelect.selectedIndex = -1;
        updatePrices();
    }
}

// ========== EVENT LISTENERS ==========
document.getElementById('taCheckIn')?.addEventListener('change', updatePrices);
document.getElementById('taCheckOut')?.addEventListener('change', updatePrices);
document.getElementById('taUnitSelect')?.addEventListener('change', updatePrices);
document.getElementById('taDiensten')?.addEventListener('change', updatePrices);
document.getElementById('taActiviteiten')?.addEventListener('change', updatePrices);
document.getElementById('tbPackageSelect')?.addEventListener('change', updatePrices);
document.getElementById('taBookBtn')?.addEventListener('click', () => handleBooking('ta'));
document.getElementById('tbBookBtn')?.addEventListener('click', () => handleBooking('tb'));

// Initialiseer prijzen
updatePrices();
