/* ==========================================================================
   JK DIGITAL MARKETING — MID-LEVEL INTERACTION & ANIMATION RUNTIME
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INJECT SCROLL PROGRESS BAR IF NOT PRESENT
  let progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    document.body.appendChild(progressBar);
  }

  // 2. INJECT BACK TO TOP BUTTON IF NOT PRESENT
  let backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTopBtn';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
      </svg>
    `;
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTopBtn);
  }

  // 3. SCROLL LISTENER (PROGRESS BAR & BACK-TO-TOP VISIBILITY)
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;

    if (scrollTop > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  // 4. SCROLL REVEAL OBSERVER WITH STAGGER
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: unobserve once revealed for performance
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. ANIMATED NUMBER COUNTERS
  const counters = document.querySelectorAll('.counter, .counter-decimal');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    let countersTriggered = false;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersTriggered) {
          countersTriggered = true;
          runAllCounters();
        }
      });
    }, { threshold: 0.2 });

    const statsSection = document.getElementById('statsContainer') || counters[0].closest('section') || counters[0].parentElement;
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  }

  function runAllCounters() {
    counters.forEach(counter => {
      if (counter.classList.contains('counter-decimal')) {
        const target = parseFloat(counter.getAttribute('data-target')) || 4.9;
        let current = 0;
        const interval = setInterval(() => {
          current += 0.2;
          if (current >= target) {
            counter.innerText = target.toFixed(1);
            clearInterval(interval);
          } else {
            counter.innerText = current.toFixed(1);
          }
        }, 40);
      } else {
        const target = parseInt(counter.getAttribute('data-target'), 10) || 50;
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 40));
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target;
            clearInterval(interval);
          } else {
            counter.innerText = current;
          }
        }, 30);
      }
    });
  }

  // 6. FAQ ACCORDION INTERACTIVITY
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger') || item.querySelector('h3');
    if (trigger) {
      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others in same container for clean accordion behavior
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });

  // 7. BUTTON HOVER SHIMMER CLASS ATTACHMENT
  document.querySelectorAll('button.bg-crimson, a.bg-crimson').forEach(btn => {
    btn.classList.add('btn-shimmer');
  });

  // 8. CARD HOVER ENHANCEMENTS
  document.querySelectorAll('.shadow-card').forEach(card => {
    card.classList.add('card-hover-fx');
  });
});
