
// main.js - Scripts principais do portfólio

// Inicializar tooltips do Bootstrap
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Efeito de digitação para elementos com classe typewriter
function initTypewriterEffects() {
  const typewriterElements = document.querySelectorAll('.typewriter');
  
  typewriterElements.forEach(el => {
    const text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typing);
        setTimeout(() => {
          el.classList.add('glitch-active');
        }, 500);
      }
    }, 100 + Math.random() * 50);
  });
}

// Animação de scroll suave para links internos
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Ativar/desativar menu mobile
function initMobileMenu() {
  const menuToggle = document.querySelector('.cyber-menu-btn');
  const menu = document.getElementById('mainNav');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      menu.classList.toggle('show');
    });
  }
}

// Validar formulário de contato
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');
      
      // Simular envio
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
      
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Mensagem Enviada!';
        
        // Resetar formulário após 2 segundos
        setTimeout(() => {
          this.reset();
          submitButton.disabled = false;
          submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Mensagem';
        }, 2000);
      }, 1500);
    });
  }
}

// Ativar modo noturno/diurno
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.documentElement.setAttribute('data-theme', 
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }
}

// Inicializar tudo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  initTypewriterEffects();
  initSmoothScroll();
  initMobileMenu();
  initContactForm();
  initThemeToggle();
  
  // Adicionar classe quando JS estiver habilitado
  document.documentElement.classList.add('js-enabled');
  
  // Ativar animações quando elementos estiverem visíveis
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('[data-animate]').forEach(el => {
    animateOnScroll.observe(el);
  });
});

// Lidar com redimensionamento da janela
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    // Atualizar posições/efeitos que dependem do tamanho da tela
  }, 250);
});
