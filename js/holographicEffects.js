// Efeitos específicos para a página holográfica
document.addEventListener('DOMContentLoaded', function() {
    // Limpar intervalos quando sair da página
    const animationIntervals = [];
    const animationTimeouts = [];
    
    // Debounce para otimização
    function debounce(func, wait = 10) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 1. Efeito de hover holográfico (otimizado)
    const holographicItems = document.querySelectorAll('.holographic-card, .menu-item');
    
    const handleHolographicMove = debounce(function(e) {
        const x = e.clientX - this.getBoundingClientRect().left;
        const y = e.clientY - this.getBoundingClientRect().top;
        
        const centerX = this.offsetWidth / 2;
        const centerY = this.offsetHeight / 2;
        
        const angleX = (centerY - y) / 20;
        const angleY = (x - centerX) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        
        // Efeito de luz
        const lightPosX = (x / this.offsetWidth) * 100;
        const lightPosY = (y / this.offsetHeight) * 100;
        
        this.style.setProperty('--light-pos-x', `${lightPosX}%`);
        this.style.setProperty('--light-pos-y', `${lightPosY}%`);
    }, 10);
    
    holographicItems.forEach(item => {
        item.addEventListener('mousemove', handleHolographicMove);
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // 2. Efeito de scanline (otimizado)
    const scanline = document.querySelector('.nav-scanline');
    
    if (scanline) {
        function animateScanline() {
            scanline.style.top = '0';
            scanline.style.transition = 'none';
            
            setTimeout(() => {
                scanline.style.transition = 'top 3s linear';
                scanline.style.top = '100%';
            }, 10);
        }
        
        animateScanline();
        const scanlineInterval = setInterval(animateScanline, 3000);
        animationIntervals.push(scanlineInterval);
    }
    
    // 3. Efeito de grid animado (otimizado)
    const grids = document.querySelectorAll('.hexagon-grid, .preview-grid');
    
    grids.forEach(grid => {
        let posX = 0;
        let posY = 0;
        
        const gridInterval = setInterval(() => {
            posX = (posX + 1) % 60;
            posY = (posY + 1) % 60;
            
            grid.style.backgroundPosition = `${posX}px ${posY}px`;
        }, 100);
        
        animationIntervals.push(gridInterval);
    });
    
    // 4. Ativar animação da barra de progresso (otimizada)
    const progressBars = document.querySelectorAll('.progress-value');
    
    progressBars.forEach(bar => {
        let width = parseInt(bar.style.width);
        let direction = 1;
        
        const progressInterval = setInterval(() => {
            width += direction * 2;
            
            if (width >= 70) direction = -1;
            if (width <= 30) direction = 1;
            
            bar.style.width = `${width}%`;
        }, 200);
        
        animationIntervals.push(progressInterval);
    });

    // Limpar animações ao sair da página
    window.addEventListener('beforeunload', () => {
        animationIntervals.forEach(interval => clearInterval(interval));
        animationTimeouts.forEach(timeout => clearTimeout(timeout));
    });
});

// Fallback para quando JS estiver desabilitado
document.documentElement.classList.add('js-enabled');
