// Efeitos específicos para a página de terminal
document.addEventListener('DOMContentLoaded', function() {
    // Limpar intervalos quando sair da página
    const animationIntervals = [];
    
    // 1. Simular digitação nos comandos (com prefers-reduced-motion)
    const commandLines = document.querySelectorAll('.command-line');
    
    commandLines.forEach(line => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return; // Não animar se o usuário preferir movimento reduzido
        }

        const command = line.querySelector('.command');
        const text = command.textContent;
        command.textContent = '';
        
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                command.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50);
        
        animationIntervals.push(typing);
    });
    
    // 2. Efeito de hover nos cards de exercícios (otimizado)
    const exerciseCards = document.querySelectorAll('.exercise-card');
    
    exerciseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const glitch = this.querySelector('.exercise-glitch');
            if (glitch) glitch.style.opacity = '0.3';
        });
        
        card.addEventListener('mouseleave', function() {
            const glitch = this.querySelector('.exercise-glitch');
            if (glitch) glitch.style.opacity = '0';
        });
    });
    
    // 3. Efeito de terminal ativo (otimizado)
    const terminal = document.querySelector('.cyber-terminal');
    
    if (terminal && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        function terminalNoise() {
            const noise = document.createElement('div');
            noise.className = 'terminal-noise';
            terminal.appendChild(noise);
            
            setTimeout(() => {
                noise.remove();
            }, 100);
        }
        
        const noiseInterval = setInterval(terminalNoise, 5000);
        animationIntervals.push(noiseInterval);
    }
    
    // 4. Efeito de cursor piscando (com acessibilidade)
    const cursor = document.querySelector('.cursor');
    
    if (cursor) {
        const cursorInterval = setInterval(() => {
            cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }, 500);
        
        animationIntervals.push(cursorInterval);
    }
    
    // 5. Simular processamento (otimizado)
    const progressBars = document.querySelectorAll('.progress-value');
    
    progressBars.forEach(bar => {
        let width = parseInt(bar.style.width);
        let direction = 1;
        
        const progressInterval = setInterval(() => {
            width += direction * 5;
            
            if (width >= 100) direction = -1;
            if (width <= 30) direction = 1;
            
            bar.style.width = `${width}%`;
        }, 300);
        
        animationIntervals.push(progressInterval);
    });

    // Limpar animações ao sair da página
    window.addEventListener('beforeunload', () => {
        animationIntervals.forEach(interval => clearInterval(interval));
    });
});

// Fallback para quando JS estiver desabilitado
document.documentElement.classList.add('js-enabled');
