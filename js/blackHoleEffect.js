// cyberEffects.js - Combined Effects Manager
class CyberEffectsManager {
    constructor() {
        this.initEffects();
    }
    
    initEffects() {
        this.initBlackHole();
        this.initCrackedGlass();
    }
    
    /* ======= BLACK HOLE EFFECT ======= */
    initBlackHole() {
        const container = document.getElementById('blackhole-bg');
        if (!container || !window.THREE) return;
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        
        // Black hole creation
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });
        
        const blackHole = new THREE.Mesh(geometry, material);
        scene.add(blackHole);
        camera.position.z = 5;
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            blackHole.rotation.x += 0.005;
            blackHole.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Responsive handling
        const handleResize = () => {
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup reference
        this.blackHoleCleanup = () => {
            window.removeEventListener('resize', handleResize);
            container.removeChild(renderer.domElement);
        };
    }
    
    /* ======= CRACKED GLASS EFFECT ======= */
    initCrackedGlass() {
        const overlay = document.getElementById('cracked-glass-overlay');
        if (!overlay) return;
        
        this.generateCracks(overlay);
        
        const triggers = document.querySelectorAll('[data-crack-trigger]');
        if (triggers.length === 0) return;
        
        // Event handlers
        const mouseEnterHandler = (e) => this.handleCrackEnter(e, overlay);
        const mouseLeaveHandler = () => this.handleCrackLeave(overlay);
        
        triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', mouseEnterHandler);
            trigger.addEventListener('mouseleave', mouseLeaveHandler);
        });
        
        // Cleanup reference
        this.crackedGlassCleanup = () => {
            triggers.forEach(trigger => {
                trigger.removeEventListener('mouseenter', mouseEnterHandler);
                trigger.removeEventListener('mouseleave', mouseLeaveHandler);
            });
        };
    }
    
    generateCracks(overlay) {
        let cracksSVG = '';
        const crackCount = 15;
        const baseOpacity = 0.3;
        const opacityVariation = 0.4;
        const baseWidth = 0.3;
        const widthVariation = 0.7;
        
        for (let i = 0; i < crackCount; i++) {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = x1 + (Math.random() * 40 - 20);
            const y2 = y1 + (Math.random() * 40 - 20);
            
            cracksSVG += `
                <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                     stroke="rgba(0, 247, 255, ${baseOpacity + Math.random() * opacityVariation})" 
                     stroke-width="${baseWidth + Math.random() * widthVariation}" 
                     stroke-linecap="round"/>
            `;
        }
        
        overlay.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">${cracksSVG}</svg>')`;
    }
    
    handleCrackEnter(e, overlay) {
        const rect = e.currentTarget.getBoundingClientRect();
        overlay.style.backgroundPosition = `${rect.left}px ${rect.top}px`;
        overlay.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        overlay.style.opacity = '0.8';
    }
    
    handleCrackLeave(overlay) {
        overlay.style.opacity = '0';
    }
    
    /* ======= CLEANUP ======= */
    destroy() {
        if (this.blackHoleCleanup) this.blackHoleCleanup();
        if (this.crackedGlassCleanup) this.crackedGlassCleanup();
    }
}

// Initialize when DOM is ready and Three.js is loaded
const initCyberEffects = () => {
    // Check if Three.js is already loaded or wait for it
    if (window.THREE) {
        new CyberEffectsManager();
    } else {
        const checkThreeJS = setInterval(() => {
            if (window.THREE) {
                clearInterval(checkThreeJS);
                new CyberEffectsManager();
            }
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', initCyberEffects);
