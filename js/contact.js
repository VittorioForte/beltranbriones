/* ============================================================
   contact.js — Contact Form + SweetAlert2 + Interactivity
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

  // ---- CONTACT FORM ----
  const form = document.getElementById('contactFormEl');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = document.getElementById('website');
      if (honeypot && honeypot.value !== '') {
        // Bot detected — silently "succeed"
        showSuccess();
        return;
      }

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validation
      const errors = [];
      if (!name) errors.push('Ingresá tu nombre completo.');
      if (!email) {
        errors.push('Ingresá tu email.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Ingresá un email válido.');
      }
      if (!message) errors.push('Escribí un mensaje.');

      if (errors.length > 0) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            html: errors.map(e => `<p style="margin:0.25rem 0;font-size:0.95rem;">${e}</p>`).join(''),
            background: '#0d1320',
            color: '#f0ede8',
            confirmButtonColor: '#c9a84c',
            confirmButtonText: 'Entendido',
            customClass: {
              popup: 'swal-dark'
            }
          });
        } else {
          alert(errors.join('\n'));
        }
        return;
      }

      // Success
      showSuccess();
      form.reset();
    });
  }

  function showSuccess() {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Nos contactaremos a la brevedad.',
        background: '#0d1320',
        color: '#f0ede8',
        confirmButtonColor: '#c9a84c',
        confirmButtonText: 'Cerrar',
        customClass: {
          popup: 'swal-dark'
        }
      });
    } else {
      alert('¡Mensaje enviado! Nos contactaremos a la brevedad.');
    }
  }

})();
