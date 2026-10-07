-- ==============================================================================
-- FIRENZE PULIZIE - SCHEMA DEL DATABASE (PostgreSQL / SQL Standard)
-- Piattaforma per Rete Coordinata di Imprese di Pulizia
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);

-- RELAZIONE IMPRESA - UTENTE
CREATE TABLE IF NOT EXISTS company_users (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_role VARCHAR(30) DEFAULT 'COMPANY_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);

-- 3. ORGANIZZAZIONE GEOGRAFICA (REGIONE -> PROVINCIA -> COMUNE -> ZONA -> CAP)
CREATE TABLE IF NOT EXISTS geographic_areas (
    id VARCHAR(36) PRIMARY KEY,
    region VARCHAR(50) DEFAULT 'Toscana',
    province VARCHAR(10) DEFAULT 'FI',
    municipality VARCHAR(100) NOT NULL,     -- es. Firenze, Scandicci, Sesto Fiorentino
    zone_name VARCHAR(100) NOT NULL,        -- es. Centro Storico, Novoli, Rifredi, Campo di Marte
    zip_code VARCHAR(10) NOT NULL,          -- es. 50123, 50127
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(municipality, zone_name, zip_code)
);

-- ZONE SERVITE DA CIASCUNA IMPRESA
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
    code VARCHAR(50) NOT NULL UNIQUE,       -- COMMERCIAL, CONDOMINIUM, PRIVATE
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
    default_checklist JSON,                 -- template checklist base per l'intervento
    is_active BOOLEAN DEFAULT TRUE
);

-- SERVIZI ABILITATI PER IMPRESA
CREATE TABLE IF NOT EXISTS company_services (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    service_id VARCHAR(36) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE(company_id, service_id)
);

-- 5. RICHIESTE (LEADS) PUBBLICHE
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY,
    lead_number VARCHAR(50) NOT NULL UNIQUE, -- es. LEAD-2026-0001
    category_id VARCHAR(36) REFERENCES service_categories(id),
    service_id VARCHAR(36) REFERENCES services(id),
    customer_type VARCHAR(30) NOT NULL,     -- PRIVATO | AZIENDA | CONDOMINIO
    contact_name VARCHAR(100) NOT NULL,
    contact_surname VARCHAR(100) NOT NULL,
    company_or_condo_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    municipality VARCHAR(100) DEFAULT 'Firenze',
    area_id VARCHAR(36) REFERENCES geographic_areas(id),
    address VARCHAR(255),
    property_size_sqm INT,
    frequency VARCHAR(50),                  -- UNA_TANTUM, SETTIMANALE, BISETTIMANALE, MENSILE
    preferred_timing VARCHAR(100),
    notes TEXT,
    priority VARCHAR(20) DEFAULT 'NORMALE' CHECK (priority IN ('NORMALE', 'ALTA', 'URGENTE')),
    status VARCHAR(30) DEFAULT 'NUOVA' CHECK (status IN (
        'NUOVA', 'PRESA_IN_CARICO', 'CONTATTATO', 'SOPRALLUOGO', 
        'PREVENTIVO', 'IN_ATTESA', 'ACCETTATA', 'RIFIUTATA', 'CONCLUSA'
    )),
    assigned_company_id VARCHAR(36) REFERENCES companies(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CLIENTI ANAGRAFICA (CONVERSIONE DA LEAD O DIRETTI)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    customer_number VARCHAR(50) NOT NULL UNIQUE,
    customer_type VARCHAR(30) NOT NULL,     -- PRIVATO, AZIENDA, CONDOMINIO
    name_or_business VARCHAR(255) NOT NULL,
    vat_number VARCHAR(30),
    tax_code VARCHAR(30),
    sdi_code VARCHAR(10),
    pec VARCHAR(255),
    billing_address VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    origin_lead_id VARCHAR(36) REFERENCES leads(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDIRIZZI OPERATIVI / IMMOBILI / CONDOMINI DEL CLIENTE
CREATE TABLE IF NOT EXISTS customer_locations (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label VARCHAR(150) NOT NULL,            -- es. "Condominio Belfiore", "Ufficio Piano 2"
    address VARCHAR(255) NOT NULL,
    municipality VARCHAR(100) DEFAULT 'Firenze',
    area_id VARCHAR(36) REFERENCES geographic_areas(id),
    zip_code VARCHAR(10),
    access_instructions TEXT,               -- es. Citofono 14, chiavi dal custode
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. SQUADRE OPERATIVE DELLE IMPRESE
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    team_code VARCHAR(50) NOT NULL,         -- es. SQ-01
    name VARCHAR(150) NOT NULL,             -- es. Squadra Novoli & Rifredi
    primary_area_id VARCHAR(36) REFERENCES geographic_areas(id),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BUSY', 'INACTIVE')),
    color_tag VARCHAR(20) DEFAULT '#0284c7',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_leader BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- 8. SCHEDA INTERVENTO (CALENDARIO & CANTIERE MOBILE)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    job_number VARCHAR(50) NOT NULL UNIQUE, -- es. INT-2026-00123
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id),
    location_id VARCHAR(36) REFERENCES customer_locations(id),
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id),
    team_id VARCHAR(36) REFERENCES teams(id),
    service_id VARCHAR(36) REFERENCES services(id),
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIME,
    scheduled_end_time TIME,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    status VARCHAR(30) DEFAULT 'PROGRAMMATO' CHECK (status IN (
        'PROGRAMMATO', 'IN_CORSO', 'COMPLETATO', 'ANOMALIA', 'ANNULLATO'
    )),
    notes TEXT,
    customer_signature_name VARCHAR(150),
    customer_signature_image TEXT,          -- Base64 SVG o URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHECKLIST PER INTERVENTO
CREATE TABLE IF NOT EXISTS job_checklists (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    completed_by_user_id VARCHAR(36) REFERENCES users(id)
);

-- FOTO INTERVENTO (PRIMA, DOPO, ANOMALIA)
CREATE TABLE IF NOT EXISTS job_photos (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('BEFORE', 'AFTER', 'ISSUE')),
    photo_url TEXT NOT NULL,
    caption VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. CRONOLOGIA STATI E AUDIT LOGS
CREATE TABLE IF NOT EXISTS status_history (
    id VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,       -- LEAD, JOB, COMPANY
    entity_id VARCHAR(36) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by_user_id VARCHAR(36) REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDICI STRATEGICI PER PERFORMANCE E PROSSIMITÀ TERRITORIALE
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_area ON leads(area_id);
CREATE INDEX IF NOT EXISTS idx_jobs_date ON jobs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_team ON jobs(team_id);
CREATE INDEX IF NOT EXISTS idx_geo_municipality ON geographic_areas(municipality);
CREATE INDEX IF NOT EXISTS idx_geo_zone ON geographic_areas(zone_name);
