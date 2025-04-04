// Efeitos Cyberpunk para o site principal
document.addEventListener('DOMContentLoaded', function() {
    // 1. Efeito de glitch nos elementos
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

    // 2. Efeito de hover holográfico nos cards
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

    // 3. Efeito de digitação
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

    // 4. Animações das barras de habilidades
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level') || bar.style.width.replace('%', '');
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = `${level}%`;
        }, 500);
    });

    // 5. Controles da janela terminal
    const setupTerminalButtons = () => {
        // Botão vermelho - Fechar com confirmação
        document.querySelectorAll('.terminal-btn.red').forEach(btn => {
            btn.addEventListener('click', function() {
                // Efeito visual no botão
                this.style.transform = 'scale(1.2)';
                setTimeout(() => this.style.transform = 'scale(1)', 200);
                
                // Confirmação e animação de fechamento
                if (confirm('Deseja realmente fechar esta janela?')) {
                    const terminal = this.closest('.cyber-terminal');
                    if (terminal) {
                        terminal.style.transition = 'all 0.3s ease';
                        terminal.style.transform = 'scale(0.8) translateY(20px)';
                        terminal.style.opacity = '0';
                        
                        setTimeout(() => {
                            terminal.classList.add('closed');
                            terminal.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });

        // Botão amarelo - Minimizar
        document.querySelectorAll('.terminal-btn.yellow').forEach(btn => {
            btn.addEventListener('click', function() {
                const terminal = this.closest('.cyber-terminal');
                if (terminal) {
                    terminal.classList.toggle('minimized');
                    // Restaura a janela se estiver maximizada
                    if (terminal.classList.contains('maximized')) {
                        terminal.classList.remove('maximized');
                    }
                }
            });
        });

        // Botão verde - Maximizar/Restaurar
        document.querySelectorAll('.terminal-btn.green').forEach(btn => {
            btn.addEventListener('click', function() {
                const terminal = this.closest('.cyber-terminal');
                if (terminal) {
                    terminal.classList.toggle('maximized');
                    // Garante que não fique minimizada e maximizada ao mesmo tempo
                    if (terminal.classList.contains('minimized')) {
                        terminal.classList.remove('minimized');
                    }
                }
            });
        });
    };

    // 6. Botão para reabrir a janela terminal (opcional)
    const reopenBtn = document.getElementById('reopen-terminal');
    if (reopenBtn) {
        reopenBtn.addEventListener('click', function() {
            const terminalWindow = document.querySelector('.cyber-terminal.closed');
            if (terminalWindow) {
                terminalWindow.style.display = 'block';
                setTimeout(() => {
                    terminalWindow.classList.remove('closed');
                    terminalWindow.style.opacity = '1';
                    terminalWindow.style.transform = 'scale(1)';
                }, 10);
            }
        });
    }

    // Inicializa todos os efeitos
    setupTerminalButtons();

    // 7. Efeito de partículas (opcional)
    const particleElements = document.querySelectorAll('.particle-effect');
    particleElements.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
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
        });
    });
});
