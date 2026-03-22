/* ============================================================
   proyectos.js — Proyectos Page: Filters + Interactivity
   ============================================================ */

(function () {
  'use strict';

  // Init Lucide
  if (window.lucide) lucide.createIcons();

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach(el => revealObserver.observe(el));

  // ---- FILTER SYSTEM ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const status = card.getAttribute('data-status');

        let show = false;

        if (filter === 'all') {
          show = true;
        } else if (filter === 'buenosaires') {
          show = category === 'buenosaires';
        } else if (filter === 'eeuu') {
          show = category === 'eeuu';
        } else if (filter === 'construccion') {
          show = status === 'construccion';
        } else if (filter === 'entregado') {
          show = status === 'entregado';
        }

        if (show) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ---- PROJECT MODAL ----
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalBadge = document.getElementById('modalBadge');
  const modalName = document.getElementById('modalName');
  const modalLocationText = document.getElementById('modalLocationText');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalFeaturesList = document.getElementById('modalFeaturesList');

  function openProjectModal(card) {
    if (!modal) return;
    const name = card.dataset.name;
    const location = card.dataset.location;
    const status = card.dataset.status === 'entregado' ? 'Entregado' : 'En construcción';
    const image = card.dataset.image;
    const desc = card.dataset.desc;
    const pisos = card.dataset.pisos;
    const unidades = card.dataset.unidades;
    const superficie = card.dataset.superficie;
    const año = card.dataset.año;
    const features = card.dataset.features ? card.dataset.features.split(',') : [];

    modalImage.src = image;
    modalImage.alt = name;
    modalBadge.textContent = status;
    modalName.textContent = name;
    modalLocationText.textContent = location;
    modalDesc.textContent = desc;

    modalSpecs.innerHTML = '';
    const specs = [
      { label: 'Pisos', value: pisos },
      { label: 'Unidades', value: unidades },
      { label: 'Superficie', value: superficie },
      { label: 'Año', value: año }
    ];
    specs.forEach(s => {
      if (s.value) {
        modalSpecs.innerHTML += `
          <div class="project-modal__spec">
            <p class="project-modal__spec-label">${s.label}</p>
            <p class="project-modal__spec-value">${s.value}</p>
          </div>`;
      }
    });

    modalFeaturesList.innerHTML = '';
    features.forEach(f => {
      modalFeaturesList.innerHTML += `<span class="project-modal__feature-tag">${f.trim()}</span>`;
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(card);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

})();
