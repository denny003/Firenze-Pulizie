// ==============================================================================
// FIRENZE PULIZIE - CONFIGURAZIONE APPLICATIVA CLIENT & SUPABASE LIVE
// ==============================================================================

export const SUPABASE_CONFIG = {
  url: 'https://tvgvcphkqdhtjwfjysyv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Z3ZjcGhrcWRodGp3Zmp5c3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MDY2MDksImV4cCI6MjEwNjk4MjYwOX0.7yhLjkaV3XKcRsZquABvhSY9TEgp3IbC5vHYBBXJUb0'
};

export const FIRENZE_ZONES = [
  { id: 'geo-fi-centro', name: 'Centro Storico (Duomo, SMN, San Frediano, Santa Croce)', cap: '50123' },
  { id: 'geo-fi-campo-marte', name: 'Campo di Marte (Stadio, Coverciano, Cure, San Salvi)', cap: '50137' },
  { id: 'geo-fi-rifredi', name: 'Rifredi - Careggi (Statuto, Dalmazia, Poggetto)', cap: '50134' },
  { id: 'geo-fi-novoli', name: 'Novoli - San Donato (Polo Univ., Peretola, Brozzi)', cap: '50127' },
  { id: 'geo-fi-isolotto', name: 'Isolotto - Legnaia (Canova, Monticelli, Argingrosso)', cap: '50142' },
  { id: 'geo-fi-gavinana', name: 'Gavinana - Galluzzo (Bandino, Sorgane, Arcetri)', cap: '50125' },
  { id: 'geo-fi-scandicci', name: 'Scandicci Centro - Badia - Casellina', cap: '50018' },
  { id: 'geo-fi-sesto', name: 'Sesto Fiorentino - Colonnata - Quinto', cap: '50019' },
  { id: 'geo-fi-campi', name: 'Campi Bisenzio - San Donnino - Capalle', cap: '50013' },
  { id: 'geo-fi-bagno-ripoli', name: 'Bagno a Ripoli - Grassina - Antella', cap: '50012' },
  { id: 'geo-fi-calenzano', name: 'Calenzano - Settimello', cap: '50041' },
  { id: 'geo-fi-fiesole', name: 'Fiesole - Caldine - Compiobbi', cap: '50014' },
  { id: 'geo-fi-pontassieve', name: 'Pontassieve - Sieci', cap: '50065' }
];

export const SERVICE_CATEGORIES = [
  {
    code: 'COMMERCIAL',
    title: 'Pulizie Commerciali & B2B',
    desc: 'Uffici, aziende, negozi, palestre e studi professionali',
    badge: '🏢 B2B & Negozi',
    services: [
      'Pulizia Uffici & Coworking',
      'Negozi & Punti Vendita',
      'B&B & Strutture Ricettive',
      'Studi Medici & Professionali',
      'Pulizie Straordinarie & Vetrine'
    ]
  },
  {
    code: 'CONDOMINIUM',
    title: 'Pulizie Condominiali',
    desc: 'Servizio continuativo dedicato ad Amministratori di Condominio',
    badge: '🏠 Condomini',
    services: [
      'Scale, Pianerottoli & Ingressi',
      'Igienizzazione Cabina Ascensori',
      'Lavaggio Vetrate & Portoni',
      'Corselli Garage & Cortili Esterni',
      'Gestione Bidoni & Raccolta Rifiuti'
    ]
  },
  {
    code: 'PRIVATE',
    title: 'Pulizie Private & Abitazioni',
    desc: 'Case, appartamenti e seconde case senza registrazione preliminare',
    badge: '🏡 Privati',
    services: [
      'Pulizia Ordinaria Periodica',
      'Pulizia Profonda / Post Ristrutturazione',
      'Lavaggio Vetri & Infissi',
      'Igienizzazione Cucine & Bagni',
      'Preparazione Casa per Cambio Inquilino'
    ]
  }
];

export function formatEuro(amount) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount || 0);
}
