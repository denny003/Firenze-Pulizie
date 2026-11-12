// ==============================================================================
// FIRENZE PULIZIE — AUTH GUARD, RUOLI & STATO CONDIVISO MULTI-PROFILO
// Gestisce l'autenticazione unificata, il blocco accessi non autorizzati (RBAC)
// e la sincronizzazione tra Squadra -> Impresa (Report/Foto/Fatture) -> Rete
// ==============================================================================

const SESSION_KEY = 'fp_auth_session_v1';
const SHARED_DATA_KEY = 'fp_shared_platform_data_v1';

// Catalogo profili abilitati (con isolamento per Impresa e per Squadra)
export const DEMO_USERS = [
  {
    id: 'usr_admin_01',
    email: 'admin@puliziefiorentine.it',
    username: 'admin',
    password: 'Admin2026!',
    role: 'ADMIN_RETE',
    name: 'Direzione Centrale Rete',
    avatar: 'AD',
    landingUrl: 'dashboard-admin.html',
    badgeLabel: 'Amministratore Totale Portale'
  },
  {
    id: 'usr_partner_c01',
    email: 'partner@cleanservice.it',
    username: 'cleanservice',
    password: 'Partner2026!',
    role: 'PARTNER',
    companyId: 'C01',
    companyName: 'Clean Service Firenze Srl',
    piva: 'IT06548920481',
    zones: ['FI-NOVOLI', 'FI-CENTRO', 'FI-RIFREDI'],
    zonesLabel: 'Novoli, Centro Storico (ZTL), Rifredi',
    rating: 4.9,
    name: 'Marco Taddei (Titolare)',
    avatar: 'CS',
    landingUrl: 'dashboard-impresa.html',
    badgeLabel: 'Impresa Partner Accreditata'
  },
  {
    id: 'usr_partner_c02',
    email: 'info@toscanapulizie.it',
    username: 'toscanapulizie',
    password: 'Toscana2026!',
    role: 'PARTNER',
    companyId: 'C02',
    companyName: 'Toscana Pulizie & Sanificazioni Srl',
    piva: 'IT05891230485',
    zones: ['FI-CAMPO-MARTE', 'FI-GAVINANA', 'FI-CENTRO'],
    zonesLabel: 'Campo di Marte, Gavinana, Centro',
    rating: 4.8,
    name: ' Giulia Ferri (Direzione)',
    avatar: 'TP',
    landingUrl: 'dashboard-impresa.html',
    badgeLabel: 'Impresa Partner Accreditata'
  },
  {
    id: 'usr_squadra_alfa',
    email: 'squadra01@rete.it',
    username: 'PIN-101',
    pin: 'PIN-101',
    password: 'Squadra2026!',
    role: 'SQUADRA',
    companyId: 'C01',
    companyName: 'Clean Service Firenze Srl',
    teamId: 'T-ALFA',
    teamName: 'Squadra Alfa',
    van: 'Fiat Doblò Cargo (FZ 482 AA)',
    leader: 'Marco T.',
    members: 'Marco T., Luca M.',
    name: 'Squadra Alfa (Marco T. & Luca M.)',
    avatar: 'SA',
    landingUrl: 'app-squadra.html',
    badgeLabel: 'Team Operativo sul Campo'
  },
  {
    id: 'usr_squadra_beta',
    email: 'squadra02@rete.it',
    username: 'PIN-102',
    pin: 'PIN-102',
    password: 'Squadra2026!',
    role: 'SQUADRA',
    companyId: 'C01',
    companyName: 'Clean Service Firenze Srl',
    teamId: 'T-BETA',
    teamName: 'Squadra Beta',
    van: 'Renault Kangoo (GB 910 XY)',
    leader: 'Andrea B.',
    members: 'Andrea B., Sara G.',
    name: 'Squadra Beta (Andrea B. & Sara G.)',
    avatar: 'SB',
    landingUrl: 'app-squadra.html',
    badgeLabel: 'Team Operativo sul Campo'
  }
];

