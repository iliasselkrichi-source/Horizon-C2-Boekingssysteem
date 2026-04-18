// ========== INITIALISATIE ==========
const SB_URL = "https://orgbdqaxxkwtpvaxxuep.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2JkcWF4eGt3dHB2YXh4dWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTU0NzksImV4cCI6MjA5MTIzMTQ3OX0.TY6hWwzG3q_waVDJhxvuLfFFg5qy0HOxMjcTM0YcJ3Q";

let supabaseClient = null;
let bookingsDB = [];
let realtimeChannel = null;

// Start de motor
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SB_URL, SB_KEY);
    console.log("✅ Supabase client geïnitialiseerd");
    loadBookingsFromSupabase();
    setupRealtimeListener();
} else {
    console.error("❌ Supabase library niet gevonden. Zorg voor de <script> tag in je HTML.");
    loadMockData();
}

// ========== REALTIME LISTENER (DE ONTVANGER) ==========
function setupRealtimeListener() {
    if (!supabaseClient) return;

    realtimeChannel = supabaseClient
        .channel('schema-db-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'boekingen' }, (payload) => {
            console.log('🔔 Nieuwe boeking ontvangen via Realtime!', payload.new);
            const exists = bookingsDB.some(b => b.id === payload.new.id);
            if (!exists) {
                bookingsDB.unshift(payload.new);
                refreshUI();
            }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'boekingen' }, (payload) => {
            console.log('🔄 Boeking geüpdatet!', payload.new);
            const index = bookingsDB.findIndex(b => b.id === payload.new.id);
            if (index !== -1) {
                bookingsDB[index] = payload.new;
                refreshUI();
            }
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') console.log('📡 Realtime status: SUBSCRIBED');
        });
}

// ========== DATA LADEN ==========
async function loadBookingsFromSupabase() {
    const { data, error } = await supabaseClient
        .from('boekingen')
        .select('*')
        .order('created_at', { ascending: false });

    if (!error && data) {
        bookingsDB = data;
        refreshUI();
        console.log(`📚 ${bookingsDB.length} boekingen geladen vanuit Supabase`);
    } else {
        console.error("Fout bij laden:", error);
        loadMockData();
    }
}

function loadMockData() {
    bookingsDB = [
        { id: "m1", boekingsnummer: "TA-U1-1505-01", team: "TA", unit_code: "U1", resource_id: "VILLA_ALHOURA", gast_naam: "Ahmed El Khayat", gast_contact: { email: "a@horizon.com", telefoon: "+212 111" }, check_in: "2026-06-15", check_out: "2026-06-18", metadata: { transfer: true }, totaalprijs: 1200, status: "BEVESTIGD" }
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
    if (!tbody) return; // Stop als we niet op de Commander pagina zijn
    
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
    const year = 2026, month = 5; // Juni 2026 (0-indexed in JS)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Lege vakjes voor het begin van de maand
    for (let i = 0; i < firstDay; i++) {
        cal.innerHTML += '<div class="cal-day"></div>';
    }

    // Dagen van de maand
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayBookings = bookingsDB.filter(b => dateStr >= b.check_in && dateStr <= b.check_out);

        const markers = dayBookings.map(b => `
            <div class="booking-marker" style="background:${b.team === 'TA' ? '#dbeafe' : '#fef3c7'}">
                ${b.unit_code}${b.metadata?.transfer ? ' 🚗' : ''}
            </div>
        `).join('');

        cal.innerHTML += `<div class="cal-day"><strong>${d}</strong>${markers}</div>`;
    }
}

// ========== MODAL LOGICA ==========
window.viewFiche = (id) => {
    const b = bookingsDB.find(x => x.id === id);
    if (!b) return;

    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <p><strong>🏷️ Boekingsnummer:</strong> ${b.boekingsnummer}</p>
            <p><strong>👤 Gast:</strong> ${b.gast_naam}</p>
            <p><strong>📞 Telefoon:</strong> ${b.gast_contact?.telefoon || '-'}</p>
            <p><strong>📧 Email:</strong> ${b.gast_contact?.email || '-'}</p>
            <p><strong>📅 Verblijf:</strong> ${b.check_in} tot ${b.check_out}</p>
            <p><strong>🏠 Team/Unit:</strong> ${b.team} - ${b.unit_code}</p>
            <p><strong>🚗 Transfer:</strong> ${b.metadata?.transfer ? 'Ja' : 'Nee'}</p>
            <p><strong>💰 Prijs:</strong> €${b.totaalprijs}</p>
            <p><strong>🔖 Status:</strong> ${b.status}</p>
        `;
    }
    document.getElementById('ficheModal')?.classList.remove('hidden');
};

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('ficheModal')?.classList.add('hidden');
});
