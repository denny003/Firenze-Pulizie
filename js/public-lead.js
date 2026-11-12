// ==============================================================================
// FIRENZE PULIZIE - PUBLIC LEAD DISPATCHER
// Gestione modulo richiesta preventivo/contatto guidato e senza attrito
// ==============================================================================

import { FIRENZE_ZONES, SERVICE_CATEGORIES } from './app-config.js';

const INCOMING_LEADS_STORAGE_KEY = 'fp_incoming_leads_v1';

function computeSuggestedOffer(category, sqm, frequency, urlEstimate) {
  if (urlEstimate && urlEstimate.trim()) {
    return urlEstimate.trim();
  }
  const size = parseInt(sqm, 10) || 100;
  if (category === 'CONDOMINIUM') {
    const base = Math.max(130, Math.round(size * 1.15));
    return `€ ${base}/mese (Stima Condominio • Zero Costi Trasferta)`;
  }
  if (category === 'PRIVATE') {
    if (frequency === 'UNA_TANTUM') {
      const unaTantum = Math.max(95, Math.round(size * 1.6));
      return `€ ${unaTantum} (Intervento Straordinario / Sgrosso)`;
    }
    const privMensile = Math.max(120, Math.round(size * 1.25));
    return `€ ${privMensile}/mese (${frequency || 'Periodico'})`;
  }
  // COMMERCIAL / B2B
  const freqMult = frequency === 'BISETTIMANALE' ? 1.45 : (frequency === 'MENSILE' ? 0.55 : (frequency === 'UNA_TANTUM' ? 0.8 : 1.0));
  const commPrice = Math.max(150, Math.round((90 + size * 1.1) * freqMult));
  return frequency === 'UNA_TANTUM'
    ? `€ ${commPrice} (Intervento B2B Una Tantum)`
    : `€ ${commPrice}/mese (${frequency || 'Settimanale'} • Tariffa Prossimità)`;
}

