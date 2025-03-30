// Efeitos específicos para a página holográfica
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de hover holográfico
    const holographicItems = document.querySelectorAll('.holographic-card, .menu-item');
    
    holographicItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
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
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // Efeito de scanline
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
        setInterval(animateScanline, 3000);
    }
    
    // Efeito de grid animado
    const grids = document.querySelectorAll('.hexagon-grid, .preview-grid');
    
    grids.forEach(grid => {
        let posX = 0;
        let posY = 0;
        
        setInterval(() => {
            posX = (posX + 1) % 60;
            posY = (posY + 1) % 60;
            
            grid.style.backgroundPosition = `${posX}px ${posY}px`;
        }, 100);
    });
    
    // Ativar animação da barra de progresso
    const progressBars = document.querySelectorAll('.progress-value');
    
    progressBars.forEach(bar => {
        let width = parseInt(bar.style.width);
        let direction = 1;
        
        setInterval(() => {
            width += direction * 2;
            
            if (width >= 70) direction = -1;
            if (width <= 30) direction = 1;
            
            bar.style.width = `${width}%`;
        }, 200);
    });
});
