/* ==========================================================================
   MOITILIMPA.PT - MAIN APP JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Portfolio Filtering & Lightbox Modal
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxImg && lightboxModal) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  lightboxClose?.addEventListener('click', () => {
    lightboxModal?.classList.remove('active');
  });

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });

  // 4. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isActive = parent.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // 5. Quote Form Submission Handler
  const quoteForm = document.getElementById('quoteForm');
  const formFeedback = document.getElementById('formFeedback');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quoteName').value;
      const phone = document.getElementById('quotePhone').value;
      const service = document.getElementById('quoteService').value;
      const location = document.getElementById('quoteLocation').value;
      const message = document.getElementById('quoteMessage').value;

      // Visual confirmation
      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>Obrigado, ${name}!</strong><br>
          O seu pedido de orçamento para <em>${service}</em> na zona de <em>${location}</em> foi recebido com sucesso. 
          Entraremos em contacto via telefone (${phone}) em menos de 2 horas!
        `;
      }

      // Also construct WhatsApp prefilled message URL
      const textMessage = `Olá Moitilimpa.pt! Meu nome é ${name}. Gostaria de um orçamento para ${service} em ${location}. Contacto: ${phone}. Msg: ${message}`;
      const waUrl = `https://wa.me/351910000000?text=${encodeURIComponent(textMessage)}`;

      // Reset form after short delay
      setTimeout(() => {
        quoteForm.reset();
      }, 3000);

      // Offer direct WhatsApp click
      window.open(waUrl, '_blank');
    });
  }
});
