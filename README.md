# FIRENZE PULIZIE â€” Piattaforma Digitale per Rete Coordinata di Imprese di Pulizia

Piattaforma web moderna, reattiva e scalabile per la gestione, l'acquisizione clienti e il coordinamento operativo di una rete di imprese di pulizia e squadre sul territorio di **Firenze e provincia**.

---

## ðŸ›ï¸ Concetto e Valore della Rete
Non un semplice "sito di preventivi", ma un'**infrastruttura operativa territoriale**:
* **ProssimitÃ  geografica:** assegnazione per zone e quartieri (Centro, Novoli, Rifredi, Campo di Marte, Gavinana, Isolotto, ecc.) per azzerare gli spostamenti e massimizzare la resa delle squadre.
* **3 Macro-Settori Separati:**
  1. **Commerciale & B2B:** Uffici, aziende, negozi, palestre, strutture ricettive.
  2. **Condomini:** Servizio dedicato agli amministratori di condominio con checklist e trasparenza.
  3. **Privati & Residenziale:** Richiesta immediata senza registrazione obbligatoria.
* **Mobile-First per le Squadre:** Interfaccia leggera da smartphone per check-in cantiere, spunta checklist e segnalazione problemi anche in assenza temporanea di rete (PWA offline-ready).
* **Onboarding Qualificato:** Le nuove imprese partner si candidano e vengono abilitate solo previa verifica documentale dell'amministrazione.

---

## ðŸ“ Struttura del Progetto

```
FIRENZE_PULIZIE/
â”œâ”€â”€ site/                         # Frontend pubblico e portale web
â”‚   â”œâ”€â”€ index.html                # Homepage Rete Pulizie
â”‚   â”œâ”€â”€ pulizie-commerciali.html  # Sezione B2B / Uffici e Negozi
â”‚   â”œâ”€â”€ pulizie-condomini.html    # Sezione Condomini / Amministratori
â”‚   â”œâ”€â”€ pulizie-private.html      # Sezione Privati / Abitazioni
â”‚   â”œâ”€â”€ richiedi-preventivo.html  # Modulo richiesta lead unificato
â”‚   â”œâ”€â”€ partner.html              # Candidatura imprese partner
â”‚   â”œâ”€â”€ login.html                # Portale unico di accesso sicuro
â”‚   â”œâ”€â”€ css/                      # Design system (tokens, base, public)
â”‚   â””â”€â”€ js/                       # Logica client e moduli interattivi
â”œâ”€â”€ netlify/
â”‚   â””â”€â”€ functions/
â”‚       â””â”€â”€ api.mjs               # API Serverless RESTful (Lead, Partner, Geo, Auth)
â”œâ”€â”€ database/
â”‚   â”œâ”€â”€ schema.sql                # DDL SQL completo e normalizzato (Relazionale)
â”‚   â””â”€â”€ seed-firenze.sql          # Dati iniziali: Zone e CAP di Firenze e Comuni limitrofi
â”œâ”€â”€ netlify.toml                  # Configurazione deploy e routing Netlify
â”œâ”€â”€ package.json                  # Configurazione dipendenze e script
â””â”€â”€ ISTRUZIONI_AVVIO_PROGETTO.md  # Guida passo-passo per GitHub e Netlify
```

---

## ðŸš€ Avvio Rapido Locale
1. Apri la cartella `FIRENZE_PULIZIE` con il tuo editor o server web locale (es. Live Server o `npx serve site`).
2. Per testare le funzioni serverless su Netlify:
   ```bash
   npx netlify dev
   ```