// Stato iniziale condiviso per testare l'intero flusso:
// Admin assegna Lead -> Impresa istruisce Squadra -> Squadra fa Foto e Report -> Impresa gestisce Lamentele e Fattura
const INITIAL_SHARED_DATA = {
  jobs: [
    {
      id: 'JOB-FI-101',
      code: 'INT-2026-0891',
      companyId: 'C01',
      companyName: 'Clean Service Firenze Srl',
      teamId: 'T-ALFA',
      teamName: 'Squadra Alfa',
      client: 'Studio Legale Associato Tornabuoni',
      sector: 'COMMERCIALE',
      zone: 'Centro Storico (ZTL)',
      address: 'Via de\' Tornabuoni 14, Firenze',
      scheduledDate: 'Oggi',
      timeSlot: '18:30 - 20:30',
      ztlWarning: 'Zona ZTL Attiva • Permesso furgone FZ 482 AA registrato',
      accessInstructions: 'Citofono "Rossi & Associati", piano 2 con ascensore. Chiavi in bacheca sicurezza.',
      alarmCode: '4821# (Disattivare all\'ingresso e riattivare prima di chiudere)',
      specialInstructions: 'ATTENZIONE: Il cliente ha richiesto particolare cura sul pavimento in cotto antico della sala riunioni e foto obbligatoria dei 3 servizi igienici e della sala riunioni a fine lavoro.',
      requirePhotos: true,
      minPhotos: 2,
      agreedAmount: 180.00,
      billingCycle: 'A Intervento / Mensile',
      status: 'IN_CORSO', // PROGRAMMATO, IN_CORSO, COMPLETATO
      checkinTime: '18:28',
      checkoutTime: null,
      checklist: [
        { id: 'ck1', text: 'Igienizzazione scrivanie, schermi e telefoni (12 postazioni)', done: true },
        { id: 'ck2', text: 'Sanificazione completa dei 3 servizi igienici con ricarica dispenser', done: true },
        { id: 'ck3', text: 'Svuotamento cestini e raccolta differenziata', done: true },
        { id: 'ck4', text: 'Aspirazione e lavaggio specifico pavimento in cotto antico sala riunioni', done: false },
        { id: 'ck5', text: 'Spolvero battiscopa, verifica chiusura finestre e inserimento allarme', done: false }
      ],
      photos: [
        {
          id: 'ph1',
          type: 'DOPO',
          label: 'Sala Riunioni Cotto Trattato',
          timestamp: '19:15',
          dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0f172a"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><text x="200" y="105" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="36">✨🏢</text><text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">SALA RIUNIONI - COTTO LUCIDO</text><text x="200" y="170" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Via Tornabuoni 14 • Certificato Squadra Alfa</text><rect x="20" y="245" width="360" height="35" rx="6" fill="#065f46"/><text x="200" y="268" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="12">✓ VERIFICATO GPS • ORE 19:15</text></svg>`)
        },
        {
          id: 'ph2',
          type: 'DOPO',
          label: 'Bagni Direzionali Sanificati',
          timestamp: '19:40',
          dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0f172a"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/><text x="200" y="105" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="36">🧼🚿</text><text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">SERVIZI IGIENICI SANIFICATI</text><text x="200" y="170" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Sigillo Igienico Applicato • Squadra Alfa</text><rect x="20" y="245" width="360" height="35" rx="6" fill="#065f46"/><text x="200" y="268" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="12">✓ VERIFICATO GPS • ORE 19:40</text></svg>`)
        }
      ],
      operatorNotes: '',
      reportGenerated: false,
      complaintStatus: 'NESSUNA', // NESSUNA, SEGNALATA, RISOLTA_CON_PROVA
      complaintNotes: '',
      invoiceStatus: 'IN_ATTESA_REPORT', // IN_ATTESA_REPORT, DA_FATTURARE, BLOCCATA_RECLAMO, FATTURATO
      invoiceNumber: null
    },
    {
      id: 'JOB-FI-102',
      code: 'INT-2026-0888',
      companyId: 'C01',
      companyName: 'Clean Service Firenze Srl',
      teamId: 'T-ALFA',
      teamName: 'Squadra Alfa',
      client: 'Tech Hub Coworking Novoli',
      sector: 'COMMERCIALE',
      zone: 'Novoli / San Donato',
      address: 'Via Baracca 102, Firenze',
      scheduledDate: 'Oggi',
      timeSlot: '06:45 - 08:45',
      ztlWarning: null,
      accessInstructions: 'Ingresso con badge elettronico n. 04. Spegnere luci corridoio centrale.',
      alarmCode: '1190#',
      specialInstructions: 'Pulizia approfondita area break e macchine caffè prima dell\'arrivo dei coworker alle 08:45. Fotografare sala open space e cucina.',
      requirePhotos: true,
      minPhotos: 2,
      agreedAmount: 220.00,
      billingCycle: 'Canone Mensile',
      status: 'COMPLETATO',
      checkinTime: '06:42',
      checkoutTime: '08:38',
      checklist: [
        { id: 'ck21', text: 'Sanificazione 40 postazioni coworking e sale call', done: true },
        { id: 'ck22', text: 'Pulizia approfondita area cucina e bancone break', done: true },
        { id: 'ck23', text: 'Lavaggio meccanizzato pavimento open space 450 mq', done: true },
        { id: 'ck24', text: 'Controllo e rifornimento materiale igienico 4 bagni', done: true }
      ],
      photos: [
        {
          id: 'ph201',
          type: 'PRIMA',
          label: 'Area Break Prima dell\'Intervento',
          timestamp: '06:48',
          dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#1e293b"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#334155" stroke="#f59e0b" stroke-width="2"/><text x="200" y="105" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="36">☕📦</text><text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">PRIMA: AREA BREAK COWORKING</text><text x="200" y="170" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">Stato iniziale ore 06:48 • Via Baracca 102</text><rect x="20" y="245" width="360" height="35" rx="6" fill="#78350f"/><text x="200" y="268" text-anchor="middle" fill="#fde68a" font-family="monospace" font-size="12">FOTO INIZIO CANTIERE • 06:48</text></svg>`)
        },
        {
          id: 'ph202',
          type: 'DOPO',
          label: 'Open Space & Area Break Igienizzati',
          timestamp: '08:32',
          dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0f172a"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/><text x="200" y="105" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="36">✨💻</text><text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">DOPO: OPEN SPACE & CUCINA</text><text x="200" y="170" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Sanificazione completata • Squadra Alfa</text><rect x="20" y="245" width="360" height="35" rx="6" fill="#065f46"/><text x="200" y="268" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="12">✓ FINE LAVORO CERTIFICATO • 08:32</text></svg>`)
        }
      ],
      operatorNotes: 'Tutto regolare. Segnaliamo che nella sala riunioni B un cestino era danneggiato, sostituito sacco e pulita macchia caffè vicino al distributore.',
      reportGenerated: true,
      complaintStatus: 'SEGNALATA',
      complaintNotes: 'Il referente del coworking ha chiesto se era stata passata la macchina lavasciuga nel corridoio Est perché aveva visto un alone.',
      invoiceStatus: 'BLOCCATA_RECLAMO',
      invoiceNumber: null
    },
    {
      id: 'JOB-FI-103',
      code: 'INT-2026-0885',
      companyId: 'C01',
      companyName: 'Clean Service Firenze Srl',
      teamId: 'T-BETA',
      teamName: 'Squadra Beta',
      client: 'Condominio Viale Belfiore 28',
      sector: 'CONDOMINIO',
      zone: 'Porta al Prato / Centro',
      address: 'Viale Belfiore 28, Firenze',
      scheduledDate: 'Oggi',
      timeSlot: '10:30 - 12:15',
      ztlWarning: null,
      accessInstructions: 'Chiavi portone nel cilindro esterno lato giardino. Acqua nel sottoscala A.',
      alarmCode: 'Nessun allarme',
      specialInstructions: 'Pulire bene la vetrata d\'ingresso e la cabina ascensore (specchio e pulsantiera). Fare foto androne a fine lavoro per l\'Amministratore.',
      requirePhotos: true,
      minPhotos: 2,
      agreedAmount: 145.00,
      billingCycle: 'Mensile Condominio',
      status: 'COMPLETATO',
      checkinTime: '10:26',
      checkoutTime: '12:10',
      checklist: [
        { id: 'ck31', text: 'Spazzatura e lavaggio 2 rampe scale (6 piani)', done: true },
        { id: 'ck32', text: 'Detersione vetrata portone principale e specchio ascensore', done: true },
        { id: 'ck33', text: 'Lucidatura corrimano in ottone e cassette postali', done: true },
        { id: 'ck34', text: 'Svuotamento cestino pubblicità e pulizia cortile ingresso', done: true }
      ],
      photos: [
        {
          id: 'ph301',
          type: 'DOPO',
          label: 'Androne Condominiale e Vetrate',
          timestamp: '12:05',
          dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0f172a"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><text x="200" y="105" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="36">🏛️✨</text><text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">ANDRONE E VETRATE INGRESSO</text><text x="200" y="170" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Condominio Viale Belfiore 28 • Squadra Beta</text><rect x="20" y="245" width="360" height="35" rx="6" fill="#065f46"/><text x="200" y="268" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="12">✓ CERTIFICATO PER AMMINISTRATORE • 12:05</text></svg>`)
        }
      ],
      operatorNotes: 'Scale e vetrate completate. Segnalato al portiere una lampadina fulminata al 3° piano.',
      reportGenerated: true,
      complaintStatus: 'NESSUNA',
      complaintNotes: '',
      invoiceStatus: 'DA_FATTURARE',
      invoiceNumber: null
    },
    {
      id: 'JOB-FI-201',
      code: 'INT-2026-0895',
      companyId: 'C02',
      companyName: 'Toscana Pulizie & Sanificazioni Srl',
      teamId: 'T-DELTA',
      teamName: 'Squadra Medica Delta',
      client: 'Clinica Odontoiatrica Firenze Est',
      sector: 'COMMERCIALE',
      zone: 'Campo di Marte',
      address: 'Viale dei Mille 85, Firenze',
      scheduledDate: 'Oggi',
      timeSlot: '13:30 - 15:00',
      ztlWarning: null,
      accessInstructions: 'Citofono Direzione Medica, 1° piano.',
      alarmCode: '9012*',
      specialInstructions: 'Protocollo sanificazione presidi medico-chirurgici per i 3 riuniti odontoiatrici.',
      requirePhotos: true,
      minPhotos: 2,
      agreedAmount: 260.00,
      billingCycle: 'Mensile',
      status: 'COMPLETATO',
      checkinTime: '13:28',
      checkoutTime: '14:55',
      checklist: [
        { id: 'ck41', text: 'Sanificazione sale operative odontoiatriche 1, 2 e 3', done: true },
        { id: 'ck42', text: 'Disinfezione sala d\'attesa e reception', done: true },
        { id: 'ck43', text: 'Sterilizzazione superfici e ritiro rifiuti speciali', done: true }
      ],
      photos: [
        {
          id: 'ph401',
          type: 'DOPO',
          label: 'Sala Odontoiatrica 1 Sanificata',
          timestamp: '14:50',
          dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0f172a"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/><text x="200" y="105" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="36">🦷🏥</text><text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">SALA ODONTOIATRICA SANIFICATA</text><text x="200" y="170" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Clinica Firenze Est • Toscana Pulizie</text><rect x="20" y="245" width="360" height="35" rx="6" fill="#065f46"/><text x="200" y="268" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="12">✓ PROTOCOLLO SANITARIO • 14:50</text></svg>`)
        }
      ],
      operatorNotes: 'Sanificazione eseguita con presidio PMC lotto #442.',
      reportGenerated: true,
      complaintStatus: 'NESSUNA',
      complaintNotes: '',
      invoiceStatus: 'DA_FATTURARE',
      invoiceNumber: null
    }
  ]
};

/**
 * Autentica un utente riconoscendo automaticamente il suo ruolo dalle credenziali
 * (Email, Username o Codice PIN Squadra)
 */
export function authenticateCredentials(identifier, password) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const matchedUser = DEMO_USERS.find(u => {
    const matchId =
      u.email.toLowerCase() === cleanId ||
      u.username.toLowerCase() === cleanId ||
      (u.pin && u.pin.toLowerCase() === cleanId);
    return matchId && u.password === cleanPass;
  });

  if (!matchedUser) {
    return {
      success: false,
      message: 'Credenziali non riconosciute. Verifica Email/PIN e Password.'
    };
  }

  const sessionPayload = {
    ...matchedUser,
    loginAt: new Date().toISOString()
  };
  delete sessionPayload.password;

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
  return {
    success: true,
    user: sessionPayload
  };
}

/**
 * Restituisce la sessione corrente attiva
 */
export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Esegue il logout cancellando la sessione e reindirizzando al login
 */
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

/**
 * Protegge una pagina verificando che l'utente sia autenticato e possieda
 * uno dei ruoli consentiti per quella specifica landing/dashboard.
 * Se un utente con ruolo diverso tenta di aprire la pagina, viene bloccato
 * e reindirizzato esclusivamente alla propria area di competenza.
 */
export function enforceRoleGuard(allowedRoles = []) {
  const session = getCurrentSession();

  if (!session || !session.role) {
    window.location.replace('login.html?reason=unauthenticated');
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    // Impedisce a chiunque di vedere pagine di altri ruoli
    const target = session.landingUrl || 'login.html';
    window.location.replace(`${target}?denied_from=${encodeURIComponent(window.location.pathname)}`);
    return null;
  }

  return session;
}

/**
 * Legge e inizializza i dati condivisi (Cantieri, Report Fotografici, Lamentele, Fatture)
 */
export function getSharedPlatformData() {
  try {
    const raw = localStorage.getItem(SHARED_DATA_KEY);
    if (!raw) {
      localStorage.setItem(SHARED_DATA_KEY, JSON.stringify(INITIAL_SHARED_DATA));
      return JSON.parse(JSON.stringify(INITIAL_SHARED_DATA));
    }
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(INITIAL_SHARED_DATA));
  }
}

/**
 * Salva i dati condivisi aggiornati
 */
export function saveSharedPlatformData(data) {
  try {
    localStorage.setItem(SHARED_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Errore salvataggio stato condiviso:', e);
  }
}

/**
 * Ripristina i dati demo allo stato iniziale
 */
export function resetSharedPlatformData() {
  localStorage.setItem(SHARED_DATA_KEY, JSON.stringify(INITIAL_SHARED_DATA));
  return JSON.parse(JSON.stringify(INITIAL_SHARED_DATA));
}

