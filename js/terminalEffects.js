// Efeitos específicos para a página de terminal
document.addEventListener('DOMContentLoaded', function() {
    // Simular digitação nos comandos
    const commandLines = document.querySelectorAll('.command-line');
    
    commandLines.forEach(line => {
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
    });
    
    // Efeito de hover nos cards de exercícios
    const exerciseCards = document.querySelectorAll('.exercise-card');
    
    exerciseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const glitch = this.querySelector('.exercise-glitch');
            glitch.style.opacity = '0.3';
        });
        
        card.addEventListener('mouseleave', function() {
            const glitch = this.querySelector('.exercise-glitch');
            glitch.style.opacity = '0';
        });
    });
    
    // Efeito de terminal ativo
    const terminal = document.querySelector('.cyber-terminal');
    
    function terminalNoise() {
        const noise = document.createElement('div');
        noise.className = 'terminal-noise';
        terminal.appendChild(noise);
        
        setTimeout(() => {
            noise.remove();
        }, 100);
    }
    
    setInterval(terminalNoise, 5000);
    
    // Efeito de cursor piscando
    const cursor = document.querySelector('.cursor');
    
    if (cursor) {
        setInterval(() => {
            cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }, 500);
    }
    
    // Simular processamento
    const progressBars = document.querySelectorAll('.progress-value');
    
    progressBars.forEach(bar => {
        let width = parseInt(bar.style.width);
        let direction = 1;
        
        setInterval(() => {
            width += direction * 5;
            
            if (width >= 100) direction = -1;
            if (width <= 30) direction = 1;
            
            bar.style.width = `${width}%`;
        }, 300);
    });
});
