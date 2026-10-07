-- ==============================================================================
-- FIRENZE PULIZIE - DATI DI INIZIALIZZAZIONE (SEED DATA)
-- Mappatura territoriale Firenze e provincia, categorie e servizi
-- ==============================================================================

-- 1. MACRO-CATEGORIE SERVIZI
INSERT INTO service_categories (id, code, title, subtitle, icon_name, display_order) VALUES
('cat-commercial', 'COMMERCIAL', 'Pulizie Commerciali & B2B', 'Negozi, uffici, aziende, palestre e studi professionali', 'building', 1),
('cat-condominium', 'CONDOMINIUM', 'Pulizie Condominiali', 'Scale, pianerottoli, vetrate, ascensori e spazi comuni', 'home-modern', 2),
('cat-private', 'PRIVATE', 'Pulizie Private & Abitazioni', 'Case, appartamenti e seconde case senza vincoli', 'sparkles', 3)
ON CONFLICT (code) DO NOTHING;

-- 2. SERVIZI SPECIFICI
INSERT INTO services (id, category_id, code, title, description, default_checklist) VALUES
-- Commerciale
('srv-com-office', 'cat-commercial', 'OFFICE_CLEANING', 'Pulizia Uffici & Studi Professionali', 'Igienizzazione postazioni, pavimenti, bagni, svuotamento cestini e sanificazione superfici.', '["Igienizzazione scrivanie e monitor", "Aspirazione e lavaggio pavimenti", "Sanificazione servizi igienici", "Svuotamento e differenziazione cestini", "Spolvero superfici e mensole"]'),
('srv-com-retail', 'cat-commercial', 'RETAIL_CLEANING', 'Pulizia Negozi & Spazi Commerciali', 'Pulizia vetrine, pavimento punto vendita, camerini e bancone cassa.', '["Pulizia vetrine e specchi", "Lavaggio pavimenti calpestio intenso", "Sanificazione bancone e cassa", "Igienizzazione camerini e maniglie"]'),
('srv-com-hospitality', 'cat-commercial', 'HOSPITALITY_CLEANING', 'B&B & Strutture Ricettive', 'Cambio biancheria, sanificazione camere, cucine e bagni tra un ospite e l’altro.', '["Rifacimento letti e cambio biancheria", "Sanificazione profonda bagno e doccia", "Pulizia piano cottura e stoviglie", "Areazione locali e profumazione"]'),

-- Condomini
('srv-cnd-stairs', 'cat-condominium', 'CONDO_STAIRS', 'Pulizia Scale & Pianerottoli', 'Spazzatura e lavaggio rampe scale, corrimano, pianerottoli e ingressi.', '["Spazzatura e lavaggio scale", "Igienizzazione corrimano e ringhiere", "Pulizia portone di ingresso e maniglie", "Pulizia zerbini e battiscopa"]'),
('srv-cnd-elevator', 'cat-condominium', 'CONDO_ELEVATOR', 'Igienizzazione Ascensori & Vetrate', 'Pulizia cabina ascensore, specchi, pulsantiere e vetri androne.', '["Pulizia specchi ascensore", "Sanificazione pulsantiere e maniglioni", "Lavaggio pavimento cabina", "Pulizia vetrate ingresso"]'),
('srv-cnd-garage', 'cat-condominium', 'CONDO_GARAGE', 'Aree Esterne, Cortili & Garage', 'Spazzatura corselli garage, rampe di accesso e raccolta foglie cortile.', '["Spazzatura corsello garage", "Pulizia griglie di scolo e rampe", "Spazzatura cortili e vialetti pedonali"]'),