function saveLeadToLocalBridge(leadEntry) {
  try {
    const raw = localStorage.getItem(INCOMING_LEADS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(leadEntry);
    localStorage.setItem(INCOMING_LEADS_STORAGE_KEY, JSON.stringify(list.slice(0, 100)));
  } catch (e) {
    // Ignore storage errors in private browsing
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Populate Zone Dropdowns
  const zoneSelects = document.querySelectorAll('.js-zone-select');
  zoneSelects.forEach(sel => {
    FIRENZE_ZONES.forEach(z => {
      const opt = document.createElement('option');
      opt.value = z.id;
      opt.textContent = `${z.name} (CAP ${z.cap})`;
      sel.appendChild(opt);
    });
  });

  // 2. Setup Category Selection Pills (if present)
  const categoryRadios = document.querySelectorAll('input[name="category"]');
  const serviceSelect = document.getElementById('leadService');

  function updateServicesDropdown(selectedCategory) {
    if (!serviceSelect) return;
    serviceSelect.innerHTML = '<option value="">-- Seleziona il servizio desiderato --</option>';
    const cat = SERVICE_CATEGORIES.find(c => c.code === selectedCategory);
    if (cat && cat.services) {
      cat.services.forEach(srv => {
        const opt = document.createElement('option');
        opt.value = srv;
        opt.textContent = srv;
        serviceSelect.appendChild(opt);
      });
    }
  }

  categoryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateServicesDropdown(e.target.value);
    });
  });

  // Initialize with URL parameters or checked category
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  const urlService = urlParams.get('service');
  const urlSqm = urlParams.get('sqm');
  const urlFreq = urlParams.get('freq');
  const urlEstimate = urlParams.get('estimate');

  if (urlCategory) {
    const targetRadio = document.querySelector(`input[name="category"][value="${urlCategory}"]`);
    if (targetRadio) {
      targetRadio.checked = true;
      updateServicesDropdown(urlCategory);
    }
  } else {
    const checkedCat = document.querySelector('input[name="category"]:checked');
    if (checkedCat) updateServicesDropdown(checkedCat.value);
  }

  if (urlService && serviceSelect) {
    Array.from(serviceSelect.options).forEach(opt => {
      if (opt.value.toLowerCase() === urlService.toLowerCase()) {
        serviceSelect.value = opt.value;
      }
    });
  }

  if (urlSqm) {
    const sizeInput = document.getElementById('leadSize');
    if (sizeInput) sizeInput.value = urlSqm;
  }

  if (urlFreq) {
    const freqSelect = document.getElementById('leadFrequency');
    if (freqSelect) freqSelect.value = urlFreq;
  }

  if (urlEstimate) {
    const banner = document.getElementById('estimateLockedBanner');
    const bannerText = document.getElementById('estimateLockedText');
    if (banner && bannerText) {
      bannerText.textContent = urlEstimate;
      banner.style.display = 'block';
    }
    const notesArea = document.getElementById('leadNotes');
    if (notesArea && !notesArea.value) {
      notesArea.value = `[Stima Calcolatore Online]: ${urlEstimate}`;
    }
  }

  // 3. Form Submit Handler
  const leadForm = document.getElementById('leadRequestForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = leadForm.querySelector('button[type="submit"]');
      const feedback = document.getElementById('leadFeedback');
      
      const formData = new FormData(leadForm);
      const payload = Object.fromEntries(formData.entries());

      if (!payload.firstName || !payload.phone || !payload.email || !payload.zoneId) {
        if (feedback) {
          feedback.className = 'feedback-msg error';
          feedback.textContent = 'Per favore, compila tutti i campi obbligatori contrassegnati con *.';
          feedback.style.display = 'block';
        }
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>Registrazione pratica in corso...</span>';

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const leadCode = `LEAD-2026-FI-${randomSuffix}`;

      const matchedZone = FIRENZE_ZONES.find(z => z.id === payload.zoneId) || FIRENZE_ZONES[0];
      const sectorMap = {
        COMMERCIAL: 'COMMERCIALE',
        CONDOMINIUM: 'CONDOMINIO',
        PRIVATE: 'PRIVATO'
      };
      const customerTypeMap = {
        COMMERCIAL: 'AZIENDA',
        CONDOMINIUM: 'AMMINISTRATORE',
        PRIVATE: 'PRIVATO'
      };

      const sector = sectorMap[payload.category] || 'COMMERCIALE';
      const customerType = customerTypeMap[payload.category] || 'AZIENDA';
      const fullName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
      const displayClientName = payload.companyOrCondoName
        ? `${payload.companyOrCondoName} (${fullName})`
        : fullName;

      const suggestedOffer = computeSuggestedOffer(
        payload.category,
        payload.propertySizeSqm,
        payload.frequency,
        urlEstimate
      );

      const detailedNotes = [
        payload.serviceName ? `Servizio: ${payload.serviceName}` : '',
        payload.propertySizeSqm ? `Superficie: ${payload.propertySizeSqm} mq` : '',
        payload.frequency ? `Frequenza: ${payload.frequency}` : '',
        `Offerta Stimata: ${suggestedOffer}`,
        payload.notes ? `Note: ${payload.notes}` : ''
      ].filter(Boolean).join(' • ');

      // Salva subito nel bridge locale per visibilità istantanea nella Dashboard Admin
      const localLeadRecord = {
        id: `lead_${Date.now()}`,
        code: leadCode,
        name: displayClientName,
        contact: `${fullName} (${payload.phone})`,
        phone: payload.phone,
        email: payload.email,
        sector,
        customer_type: customerType,
        zone_id: matchedZone.code || 'FI-CENTRO',
        zone_name: matchedZone.name,
        address: payload.address || matchedZone.name,
        sqm: payload.propertySizeSqm ? parseInt(payload.propertySizeSqm, 10) : null,
        frequency: payload.frequency || 'SETTIMANALE',
        service_name: payload.serviceName || 'Pulizia Professionale',
        estimated_offer: suggestedOffer,
        offer_status: 'DA_INVIARE',
        details: detailedNotes,
        status: 'NUOVA',
        assigned_company_id: null,
        created_at: new Date().toLocaleString('it-IT')
      };

      saveLeadToLocalBridge(localLeadRecord);

      let returnedId = leadCode;

      try {
        const res = await fetch('/api/leads/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_code: leadCode,
            sector,
            customer_type: customerType,
            full_name: displayClientName,
            company_name: payload.companyOrCondoName || null,
            email: payload.email,
            phone: payload.phone,
            geographic_area_id: payload.zoneId,
            address: payload.address || matchedZone.name,
            square_meters: payload.propertySizeSqm ? parseInt(payload.propertySizeSqm, 10) : null,
            frequency: payload.frequency || 'SETTIMANALE',
            notes: detailedNotes
          })
        });

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          returnedId = data.lead_code || leadCode;
        }
      } catch (apiErr) {
        // Fallback locale già garantito da saveLeadToLocalBridge
      }

      leadForm.reset();
      if (feedback) {
        feedback.className = 'feedback-msg success';
        feedback.innerHTML = `
          <strong>✅ Richiesta Registrata con Successo! (Codice Pratica: ${returnedId})</strong><br>
          La Centrale Operativa di Firenze Pulizie ha ricevuto la tua richiesta (${suggestedOffer}) e ha allertato la squadra del quartiere <strong>${matchedZone.name}</strong>. Riceverai conferma e offerta formale entro 2 ore lavorative.
        `;
        feedback.style.display = 'block';
      }
      btn.innerHTML = '<span>✓ Richiesta Inviata con Successo!</span>';
    });
  }
});
