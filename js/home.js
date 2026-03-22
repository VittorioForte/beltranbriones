/* ============================================================
   home.js — Three.js 3D Hero + Home Page Interactivity
   ============================================================ */

(function () {
  'use strict';

  // ---- INIT LUCIDE ICONS ----
  if (window.lucide) lucide.createIcons();

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ---- HAMBURGER MENU ----
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

  // ---- SCROLL REVEAL (IntersectionObserver) ----
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

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;
  const statsBar = document.getElementById('statsBar');

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
  }

  // ---- HERO OVERLAY FADE ON SCROLL ----
  const heroOverlay = document.getElementById('heroOverlay');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const heroSection = document.getElementById('hero');

  function handleHeroFade() {
    if (!heroSection) return;
    const heroHeight = heroSection.offsetHeight;
    const progress = Math.min(window.scrollY / heroHeight, 1);
    if (heroOverlay) heroOverlay.style.opacity = 1 - progress * 1.5;
    if (scrollIndicator) scrollIndicator.style.opacity = 1 - progress * 3;
  }
  window.addEventListener('scroll', handleHeroFade);

  // ---- THREE.JS 3D HERO ----
  const heroCanvas = document.getElementById('heroCanvas');
  const isMobile = window.innerWidth < 768;

  if (heroCanvas && !isMobile && typeof THREE !== 'undefined') {
    let animationId;
    let isHeroVisible = true;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 8, 18);
    camera.rotation.x = -0.1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    heroCanvas.appendChild(renderer.domElement);

    // Lighting
    const dirLight = new THREE.DirectionalLight(0xc9a84c, 0.8);
    dirLight.position.set(8, 12, 5);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x4a5568, 0.5);
    scene.add(ambientLight);

    // Ground Grid (Blueprint)
    const gridHelper = new THREE.GridHelper(40, 40, 0xc9a84c, 0xc9a84c);
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Floor plane
    const planeGeo = new THREE.PlaneGeometry(40, 40);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.01;
    scene.add(plane);

    // Buildings
    const buildings = [];
    const buildingGroup = new THREE.Group();
    const numBuildings = 28;

    for (let i = 0; i < numBuildings; i++) {
      const width = 0.5 + Math.random() * 1.2;
      const depth = 0.5 + Math.random() * 1.2;
      const height = 1 + Math.random() * 7;

      const geo = new THREE.BoxGeometry(width, height, depth);

      // Wireframe version
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const wireMesh = new THREE.Mesh(geo, wireMat);

      // Solid version
      const solidMat = new THREE.MeshPhongMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.15,
        emissive: 0xc9a84c,
        emissiveIntensity: 0.03
      });
      const solidMesh = new THREE.Mesh(geo, solidMat);

      // Position in grid with random offset
      const col = (i % 7) - 3;
      const row = Math.floor(i / 7) - 2;
      const x = col * 2.8 + (Math.random() - 0.5) * 1.2;
      const z = row * 2.8 + (Math.random() - 0.5) * 1.2;

      wireMesh.position.set(x, 0, z);
      solidMesh.position.set(x, 0, z);

      wireMesh.scale.y = 0;
      solidMesh.scale.y = 0;

      buildingGroup.add(wireMesh);
      buildingGroup.add(solidMesh);

      buildings.push({
        wire: wireMesh,
        solid: solidMesh,
        targetHeight: height,
        x: x,
        z: z,
        delay: i * 0.03
      });
    }
    scene.add(buildingGroup);

    // Crane arm on tallest building
    const tallest = buildings.reduce((a, b) => a.targetHeight > b.targetHeight ? a : b);
    const craneGeo = new THREE.BoxGeometry(0.05, 0.05, 4);
    const craneMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.6 });
    const crane = new THREE.Mesh(craneGeo, craneMat);
    crane.position.set(tallest.x, tallest.targetHeight + 0.5, tallest.z);
    crane.rotation.y = Math.PI / 4;
    scene.add(crane);

    // Vertical crane arm
    const craneVertGeo = new THREE.BoxGeometry(0.04, 2.5, 0.04);
    const craneVert = new THREE.Mesh(craneVertGeo, craneMat.clone());
    craneVert.position.set(tallest.x, tallest.targetHeight + 1.25, tallest.z);
    scene.add(craneVert);

    // Measurement lines (dashed)
    const lineMaterial = new THREE.LineDashedMaterial({
      color: 0xc9a84c,
      dashSize: 0.2,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.3
    });

    for (let i = 0; i < 5; i++) {
      const b1 = buildings[i * 2];
      const b2 = buildings[i * 2 + 1];
      if (b1 && b2) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(b1.x, b1.targetHeight, b1.z),
          new THREE.Vector3(b2.x, b2.targetHeight, b2.z)
        ]);
        const line = new THREE.Line(lineGeo, lineMaterial);
        line.computeLineDistances();
        scene.add(line);
      }
    }

    // Compass Rose (simplified rotating shape)
    const compassGroup = new THREE.Group();
    const compassShape = new THREE.Shape();
    compassShape.moveTo(0, 0.6);
    compassShape.lineTo(0.15, 0);
    compassShape.lineTo(0, -0.6);
    compassShape.lineTo(-0.15, 0);
    compassShape.lineTo(0, 0.6);
    const compassGeo = new THREE.ShapeGeometry(compassShape);
    const compassMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const compassMesh = new THREE.Mesh(compassGeo, compassMat);
    compassGroup.add(compassMesh);

    // Compass ring
    const ringGeo = new THREE.RingGeometry(0.65, 0.7, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    compassGroup.add(ring);

    compassGroup.position.set(-8, 6, -5);
    compassGroup.rotation.y = Math.PI / 4;
    scene.add(compassGroup);

    // Particles
    const particleCount = 300;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 30;
      particlePositions[i * 3 + 1] = Math.random() * 15 + 2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.04,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    // Animation loop
    function animate() {
      if (!isHeroVisible) return;
      animationId = requestAnimationFrame(animate);

      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
      const progress = Math.min(window.scrollY / heroHeight, 1);

      // Camera
      camera.position.y = 8 - progress * 5;
      camera.position.z = 18 - progress * 6;
      camera.rotation.x = -0.1 + progress * 0.08;

      // Buildings rise
      buildings.forEach((b) => {
        const p = Math.max(0, (progress * 1.5) - b.delay);
        const scale = Math.min(p * 2, 1);
        b.wire.scale.y = scale;
        b.solid.scale.y = scale;
        b.wire.position.y = (b.targetHeight * scale) / 2;
        b.solid.position.y = (b.targetHeight * scale) / 2;

        // Wireframe to solid transition
        b.wire.material.opacity = 0.4 - progress * 0.3;
        b.solid.material.opacity = 0.15 + progress * 0.45;
      });

      // Grid fades out
      gridHelper.material.opacity = Math.max(0, 0.15 - progress * 0.3);
      planeMat.opacity = Math.max(0, 0.03 - progress * 0.06);

      // Crane visibility
      crane.visible = progress > 0.3;
      craneVert.visible = progress > 0.3;
      if (progress > 0.3) {
        const craneProgress = (progress - 0.3) / 0.7;
        crane.position.y = tallest.targetHeight * Math.min(craneProgress * 1.5, 1) + 0.5;
        craneVert.position.y = tallest.targetHeight * Math.min(craneProgress * 1.5, 1) / 2 + tallest.targetHeight / 2;
      }

      // Compass rotation
      compassGroup.rotation.z += 0.003;

      // Particles drift upward
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.005;
        if (positions[i] > 18) positions[i] = 2;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    // Start animation
    animate();

    // Pause when hero not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && !animationId) animate();
        if (!isHeroVisible && animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    }, { threshold: 0 });
    heroObserver.observe(heroSection);

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

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
    const status = card.dataset.status;
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

    // Specs
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

    // Features
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

  // Open on card click
  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(card);
    });
  });

  // Close handlers
  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

})();

