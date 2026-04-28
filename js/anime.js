/* ============================================
   anime.js — 二次元装饰效果
   ============================================ */
const AnimeEffects = {
  sakuraEnabled: true,
  particlesEnabled: true,
  glowEnabled: true,

  init() {
    this.sakuraEnabled = Storage.get('setting-sakura', true);
    this.particlesEnabled = Storage.get('setting-particles', true);
    this.glowEnabled = Storage.get('setting-glow', true);

    if (this.sakuraEnabled) this.startSakura();
    if (this.particlesEnabled) this.startParticles();
    if (this.glowEnabled) this.startGlow();
  },

  // 樱花飘落
  startSakura() {
    const container = document.getElementById('sakura-container');
    if (!container) return;

    const createPetal = () => {
      if (!this.sakuraEnabled) return;
      const petal = document.createElement('div');
      petal.className = 'sakura';
      const size = 10 + Math.random() * 16;
      const duration = 8 + Math.random() * 12;
      const drift = -100 + Math.random() * 200;
      const spin = 180 + Math.random() * 360;
      const hue = -10 + Math.random() * 20;

      petal.style.cssText = `
        left: ${Math.random() * 100}%;
        --size: ${size}px;
        --drift: ${drift}px;
        --spin: ${spin}deg;
        --opacity: ${0.3 + Math.random() * 0.4};
        --hue: ${hue}deg;
        animation-duration: ${duration}s;
      `;
      container.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000);
    };

    // 初始花瓣
    for (let i = 0; i < 5; i++) setTimeout(createPetal, i * 800);
    this._sakuraInterval = setInterval(createPetal, 2000);
  },

  stopSakura() {
    clearInterval(this._sakuraInterval);
    const container = document.getElementById('sakura-container');
    if (container) container.innerHTML = '';
  },

  // 粒子背景
  startParticles() {
    const canvas = document.getElementById('particles-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: -0.3 + Math.random() * 0.6,
        vy: -0.3 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.3
      });
    }

    const animate = () => {
      if (!this.particlesEnabled) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const particleAlpha = isDark ? 1 : 0.5;
      const lineAlpha = isDark ? 0.05 : 0.03;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--accent-rgb), ${p.alpha * particleAlpha})`;
        ctx.fill();
      });

      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(var(--accent-rgb), ${lineAlpha * (1 - dist/120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };
    animate();
  },

  // 动态光晕
  startGlow() {
    // 光晕效果已通过CSS实现
    document.querySelectorAll('.glow-orb').forEach(el => el.style.display = '');
  },

  stopGlow() {
    document.querySelectorAll('.glow-orb').forEach(el => el.style.display = 'none');
  },

  // 更新设置
  updateSetting(key, value) {
    switch(key) {
      case 'sakura':
        this.sakuraEnabled = value;
        Storage.set('setting-sakura', value);
        value ? this.startSakura() : this.stopSakura();
        break;
      case 'particles':
        this.particlesEnabled = value;
        Storage.set('setting-particles', value);
        if (value) this.startParticles();
        break;
      case 'glow':
        this.glowEnabled = value;
        Storage.set('setting-glow', value);
        value ? this.startGlow() : this.stopGlow();
        break;
    }
  }
};
