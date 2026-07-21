/* ==========================================================================
   MOITILIMPA.PT - CALCULATOR LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const typeBtns = document.querySelectorAll('.type-btn');
  const areaSlider = document.getElementById('areaSlider');
  const areaValue = document.getElementById('areaValue');
  const freqBtns = document.querySelectorAll('.freq-btn');
  const extraCheckboxes = document.querySelectorAll('.extra-checkbox');
  const priceDisplay = document.getElementById('priceDisplay');
  const bookCalcBtn = document.getElementById('bookCalcBtn');

  if (!areaSlider || !priceDisplay) return;

  // Base rates per m2 for different cleaning types (€)
  const rates = {
    apartamento: { base: 35, perM2: 0.45 },
    moradia: { base: 45, perM2: 0.55 },
    escritorio: { base: 40, perM2: 0.40 },
    pos_obra: { base: 70, perM2: 0.90 },
    estofos: { base: 50, perM2: 0.30 }
  };

  // Frequency discounts
  const freqDiscounts = {
    semanal: 0.80,   // 20% discount
    quinzenal: 0.90, // 10% discount
    mensal: 0.95,    // 5% discount
    pontual: 1.00    // standard
  };

  let selectedType = 'apartamento';
  let selectedArea = parseInt(areaSlider.value, 10);
  let selectedFreq = 'semanal';

  // Handle Type Selection
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.dataset.type;
      calculatePrice();
    });
  });

  // Handle Area Slider Input
  areaSlider.addEventListener('input', (e) => {
    selectedArea = parseInt(e.target.value, 10);
    areaValue.textContent = `${selectedArea} m²`;
    calculatePrice();
  });

  // Handle Frequency Buttons
  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFreq = btn.dataset.freq;
      calculatePrice();
    });
  });

  // Handle Extra Checkboxes
  extraCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      calculatePrice();
    });
  });

  function calculatePrice() {
    const config = rates[selectedType] || rates.apartamento;
    let total = config.base + (selectedArea * config.perM2);

    // Apply frequency multiplier
    const freqMult = freqDiscounts[selectedFreq] || 1.0;
    total = total * freqMult;

    // Add extra services
    extraCheckboxes.forEach(cb => {
      if (cb.checked) {
        total += parseFloat(cb.dataset.price || 0);
      }
    });

    const finalPrice = Math.round(total);
    animatePrice(finalPrice);
  }

  function animatePrice(targetPrice) {
    const currentPrice = parseInt(priceDisplay.textContent.replace('€', '') || 0, 10);
    const duration = 400;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.round(currentPrice + (targetPrice - currentPrice) * progress);
      priceDisplay.textContent = `${val}€`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Handle Booking from Calculator
  if (bookCalcBtn) {
    bookCalcBtn.addEventListener('click', () => {
      const quoteForm = document.getElementById('pedir-orcamento');
      const serviceSelect = document.getElementById('quoteService');
      const areaInput = document.getElementById('quoteArea');
      const priceVal = priceDisplay.textContent;

      if (serviceSelect) {
        const typeMap = {
          apartamento: 'Limpeza Doméstica',
          moradia: 'Limpeza Doméstica',
          escritorio: 'Limpeza Comercial & Escritórios',
          pos_obra: 'Limpeza Pós-Obra',
          estofos: 'Higienização de Estofos'
        };
        serviceSelect.value = typeMap[selectedType] || 'Limpeza Doméstica';
      }

      if (areaInput) {
        areaInput.value = `${selectedArea} m² (Estimativa calculada: ${priceVal})`;
      }

      if (quoteForm) {
        quoteForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initial Calculation
  calculatePrice();
});
