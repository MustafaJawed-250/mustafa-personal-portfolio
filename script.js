/**
 * Muhammad Mustafa Jawed — Portfolio
 * Vanilla JS: animations, chatbot, interactions
 */

(() => {
  'use strict';

  // ---------- DOM Elements ----------
  const preloader = document.getElementById('preloader');
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotForm = document.getElementById('chatbotForm');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotMessages = document.getElementById('chatbotMessages');

  // ---------- State ----------
  let chatHistory = [];
  let isChatOpen = false;
  let isSending = false;

  // ---------- Preloader ----------
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader?.classList.add('hidden');
      document.body.classList.add('cursor-ready');
    }, 1400);
  });

  // ---------- Year ----------
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Custom Cursor ----------
  if (cursor && cursorFollower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .skill-card, .service-card, .magnetic');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
    });
  }

  // ---------- Magnetic Buttons ----------
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---------- Navbar Scroll ----------
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
      scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
    }

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 500);
    }

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- Mobile Nav ----------
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', open);
      document.body.classList.toggle('no-scroll', open);
    });

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ---------- Back to Top ----------
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Intersection Observer (Reveal) ----------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // ---------- Stats Counter ----------
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10) || 0;
          animateCount(el, target);
          statsObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((el) => statsObserver.observe(el));

  function animateCount(el, target) {
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  // ---------- Project Videos ----------
  document.querySelectorAll('.project-media').forEach((media) => {
    const video = media.querySelector('.project-video');
    const playBtn = media.querySelector('.video-play-btn');
    if (!video || !playBtn) return;

    // Intersection: autoplay when in view (muted)
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            media.classList.add('playing');
          } else {
            video.pause();
            media.classList.remove('playing');
          }
        });
      },
      { threshold: 0.4 }
    );
    videoObserver.observe(media);

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play().catch(() => {});
        media.classList.add('playing');
      } else {
        video.pause();
        media.classList.remove('playing');
      }
    });

    media.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
        media.classList.add('playing');
      }
    });
  });

  // ---------- Typing Effect ----------
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = ['AI Web Developer', 'Frontend Developer', 'Full Stack Builder', 'AI Integrator'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      setTimeout(type, delay);
    };
    setTimeout(type, 800);
  }

  // ---------- Contact Form ----------
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:mustafajawed250@gmail.com?subject=${subject}&body=${body}`;
  });

  // ---------- AI Chatbot ----------
  chatbotToggle?.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    chatbotWindow?.classList.toggle('open', isChatOpen);
    chatbotToggle.classList.toggle('open', isChatOpen);
    chatbotToggle.setAttribute('aria-expanded', isChatOpen);
    chatbotWindow?.setAttribute('aria-hidden', !isChatOpen);

    if (isChatOpen) {
      chatbotInput?.focus();
    }
  });

  // Close chatbot on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isChatOpen) {
      isChatOpen = false;
      chatbotWindow?.classList.remove('open');
      chatbotToggle?.classList.remove('open');
      chatbotToggle?.setAttribute('aria-expanded', 'false');
      chatbotWindow?.setAttribute('aria-hidden', 'true');
    }
  });

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chatbotMessages?.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function appendTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot typing';
    div.id = 'typingIndicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages?.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typingIndicator')?.remove();
  }

  function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, (c) => map[c]);
  }

  chatbotForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSending) return;

    const message = chatbotInput?.value.trim();
    if (!message) return;

    chatbotInput.value = '';
    appendMessage('user', message);
    chatHistory.push({ role: 'user', content: message });

    isSending = true;
    const submitBtn = chatbotForm.querySelector('button');
    if (submitBtn) submitBtn.disabled = true;

    appendTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: chatHistory })
      });

      removeTyping();

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        appendMessage('bot', err.error || 'Sorry, something went wrong. Please try again.');
      } else {
        const data = await res.json();
        const reply = data.reply || 'Sorry, I could not generate a response.';
        appendMessage('bot', reply);
        chatHistory.push({ role: 'assistant', content: reply });
      }
    } catch (err) {
      removeTyping();
      appendMessage('bot', 'Unable to reach the AI service. Make sure the server is running and your Groq API key is set.');
    } finally {
      isSending = false;
      if (submitBtn) submitBtn.disabled = false;
      chatbotInput?.focus();
    }
  });

  // ---------- Keyboard accessibility: skip to main ----------
  // Already handled via semantic HTML and focus-visible styles
})();
