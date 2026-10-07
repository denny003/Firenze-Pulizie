# FIRENZE PULIZIE — Piattaforma Digitale per Rete Coordinata di Imprese di Pulizia

Piattaforma web moderna, reattiva e scalabile per la gestione, l'acquisizione clienti e il coordinamento operativo di una rete di imprese di pulizia e squadre sul territorio di **Firenze e provincia**.

---

## 🏛️ Concetto e Valore della Rete
Non un semplice "sito di preventivi", ma un'**infrastruttura operativa territoriale**:
* **Prossimità geografica:** assegnazione per zone e quartieri (Centro, Novoli, Rifredi, Campo di Marte, Gavinana, Isolotto, ecc.) per azzerare gli spostamenti e massimizzare la resa delle squadre.
* **3 Macro-Settori Separati:**
  1. **Commerciale & B2B:** Uffici, aziende, negozi, palestre, strutture ricettive.
  2. **Condomini:** Servizio dedicato agli amministratori di condominio con checklist e trasparenza.
  3. **Privati & Residenziale:** Richiesta immediata senza registrazione obbligatoria.
* **Mobile-First per le Squadre:** Interfaccia leggera da smartphone per check-in cantiere, spunta checklist e segnalazione problemi anche in assenza temporanea di rete (PWA offline-ready).
* **Onboarding Qualificato:** Le nuove imprese partner si candidano e vengono abilitate solo previa verifica documentale dell'amministrazione.

---

## 📁 Struttura del Progetto

```
FIRENZE_PULIZIE/
├── site/                         # Frontend pubblico e portale web
│   ├── index.html                # Homepage Rete Pulizie
│   ├── pulizie-commerciali.html  # Sezione B2B / Uffici e Negozi
│   ├── pulizie-condomini.html    # Sezione Condomini / Amministratori
│   ├── pulizie-private.html      # Sezione Privati / Abitazioni
│   ├── richiedi-preventivo.html  # Modulo richiesta lead unificato
│   ├── partner.html              # Candidatura imprese partner
│   ├── login.html                # Portale unico di accesso sicuro
│   ├── css/                      # Design system (tokens, base, public)
│   └── js/                       # Logica client e moduli interattivi
├── netlify/
│   └── functions/
│       └── api.mjs               # API Serverless RESTful (Lead, Partner, Geo, Auth)
├── database/
│   ├── schema.sql                # DDL SQL completo e normalizzato (PostgreSQL / SQLite)
│   └── seed-firenze.sql          # Dati iniziali: Zone e CAP di Firenze e Comuni limitrofi
├── netlify.toml                  # Configurazione deploy e routing Netlify
├── package.json                  # Configurazione dipendenze e script
└── ISTRUZIONI_AVVIO_PROGETTO.md  # Guida passo-passo per GitHub e Netlify
```

---

## 🚀 Avvio Rapido Locale
1. Apri la cartella `FIRENZE_PULIZIE` con il tuo editor o server web locale (es. Live Server o `npx serve site`).
2. Per testare le funzioni serverless su Netlify:
   ```bash
   npx netlify dev
   ```