-- Privati
('srv-prv-regular', 'cat-private', 'PRIVATE_REGULAR', 'Pulizia Ordinaria Abitazione', 'Mantenimento periodico: pavimenti, cucina, bagni e spolvero arredi.', '["Lavaggio pavimenti tutte le stanze", "Sanificazione completa bagni", "Pulizia piano cucina e lavello", "Spolvero mobili e battiscopa"]'),
('srv-prv-deep', 'cat-private', 'PRIVATE_DEEP', 'Pulizia Straordinaria / Fine Cantiere', 'Intervento intensivo post-ristrutturazione o pulizia profonda stagionale.', '["Rimozione residui cantiere e polvere fine", "Pulizia infissi, tapparelle e vetrate", "Sgrassatura approfondita cucina e forni", "Lavaggio e sanificazione profonda piastrelle"]'),
('srv-prv-windows', 'cat-private', 'PRIVATE_WINDOWS', 'Lavaggio Vetri & Infissi Casa', 'Pulizia specialistica di finestre, portefinestre e vetrate.', '["Lavaggio vetri interni ed esterni", "Pulizia binari e telai infissi", "Pulizia davanzali e tapparelle"]')
ON CONFLICT (code) DO NOTHING;

-- 3. MAPPATURA TERRITORIALE: FIRENZE (QUARTIERI) E COMUNI DELLA PROVINCIA
INSERT INTO geographic_areas (id, region, province, municipality, zone_name, zip_code, display_order) VALUES
-- FIRENZE COMUNE - QUARTIERI PRINCIPALI
('geo-fi-centro', 'Toscana', 'FI', 'Firenze', 'Centro Storico (Duomo, Santa Maria Novella, San Frediano, Santa Croce)', '50123', 1),
('geo-fi-campo-marte', 'Toscana', 'FI', 'Firenze', 'Campo di Marte (Stadio, Coverciano, Le Cure, San Salvi)', '50137', 2),
('geo-fi-rifredi', 'Toscana', 'FI', 'Firenze', 'Rifredi - Careggi (Ospedale, Statuto, Dalmazia, Poggetto)', '50134', 3),
('geo-fi-novoli', 'Toscana', 'FI', 'Firenze', 'Novoli - San Donato (Polo Universitario, Peretola, Brozzi, Quaracchi)', '50127', 4),
('geo-fi-isolotto', 'Toscana', 'FI', 'Firenze', 'Isolotto - Legnaia (Canova, Monticelli, Argingrosso)', '50142', 5),
('geo-fi-gavinana', 'Toscana', 'FI', 'Firenze', 'Gavinana - Galluzzo (Bandino, Sorgane, Bellosguardo, Arcetri)', '50125', 6),

-- COMUNI LIMITROFI DI FIRENZE (PRIMA FASCIA PROVINCIALE)
('geo-fi-scandicci', 'Toscana', 'FI', 'Scandicci', 'Scandicci Centro - Badia a Settimo - Casellina', '50018', 7),
('geo-fi-sesto', 'Toscana', 'FI', 'Sesto Fiorentino', 'Sesto Fiorentino Centro - Colonnata - Quinto', '50019', 8),
('geo-fi-campi', 'Toscana', 'FI', 'Campi Bisenzio', 'Campi Bisenzio Centro - San Donnino - Capalle', '50013', 9),
('geo-fi-bagno-ripoli', 'Toscana', 'FI', 'Bagno a Ripoli', 'Bagno a Ripoli - Grassina - Antella', '50012', 10),
('geo-fi-calenzano', 'Toscana', 'FI', 'Calenzano', 'Calenzano Centro - Settimello - Carraia', '50041', 11),
('geo-fi-fiesole', 'Toscana', 'FI', 'Fiesole', 'Fiesole Centro - Caldine - Compiobbi', '50014', 12),
('geo-fi-pontassieve', 'Toscana', 'FI', 'Pontassieve', 'Pontassieve Centro - Sieci', '50065', 13)
ON CONFLICT (municipality, zone_name, zip_code) DO NOTHING;

-- 4. UTENTE AMMINISTRATORE DI DEFAULT
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, status) VALUES
('usr-admin-initial', 'admin@firenzepulizie.it', 'admin123_temp_hash', 'SUPER_ADMIN', 'Amministratore', 'Centrale', '+39 055 000000', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;
