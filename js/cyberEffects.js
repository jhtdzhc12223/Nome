// Efeitos Cyberpunk para o site principal
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de glitch nos elementos com classe glitch
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.textShadow = `
                0.05em 0 0 rgba(255, 0, 170, 0.75),
                -0.025em -0.05em 0 rgba(0, 247, 255, 0.75),
                0.025em 0.05em 0 rgba(0, 255, 136, 0.75)
            `;
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
    
    // Efeito de hover holográfico
    const holographicCards = document.querySelectorAll('.holographic-card');
    
    holographicCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const centerX = this.offsetWidth / 2;
            const centerY = this.offsetHeight / 2;
            
            const angleX = (centerY - y) / 10;
            const angleY = (x - centerX) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // Efeito de digitação para elementos com classe typewriter
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 100);
    });
    
    // Ativar animação das barras de habilidades
    const skillBars = document.querySelectorAll('.skill-level');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = `${level}%`;
        }, 500);
    });
    
    // Efeito de partículas para elementos específicos
    const particleElements = document.querySelectorAll('.particle-effect');
    
    particleElements.forEach(el => {
        el.addEventListener('mouseenter', createParticles);
    });
    
    function createParticles(e) {
        const particles = document.createElement('div');
        particles.className = 'particles';
        
        const x = e.clientX;
        const y = e.clientY - this.getBoundingClientRect().top;
        
        particles.style.left = `${x}px`;
        particles.style.top = `${y}px`;
        
        this.appendChild(particles);
        
        setTimeout(() => {
            particles.remove();
        }, 1000);
    }
});
