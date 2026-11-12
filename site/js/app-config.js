// ==============================================================================
// FIRENZE PULIZIE - CONFIGURAZIONE TERRITORIALE E CATALOGO SERVIZI
// ==============================================================================

export const FIRENZE_ZONES = [
  { id: 'geo-fi-centro', code: 'FI-CENTRO', name: 'Centro Storico (Duomo, SMN, San Frediano, Santa Croce)', cap: '50123' },
  { id: 'geo-fi-campo-marte', code: 'FI-CAMPO-MARTE', name: 'Campo di Marte (Stadio, Coverciano, Cure, San Salvi)', cap: '50137' },
  { id: 'geo-fi-rifredi', code: 'FI-RIFREDI', name: 'Rifredi - Careggi (Statuto, Dalmazia, Poggetto)', cap: '50134' },
  { id: 'geo-fi-novoli', code: 'FI-NOVOLI', name: 'Novoli - San Donato (Polo Univ., Peretola, Brozzi)', cap: '50127' },
  { id: 'geo-fi-isolotto', code: 'FI-ISOLOTTO', name: 'Isolotto - Legnaia (Canova, Monticelli, Argingrosso)', cap: '50142' },
  { id: 'geo-fi-gavinana', code: 'FI-GAVINANA', name: 'Gavinana - Galluzzo (Bandino, Sorgane, Arcetri)', cap: '50125' },
  { id: 'geo-fi-scandicci', code: 'COM-SCANDICCI', name: 'Scandicci Centro - Badia - Casellina', cap: '50018' },
  { id: 'geo-fi-sesto', code: 'COM-SESTO', name: 'Sesto Fiorentino - Colonnata - Quinto', cap: '50019' },
  { id: 'geo-fi-campi', code: 'COM-CAMPI', name: 'Campi Bisenzio - San Donnino - Capalle', cap: '50013' },
  { id: 'geo-fi-bagno-ripoli', code: 'FI-GAVINANA', name: 'Bagno a Ripoli - Grassina - Antella', cap: '50012' },
  { id: 'geo-fi-calenzano', code: 'COM-SESTO', name: 'Calenzano - Settimello', cap: '50041' },
  { id: 'geo-fi-fiesole', code: 'FI-CAMPO-MARTE', name: 'Fiesole - Caldine - Compiobbi', cap: '50014' },
  { id: 'geo-fi-pontassieve', code: 'FI-CAMPO-MARTE', name: 'Pontassieve - Sieci', cap: '50065' }
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
