// holographicEffects.js - Efeitos Holográficos Avançados

class HolographicEffects {
    constructor() {
        this.animationIntervals = [];
        this.animationTimeouts = [];
        this.scanlineInterval = null;
        this.gridIntervals = [];
        this.initEffects();
    }

    /* ========== INICIALIZAÇÃO PRINCIPAL ========== */
    initEffects() {
        this.initHolographicItems();
        this.initScanlineEffect();
        this.initGridEffects();
        this.initProgressBars();
        this.initHologramGlow();
        
        console.log('Holographic Effects initialized');
    }

    /* ========== ITENS HOLOGRÁFICOS ========== */
    initHolographicItems() {
        const holographicItems = document.querySelectorAll('.holographic-card, .holographic-btn, .menu-item');
        
        const handleHolographicMove = (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
            const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
            
            const centerX = e.currentTarget.offsetWidth / 2;
            const centerY = e.currentTarget.offsetHeight / 2;
            
            const angleX = (centerY - y) / 20;
            const angleY = (x - centerX) / 20;
            
            e.currentTarget.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            
            // Efeito de luz dinâmico
            const lightPosX = (x / e.currentTarget.offsetWidth) * 100;
            const lightPosY = (y / e.currentTarget.offsetHeight) * 100;
            
            e.currentTarget.style.setProperty('--light-pos-x', `${lightPosX}%`);
            e.currentTarget.style.setProperty('--light-pos-y', `${lightPosY}%`);
            
            // Efeito de brilho
            const glowIntensity = Math.sqrt(
                Math.pow((x - centerX) / centerX, 2) + 
                Math.pow((y - centerY) / centerY, 2)
            );
            
            e.currentTarget.style.setProperty('--glow-intensity', glowIntensity);
        };
        
        holographicItems.forEach(item => {
            item.addEventListener('mousemove', handleHolographicMove);
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                this.style.setProperty('--glow-intensity', '0');
            });
            
            // Adicionar elemento de grid holográfico
            const grid = document.createElement('div');
            grid.className = 'holographic-grid';
            item.appendChild(grid);
        });
    }

    /* ========== EFEITO DE SCANLINE ========== */
    initScanlineEffect() {
        const scanline = document.querySelector('.nav-scanline, .hologram-scanline, .project-scanline');
        
        if (scanline) {
            const animateScanline = () => {
                scanline.style.top = '0';
                scanline.style.transition = 'none';
                scanline.style.opacity = '0';
                
                setTimeout(() => {
                    scanline.style.transition = 'top 3s linear, opacity 0.5s ease';
                    scanline.style.top = '100%';
                    scanline.style.opacity = '0.7';
                }, 10);
            };
            
            animateScanline();
            this.scanlineInterval = setInterval(animateScanline, 3000);
            this.animationIntervals.push(this.scanlineInterval);
        }
    }

    /* ========== EFEITOS DE GRADE ========== */
    initGridEffects() {
        const grids = document.querySelectorAll('.hexagon-grid, .preview-grid, .hologram-grid');
        
        grids.forEach((grid, index) => {
            let posX = 0;
            let posY = 0;
            let direction = 1;
            
            const gridInterval = setInterval(() => {
                posX = (posX + direction) % 60;
                posY = (posY + direction) % 60;
                
                grid.style.backgroundPosition = `${posX}px ${posY}px`;
                
                // Mudar direção aleatoriamente
                if (Math.random() > 0.98) {
                    direction = -direction;
                }
            }, 100);
            
            this.gridIntervals.push(gridInterval);
            this.animationIntervals.push(gridInterval);
            
            // Adicionar efeito de pulsação aleatória
            const pulseInterval = setInterval(() => {
                grid.style.opacity = (0.3 + Math.random() * 0.4).toString();
            }, 2000 + Math.random() * 3000);
            
            this.animationIntervals.push(pulseInterval);
        });
    }

    /* ========== BARRAS DE PROGRESSO ========== */
    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-value');
        
        progressBars.forEach(bar => {
            let width = parseInt(bar.style.width) || 50;
            let direction = 1;
            let targetWidth = width;
            
            // Definir um alvo aleatório inicial
            targetWidth = 30 + Math.random() * 40;
            direction = targetWidth > width ? 1 : -1;
            
            const progressInterval = setInterval(() => {
                // Mover em direção ao alvo
                width += direction * 0.5;
                bar.style.width = `${width}%`;
                
                // Verificar se alcançou o alvo
                if ((direction === 1 && width >= targetWidth) || 
                    (direction === -1 && width <= targetWidth)) {
                    // Definir novo alvo
                    targetWidth = 30 + Math.random() * 40;
                    direction = targetWidth > width ? 1 : -1;
                }
            }, 50);
            
            this.animationIntervals.push(progressInterval);
        });
    }

    /* ========== EFEITO DE BRILHO HOLOGRÁFICO ========== */
    initHologramGlow() {
        const holograms = document.querySelectorAll('.hologram');
        
        holograms.forEach(hologram => {
            const glowInterval = setInterval(() => {
                const intensity = 0.5 + Math.random() * 0.5;
                hologram.style.boxShadow = `0 0 ${intensity * 20}px ${intensity * 10}px rgba(0, 247, 255, ${intensity * 0.3})`;
            }, 2000);
            
            this.animationIntervals.push(glowInterval);
        });
    }

    /* ========== DESTRUIÇÃO/LIMPEZA ========== */
    destroy() {
        // Limpar todos os intervalos e timeouts
        this.animationIntervals.forEach(interval => clearInterval(interval));
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        
        // Limpar scanline específico
        if (this.scanlineInterval) clearInterval(this.scanlineInterval);
        
        // Limpar grades específicas
        this.gridIntervals.forEach(interval => clearInterval(interval));
        
        console.log('Holographic Effects destroyed');
    }
}

/* ========== INICIALIZAÇÃO ========== */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há elementos holográficos na página
    const holographicElements = document.querySelectorAll('.holographic-card, .holographic-btn, .hologram');
    
    if (holographicElements.length > 0) {
        window.holographicEffects = new HolographicEffects();
    }
});

// Limpeza ao sair da página
window.addEventListener('beforeunload', () => {
    if (window.holographicEffects) {
        window.holographicEffects.destroy();
    }
});

// Exportar para uso em outros arquivos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HolographicEffects;
}
