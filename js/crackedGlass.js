// Efeito de Vidro Rachado Dinâmico
class CrackedGlassEffect {
    constructor() {
        this.cracks = [];
        this.initCrackedGlass();
    }
    
    initCrackedGlass() {
        const overlay = document.getElementById('cracked-glass-overlay');
        if (!overlay) return;
        
        // Gerar rachaduras aleatórias
        this.generateCracks(overlay);
        
        // Aplicar efeito nos elementos com data-crack-trigger
        document.querySelectorAll('[data-crack-trigger]').forEach(trigger => {
            trigger.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, overlay));
            trigger.addEventListener('mouseleave', () => this.handleMouseLeave(overlay));
        });
    }
    
    generateCracks(overlay) {
        let cracksSVG = '';
        for (let i = 0; i < 15; i++) {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = x1 + (Math.random() * 40 - 20);
            const y2 = y1 + (Math.random() * 40 - 20);
            cracksSVG += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                         stroke="rgba(0, 247, 255, ${0.3 + Math.random() * 0.4})" 
                         stroke-width="${0.3 + Math.random() * 0.7}" 
                         stroke-linecap="round"/>`;
        }
        overlay.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">${cracksSVG}</svg>')`;
    }
    
    handleMouseEnter(e, overlay) {
        const rect = e.currentTarget.getBoundingClientRect();
        overlay.style.backgroundPosition = `${rect.left}px ${rect.top}px`;
        overlay.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        overlay.style.opacity = '0.8';
    }
    
    handleMouseLeave(overlay) {
        overlay.style.opacity = '0';
    }
}

// Inicializar efeito
document.addEventListener('DOMContentLoaded', () => {
    new CrackedGlassEffect();
});
