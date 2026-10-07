-- ==============================================================================
-- FIRENZE PULIZIE - SUPABASE INITIAL SETUP SCRIPT
-- Esegui questo script in Supabase: Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. UTENTI E AUTENTICAZIONE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN (
        'SUPER_ADMIN', 'PLATFORM_ADMIN', 'COMPANY_ADMIN', 
        'COMPANY_MANAGER', 'TEAM_LEADER', 'TEAM_MEMBER', 
        'CUSTOMER', 'CONDOMINIUM_ADMIN'
    )),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'INVITED', 'DEACTIVATED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. IMPRESE DI PULIZIA PARTNER
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    commercial_name VARCHAR(255),
    vat_number VARCHAR(30) NOT NULL UNIQUE,
    tax_code VARCHAR(30),
    legal_address VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Firenze',
    province VARCHAR(10) DEFAULT 'FI',
    zip_code VARCHAR(10),
    contact_person VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pec VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    operator_count INT DEFAULT 1,
    team_count INT DEFAULT 1,
    insurance_policy_number VARCHAR(100),
    insurance_expiry DATE,
    durc_expiry DATE,
    status VARCHAR(30) DEFAULT 'IN_ATTESA' CHECK (status IN (
        'IN_ATTESA', 'IN_VERIFICA', 'APPROVATA', 'ATTIVA', 'SOSPESA', 'DISATTIVATA'
    )),
    rating_avg DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS company_users (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_role VARCHAR(30) DEFAULT 'COMPANY_ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);

-- 3. ORGANIZZAZIONE GEOGRAFICA (FIRENZE & CINTURA METROPOLITANA)
CREATE TABLE IF NOT EXISTS geographic_areas (
    id VARCHAR(36) PRIMARY KEY,
    region VARCHAR(50) DEFAULT 'Toscana',
    province VARCHAR(10) DEFAULT 'FI',
    municipality VARCHAR(100) NOT NULL,
    zone_name VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(municipality, zone_name, zip_code)
);

CREATE TABLE IF NOT EXISTS company_service_areas (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    area_id VARCHAR(36) NOT NULL REFERENCES geographic_areas(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    UNIQUE(company_id, area_id)
);

-- 4. CATEGORIE E SERVIZI OFFERTI
CREATE TABLE IF NOT EXISTS service_categories (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    icon_name VARCHAR(50),
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(36) PRIMARY KEY,
    category_id VARCHAR(36) NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    default_checklist JSONB,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS company_services (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    service_id VARCHAR(36) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE(company_id, service_id)
);

-- 5. RICHIESTE PREVENTIVO (LEADS)
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY,
    lead_code VARCHAR(30) NOT NULL UNIQUE,
    sector VARCHAR(30) NOT NULL CHECK (sector IN ('COMMERCIALE', 'CONDOMINIO', 'PRIVATO')),
    customer_type VARCHAR(30) NOT NULL CHECK (customer_type IN ('PRIVATO', 'AZIENDA', 'AMMINISTRATORE_CONDOMINIO')),
    full_name VARCHAR(150) NOT NULL,
    company_name VARCHAR(150),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    geographic_area_id VARCHAR(36) REFERENCES geographic_areas(id) ON DELETE SET NULL,
    address VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Firenze',
    zip_code VARCHAR(10),
    square_meters INT,
    frequency VARCHAR(30) DEFAULT 'UNA_TANTUM',
    preferred_time_slot VARCHAR(50),
    notes TEXT,
    status VARCHAR(30) DEFAULT 'NUOVA' CHECK (status IN (
        'NUOVA', 'IN_VALUTAZIONE', 'ASSEGNATA', 'CONTATTATO', 
        'SOPRALLUOGO_FISSATO', 'PREVENTIVO_INVIATO', 'CONVERTITA', 
        'ANNULLATA', 'RIFIUTATA'
    )),
    assigned_company_id VARCHAR(36) REFERENCES companies(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CLIENTI E LOCATION CONTRATTUALI
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    customer_type VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    business_name VARCHAR(255),
    vat_number VARCHAR(30),
    tax_code VARCHAR(30),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    lead_id VARCHAR(36) REFERENCES leads(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_locations (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    geographic_area_id VARCHAR(36) REFERENCES geographic_areas(id),
    address VARCHAR(255) NOT NULL,
    floor_info VARCHAR(50),
    has_elevator BOOLEAN DEFAULT FALSE,
    access_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SQUADRE OPERATIVE DELLE IMPRESE
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    vehicle_plate VARCHAR(20),
    leader_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    team_pin VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_team VARCHAR(30) DEFAULT 'OPERATORE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- 8. CANTIERI E INTERVENTI OPERATIVI (JOBS)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    job_code VARCHAR(30) NOT NULL UNIQUE,
    lead_id VARCHAR(36) REFERENCES leads(id) ON DELETE SET NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    customer_id VARCHAR(36) REFERENCES customers(id) ON DELETE SET NULL,
    location_id VARCHAR(36) REFERENCES customer_locations(id) ON DELETE SET NULL,
    assigned_team_id VARCHAR(36) REFERENCES teams(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIME,
    scheduled_end_time TIME,
    actual_checkin TIMESTAMP WITH TIME ZONE,
    actual_checkout TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) DEFAULT 'PIANIFICATO' CHECK (status IN (
        'PIANIFICATO', 'IN_CORSO', 'COMPLETATO', 'SOSPESO', 'ANNULLATO'
    )),
    price_total DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_checklists (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    item_title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS job_photos (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('PRIMA', 'DOPO', 'PROBLEMA')),
    photo_url TEXT NOT NULL,
    notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DATI INIZIALI (SEED DATA)
-- ==============================================================================

-- 1. MACRO-CATEGORIE
INSERT INTO service_categories (id, code, title, subtitle, icon_name, display_order) VALUES
('cat-commercial', 'COMMERCIAL', 'Pulizie Commerciali & B2B', 'Negozi, uffici, aziende, palestre e studi professionali', 'building', 1),
('cat-condominium', 'CONDOMINIUM', 'Pulizie Condominiali', 'Scale, pianerottoli, vetrate, ascensori e spazi comuni', 'home-modern', 2),
('cat-private', 'PRIVATE', 'Pulizie Private & Abitazioni', 'Case, appartamenti e seconde case senza vincoli', 'sparkles', 3)
ON CONFLICT (code) DO NOTHING;

-- 2. SERVIZI SPECIFICI
INSERT INTO services (id, category_id, code, title, description, default_checklist) VALUES
('srv-com-office', 'cat-commercial', 'OFFICE_CLEANING', 'Pulizia Uffici & Studi Professionali', 'Igienizzazione postazioni, pavimenti, bagni, svuotamento cestini e sanificazione superfici.', '["Igienizzazione scrivanie e monitor", "Aspirazione e lavaggio pavimenti", "Sanificazione servizi igienici", "Svuotamento cestini", "Spolvero superfici"]')
ON CONFLICT (code) DO NOTHING;

-- 3. ZONE DI FIRENZE E PROVINCIA
INSERT INTO geographic_areas (id, region, province, municipality, zone_name, zip_code, display_order) VALUES
('geo-fi-centro', 'Toscana', 'FI', 'Firenze', 'Centro Storico (Duomo, Santa Maria Novella, Tornabuoni, Santa Croce)', '50123', 1),
('geo-fi-campo-marte', 'Toscana', 'FI', 'Firenze', 'Campo di Marte (Stadio, Coverciano, Le Cure)', '50137', 2),
('geo-fi-rifredi', 'Toscana', 'FI', 'Firenze', 'Rifredi - Careggi (Ospedale, Statuto, Dalmazia)', '50134', 3),
('geo-fi-novoli', 'Toscana', 'FI', 'Firenze', 'Novoli - San Donato (Polo Universitario, Peretola)', '50127', 4),
('geo-fi-isolotto', 'Toscana', 'FI', 'Firenze', 'Isolotto - Legnaia (Canova, Monticelli)', '50142', 5),
('geo-fi-gavinana', 'Toscana', 'FI', 'Firenze', 'Gavinana - Galluzzo (Bandino, Firenze Sud)', '50125', 6),
('geo-fi-scandicci', 'Toscana', 'FI', 'Scandicci', 'Scandicci Centro - Badia a Settimo - Casellina', '50018', 7),
('geo-fi-sesto', 'Toscana', 'FI', 'Sesto Fiorentino', 'Sesto Fiorentino Centro - Polo Scientifico', '50019', 8),
('geo-fi-campi', 'Toscana', 'FI', 'Campi Bisenzio', 'Campi Bisenzio Centro - San Donnino', '50013', 9),
('geo-fi-bagno-ripoli', 'Toscana', 'FI', 'Bagno a Ripoli', 'Bagno a Ripoli - Grassina - Antella', '50012', 10),
('geo-fi-calenzano', 'Toscana', 'FI', 'Calenzano', 'Calenzano Centro - Settimello', '50041', 11),
('geo-fi-fiesole', 'Toscana', 'FI', 'Fiesole', 'Fiesole Centro - Caldine', '50014', 12),
('geo-fi-pontassieve', 'Toscana', 'FI', 'Pontassieve', 'Pontassieve Centro - Sieci', '50065', 13)
ON CONFLICT (municipality, zone_name, zip_code) DO NOTHING;

-- 4. IMPRESA PARTNER PILOTA (CLEAN SERVICE FIRENZE)
INSERT INTO companies (id, business_name, commercial_name, vat_number, contact_person, phone, email, status, rating_avg) VALUES
('comp-01', 'Clean Service Firenze Srl', 'Clean Service Firenze', 'IT06548920481', 'Marco Taddei', '055 412345', 'partner@cleanservice.it', 'ATTIVA', 4.90)
ON CONFLICT (vat_number) DO NOTHING;

-- ABILITA PERMESSI PUBBLICI PER I FORM (RLS BYPASS PER API REST / ANON)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographic_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Zones" ON geographic_areas FOR SELECT USING (true);
CREATE POLICY "Public Insert Leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Public Read Companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Public Insert Companies" ON companies FOR INSERT WITH CHECK (true);
