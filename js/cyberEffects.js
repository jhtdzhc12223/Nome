// cyberEffects.js - Complete Cyberpunk Effects Manager

class CyberEffectsManager {
    constructor() {
        this.effects = {
            crackedGlass: null,
            blackHole: null,
            terminal: null
        };
        this.initEffects();
    }

    /* ========== MAIN INITIALIZATION ========== */
    initEffects() {
        // Initialize visual effects
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

        // Initialize interactive effects
        this.initInteractiveEffects();
        this.initTerminalControls();
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

    /* ========== INTERACTIVE EFFECTS ========== */
    initInteractiveEffects() {
        // Debounce for performance optimization
        const debounce = (func, wait = 20, immediate = true) => {
            let timeout;
            return function() {
                const context = this, args = arguments;
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

        // 1. Glitch effect on elements
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(el => {
            const handleGlitch = debounce(function() {
                this.style.textShadow = `
                    0.05em 0 0 rgba(255, 0, 170, 0.75),
                    -0.025em -0.05em 0 rgba(0, 247, 255, 0.75),
                    0.025em 0.05em 0 rgba(0, 255, 136, 0.75)
                `;
            }, 100);

            el.addEventListener('mouseenter', handleGlitch);
            el.addEventListener('mouseleave', function() {
                this.style.textShadow = 'none';
            });
        });

        // 2. Holographic card effect (optimized)
        const holographicCards = document.querySelectorAll('.holographic-card');
        
        const handleCardMove = function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = this.offsetWidth / 2;
            const centerY = this.offsetHeight / 2;
            const angleX = (centerY - y) / 10;
            const angleY = (x - centerX) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        };

        const debouncedCardMove = debounce(handleCardMove, 10);
        
        holographicCards.forEach(card => {
            card.addEventListener('mousemove', debouncedCardMove);
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });

        // 3. Typewriter effect (with motion preference check)
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
        }

        // 4. Skill bars animation (intersection observer)
        const animateSkillBars = () => {
            const skillBars = document.querySelectorAll('.skill-level');
            skillBars.forEach(bar => {
                const level = bar.dataset.level || bar.style.width.replace('%', '');
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = `${level}%`;
                }, 500);
            });
        };

        const skillSection = document.querySelector('.cyber-skills');
        if (skillSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(skillSection);
                }
            }, { threshold: 0.1 });
            observer.observe(skillSection);
        }
    }

    /* ========== TERMINAL CONTROLS ========== */
    initTerminalControls() {
        // Black hole terminal command
        const terminalInput = document.querySelector('.terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && terminalInput.value.trim().toLowerCase() === 'blackhole') {
                    document.body.classList.toggle('blackhole-active');
                    const output = document.querySelector('.terminal-output');
                    if (output) {
                        output.innerHTML += `<div>> blackhole</div><div>Efeito de buraco negro ${
                            document.body.classList.contains('blackhole-active') ? 'ativado' : 'desativado'
                        }</div>`;
                    }
                    terminalInput.value = '';
                }
            });
        }

        // Terminal window controls
        document.querySelectorAll('.terminal-btn.red').forEach(btn => {
            // Click handler
            btn.addEventListener('click', function() {
                this.style.transform = 'scale(1.2)';
                setTimeout(() => this.style.transform = 'scale(1)', 200);
                
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

            // Keyboard accessibility
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    btn.click();
                }
            });
        });
    }

    /* ========== CLEANUP ========== */
    destroy() {
        if (this.effects.crackedGlass) this.effects.crackedGlass.destroy();
        if (this.effects.blackHole) this.effects.blackHole.destroy();
        
        // Remove all event listeners
        document.querySelectorAll('.glitch').forEach(el => {
            el.removeEventListener('mouseenter');
            el.removeEventListener('mouseleave');
        });
        
        document.querySelectorAll('.holographic-card').forEach(card => {
            card.removeEventListener('mousemove');
            card.removeEventListener('mouseleave');
        });
        
        document.querySelectorAll('.terminal-btn.red').forEach(btn => {
            btn.removeEventListener('click');
            btn.removeEventListener('keydown');
        });
    }
}

/* ========== CRACKED GLASS EFFECT ========== */
class CrackedGlassEffect {
    constructor() {
        this.triggers = [];
        this.overlay = null;
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
        this.resizeHandler = null;
        
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

/* ========== INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', () => {
    // Add JS-enabled class for fallbacks
    document.documentElement.classList.add('js-enabled');
    
    // Initialize all effects
    window.cyberEffects = new CyberEffectsManager();
});

// Cleanup when navigating away (for SPA compatibility)
window.addEventListener('beforeunload', () => {
    if (window.cyberEffects) {
        window.cyberEffects.destroy();
    }
});
