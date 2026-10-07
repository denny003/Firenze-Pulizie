# GUIDA OPERATIVA — FIRENZE PULIZIE

Progetto completamente autonomo e isolato all'interno della cartella:
`c:\Users\Lenovo\Documents\antigravity\FIRENZE_PULIZIE\`

---

## 🔒 1. Isolamento Totale da ORDERSENDER

Per evitare qualsiasi contaminazione con il progetto precedente (ORDERSENDER):
1. **Cartella dedicata:** Tutti i file del nuovo progetto risiedono esclusivamente in `FIRENZE_PULIZIE/`.
2. **Esclusione Git automatica:** È stato inserito `FIRENZE_PULIZIE/` nel `.gitignore` della radice di ORDERSENDER, così nessun commit o modifica su ORDERSENDER toccherà o includerà i file di Firenze Pulizie.
3. **Spazio di lavoro indipendente:** Puoi aprire direttamente la cartella `c:\Users\Lenovo\Documents\antigravity\FIRENZE_PULIZIE\` in una nuova finestra del tuo editor di codice (VS Code / Antigravity).

---

## 📦 2. Mappa dei File Pronti

```
FIRENZE_PULIZIE/
│
├── site/                               # Piattaforma Web (Frontend reattivo & mobile-first)
│   ├── index.html                      # Homepage con 3 canali, mappa territoriale e adesione rete
│   ├── pulizie-commerciali.html        # Landing page Uffici, B2B, Negozi, Strutture ricettive
│   ├── pulizie-condomini.html          # Landing page Condomini e Amministratori di condominio
│   ├── pulizie-private.html            # Landing page Abitazioni private e ville
│   ├── richiedi-preventivo.html        # Wizard guidato con selezione zona e calcolo preventivo
│   ├── partner.html                    # Pagina iscrizione e accreditamento imprese di pulizia
│   ├── login.html                      # Accesso unificato: Amministrazione, Imprese, Squadre
│   ├── privacy.html                    # Informativa privacy e conformità GDPR
│   ├── css/
│   │   ├── tokens.css                  # Palette colori (Navy, Sky Blue, Cyan, Emerald), font, ombre
│   │   ├── base.css                    # Griglia responsive, pulsanti, form e reset
│   │   └── public.css                  # Stili per header, hero, card settori e footer
│   └── js/
│       ├── app-config.js               # Anagrafica zone di Firenze e categorie servizi
│       └── public-lead.js              # Gestione interattiva modulo preventivo e API dispatch
│
├── database/                           # Modello dati relazionale (3NF)
│   ├── schema.sql                      # Schema DDL (Aziende, Squadre, Utenti, Lead, Cantieri, Foto)
│   └── seed-firenze.sql                # Dati iniziali quartieri di Firenze, CAP e servizi
│
├── netlify/
│   └── functions/
│       └── api.mjs                     # Serverless API REST: Lead, Candidature, Geo, Login
│
├── netlify.toml                        # Configurazione Netlify, rewrite /api/* e security headers
├── package.json                        # Definizione progetto ES Modules
├── .gitignore                          # Esclusione node_modules e file locali
└── README.md                           # Documentazione tecnica generale
```

---

## 🌐 3. Creazione del Nuovo Repository GitHub

Per pubblicare il progetto su un repository GitHub separato (ad esempio `denny003/FIRENZE_PULIZIE`):

1. Vai su GitHub e crea un nuovo repository vuoto:
   * **Repository name:** `FIRENZE_PULIZIE`
   * Lascia il repository senza file README/License iniziali.

2. Dal terminale posizionato all'interno di `FIRENZE_PULIZIE`:
   ```powershell
   cd c:\Users\Lenovo\Documents\antigravity\FIRENZE_PULIZIE
   git init
   git add .
   git commit -m "feat: Inizializzazione piattaforma FIRENZE PULIZIE"
   git branch -M main
   git remote add origin https://github.com/denny003/FIRENZE_PULIZIE.git
   git push -u origin main
   ```

---

## ⚡ 4. Collegamento su Netlify (Nuovo Sito Separato)

1. Accedi alla dashboard di Netlify (`app.netlify.com`).
2. Clicca su **"Add new site"** → **"Import an existing project"**.
3. Seleziona **GitHub** e scegli il nuovo repository `FIRENZE_PULIZIE`.
4. Parametri di configurazione (rilevati in automatico dal `netlify.toml` già presente):
   * **Base directory:** *(lasciare vuoto o `.`)*
   * **Publish directory:** `site`
   * **Functions directory:** `netlify/functions`
5. Clicca su **"Deploy FIRENZE PULIZIE"**.

In pochi secondi avrai un nuovo URL autonomo (ad esempio `firenze-pulizie.netlify.app`), separato al 100% da `ordersender`.

---

## 💻 5. Come Testare Subito in Locale

Puoi visualizzare immediatamente il sito aprendo direttamente il file `site/index.html` con il browser oppure tramite un semplice server HTTP locale:

```powershell
cd c:\Users\Lenovo\Documents\antigravity\FIRENZE_PULIZIE
npx serve site
```
oppure con Live Server di VS Code.
