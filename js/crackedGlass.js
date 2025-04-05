// cyberEffects.js - Combined Visual Effects Manager

class CyberEffectsManager {
    constructor() {
        this.effects = {
            crackedGlass: null,
            blackHole: null
        };
        this.initEffects();
    }

    /* ========== INITIALIZATION ========== */
    initEffects() {
        if (document.getElementById('cracked-glass-overlay')) {
            this.effects.crackedGlass = new CrackedGlassEffect();
        }
        
        if (document.getElementById('blackhole-bg') && window.THREE) {
            this.effects.blackHole = new BlackHoleEffect();
        } else if (document.getElementById('blackhole-bg')) {
            this.loadThreeJS().then(() => {
                this.effects.blackHole = new BlackHoleEffect();
            });
        }
    }

    /* ========== THREE.JS LOADER ========== */
    loadThreeJS() {
        return new Promise((resolve) => {
            if (window.THREE) return resolve();
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    /* ========== EFFECTS CLEANUP ========== */
    destroy() {
        if (this.effects.crackedGlass) {
            this.effects.crackedGlass.destroy();
        }
        if (this.effects.blackHole) {
            this.effects.blackHole.destroy();
        }
    }
}

/* ========== CRACKED GLASS EFFECT ========== */
class CrackedGlassEffect {
    constructor() {
        this.triggers = [];
        this.initCrackedGlass();
    }

    initCrackedGlass() {
        this.overlay = document.getElementById('cracked-glass-overlay');
        if (!this.overlay) return;

        this.generateCracks();
        this.setupEventListeners();
    }

    generateCracks() {
        const crackCount = 15;
        let cracksSVG = '';
        
        for (let i = 0; i < crackCount; i++) {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = x1 + (Math.random() * 40 - 20);
            const y2 = y1 + (Math.random() * 40 - 20);
            
            cracksSVG += `
                <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                     stroke="rgba(0, 247, 255, ${0.3 + Math.random() * 0.4})" 
                     stroke-width="${0.3 + Math.random() * 0.7}" 
                     stroke-linecap="round"/>
            `;
        }

        this.overlay.style.backgroundImage = 
            `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" 
              width="100" height="100" viewBox="0 0 100 100">${cracksSVG}</svg>')`;
    }

    setupEventListeners() {
        this.triggers = document.querySelectorAll('[data-crack-trigger]');
        
        this.triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            trigger.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
    }

    handleMouseEnter(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        this.overlay.style.backgroundPosition = `${rect.left}px ${rect.top}px`;
        this.overlay.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        this.overlay.style.opacity = '0.8';
    }

    handleMouseLeave() {
        this.overlay.style.opacity = '0';
    }

    destroy() {
        this.triggers.forEach(trigger => {
            trigger.removeEventListener('mouseenter', this.handleMouseEnter);
            trigger.removeEventListener('mouseleave', this.handleMouseLeave);
        });
    }
}

/* ========== BLACK HOLE EFFECT ========== */
class BlackHoleEffect {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.blackHole = null;
        this.animationId = null;
        
        this.initBlackHole();
    }

    initBlackHole() {
        this.container = document.getElementById('blackhole-bg');
        if (!this.container) return;

        this.setupScene();
        this.createBlackHole();
        this.startAnimation();
        this.setupResizeListener();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
    }

    createBlackHole() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });
        
        this.blackHole = new THREE.Mesh(geometry, material);
        this.scene.add(this.blackHole);
    }

    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            this.blackHole.rotation.x += 0.005;
            this.blackHole.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupResizeListener() {
        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        window.removeEventListener('resize', this.resizeHandler);
        
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

/* ========== INITIALIZE EFFECTS ========== */
document.addEventListener('DOMContentLoaded', () => {
    window.cyberEffects = new CyberEffectsManager();
});

// Cleanup when navigating away (for SPA compatibility)
window.addEventListener('beforeunload', () => {
    if (window.cyberEffects) {
        window.cyberEffects.destroy();
    }
});
