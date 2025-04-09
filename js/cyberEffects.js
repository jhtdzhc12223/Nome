// cyberEffects.js - Gerenciador Completo de Efeitos Cyberpunk

class CyberEffectsManager {
    constructor() {
        this.effects = {
            crackedGlass: null,
            blackHole: null,
            particles: null,
            interactive: null
        };
        this.initEffects();
    }

    /* ========== INICIALIZAÇÃO PRINCIPAL ========== */
    initEffects() {
        // Verificar e carregar dependências
        this.loadDependencies().then(() => {
            // Inicializar efeitos visuais
            if (document.getElementById('cracked-glass-overlay')) {
                this.effects.crackedGlass = new CrackedGlassEffect();
            }
            
            if (document.getElementById('blackhole-bg')) {
                this.effects.blackHole = new BlackHoleEffect();
            }
            
            if (document.getElementById('cyber-particles')) {
                this.effects.particles = new ParticlesEffect();
            }
            
            // Inicializar efeitos interativos
            this.effects.interactive = new InteractiveEffects();
            
            // Inicializar controles do terminal
            this.initTerminalControls();
            
            // Ativar animações quando visíveis
            this.initIntersectionObservers();
            
            console.log('Cyber Effects Manager initialized with all effects');
        }).catch(error => {
            console.error('Error loading dependencies:', error);
        });
    }

    /* ========== CARREGAMENTO DE DEPENDÊNCIAS ========== */
    loadDependencies() {
        const promises = [];
        
        // Carregar Three.js se necessário
        if (!window.THREE && document.getElementById('blackhole-bg')) {
            promises.push(this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'));
        }
        
        // Carregar Vanta.js se necessário
        if (!window.VANTA && document.getElementById('cyber-particles')) {
            promises.push(this.loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js'));
        }
        
        // Carregar Chart.js se necessário
        if (!window.Chart && document.getElementById('radarChart')) {
            promises.push(this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js'));
        }
        
        // Carregar GSAP se necessário
        if (!window.gsap) {
            promises.push(this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js'));
        }
        
        return Promise.all(promises);
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /* ========== CONTROLES DO TERMINAL ========== */
    initTerminalControls() {
        // Comando blackhole no terminal
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

        // Controles da janela do terminal
        document.querySelectorAll('.terminal-btn.red').forEach(btn => {
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

            // Acessibilidade por teclado
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    btn.click();
                }
            });
        });
    }

    /* ========== OBSERVADORES DE INTERSEÇÃO ========== */
    initIntersectionObservers() {
        // Animar elementos quando ficam visíveis
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.setAttribute('data-animate', 'in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(animateOnScroll, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });

        // Animar barras de habilidades
        const skillSection = document.querySelector('.cyber-skills');
        if (skillSection) {
            const skillObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.animateSkillBars();
                    skillObserver.unobserve(skillSection);
                }
            }, { threshold: 0.1 });
            
            skillObserver.observe(skillSection);
        }
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(bar => {
            const level = bar.dataset.level || bar.style.width.replace('%', '');
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = `${level}%`;
            }, 500);
        });
    }

    /* ========== DESTRUIÇÃO/LIMPEZA ========== */
    destroy() {
        if (this.effects.crackedGlass) this.effects.crackedGlass.destroy();
        if (this.effects.blackHole) this.effects.blackHole.destroy();
        if (this.effects.particles) this.effects.particles.destroy();
        if (this.effects.interactive) this.effects.interactive.destroy();
        
        console.log('Cyber Effects Manager destroyed');
    }
}

/* ========== EFEITO DE VIDRO RACHADO ========== */
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
        const crackCount = 25; // Aumentado de 15 para 25
        let cracksSVG = '';
        
        // Adicionar rachaduras mais complexas
        for (let i = 0; i < crackCount; i++) {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = x1 + (Math.random() * 60 - 30); // Aumentada variação
            const y2 = y1 + (Math.random() * 60 - 30);
            
            // Adicionar múltiplos segmentos para cada rachadura
            cracksSVG += `
                <path d="M${x1},${y1} 
                        C${x1 + (Math.random() * 20 - 10)},${y1 + (Math.random() * 20 - 10)} 
                        ${x2 + (Math.random() * 20 - 10)},${y2 + (Math.random() * 20 - 10)} 
                        ${x2},${y2}"
                     stroke="rgba(0, 247, 255, ${0.3 + Math.random() * 0.4})" 
                     stroke-width="${0.3 + Math.random() * 0.7}" 
                     stroke-linecap="round"
                     fill="none"/>
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
            trigger.addEventListener('mousemove', this.handleMouseMove.bind(this));
        });
    }

    handleMouseEnter(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        this.overlay.style.backgroundPosition = `${rect.left}px ${rect.top}px`;
        this.overlay.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        this.overlay.style.opacity = '0.8';
        this.overlay.style.filter = 'brightness(1.2)';
    }

    handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Efeito de deslocamento baseado na posição do mouse
        const offsetX = (x / rect.width - 0.5) * 20;
        const offsetY = (y / rect.height - 0.5) * 20;
        
        this.overlay.style.backgroundPosition = 
            `${rect.left - offsetX}px ${rect.top - offsetY}px`;
    }

    handleMouseLeave() {
        this.overlay.style.opacity = '0';
        this.overlay.style.filter = 'brightness(1)';
    }

    destroy() {
        this.triggers.forEach(trigger => {
            trigger.removeEventListener('mouseenter', this.handleMouseEnter);
            trigger.removeEventListener('mouseleave', this.handleMouseLeave);
            trigger.removeEventListener('mousemove', this.handleMouseMove);
        });
    }
}

/* ========== EFEITO DE BURACO NEGRO ========== */
class BlackHoleEffect {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.blackHole = null;
        this.animationId = null;
        this.resizeHandler = null;
        this.particles = [];
        this.particleCount = 500; // Aumentado de 300 para 500
        
        this.initBlackHole();
    }

    initBlackHole() {
        this.container = document.getElementById('blackhole-bg');
        if (!this.container || !window.THREE) return;

        this.setupScene();
        this.createBlackHole();
        this.createParticles();
        this.startAnimation();
        this.setupResizeListener();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        
        // Configuração de câmera aprimorada
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // Renderizador aprimorado
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Adicionar luzes para melhor realismo
        const ambientLight = new THREE.AmbientLight(0x00aaff, 0.1);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x00ffff, 0.5, 50);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }

    createBlackHole() {
        // Geometria mais complexa
        const geometry = new THREE.SphereGeometry(1, 128, 128);
        
        // Material aprimorado com textura de distorção
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            emissive: 0x0000ff,
            emissiveIntensity: 0.1,
            specular: 0x00ffff,
            shininess: 50,
            transparent: true,
            opacity: 0.9,
            wireframe: false
        });
        
        this.blackHole = new THREE.Mesh(geometry, material);
        this.scene.add(this.blackHole);
        
        // Adicionar anel ao redor do buraco negro
        const ringGeometry = new THREE.RingGeometry(1.5, 2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
        this.ring.rotation.x = Math.PI / 2;
        this.scene.add(this.ring);
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Posições em uma esfera ao redor do buraco negro
            const radius = 2 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Cores aleatórias em tons azulados
            colors[i * 3] = 0.2 + Math.random() * 0.8; // R
            colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
            
            // Tamanhos variados
            sizes[i] = 0.1 + Math.random() * 0.5;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    startAnimation() {
        const clock = new THREE.Clock();
        
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();
            
            // Animar buraco negro
            this.blackHole.rotation.x += 0.002;
            this.blackHole.rotation.y += 0.005;
            
            // Animar anel
            if (this.ring) {
                this.ring.rotation.z += 0.01;
                this.ring.scale.setScalar(1 + Math.sin(time) * 0.1);
            }
            
            // Animar partículas (espiral em direção ao buraco negro)
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < this.particleCount; i++) {
                const ix = i * 3;
                const iy = i * 3 + 1;
                const iz = i * 3 + 2;
                
                // Mover partículas em espiral
                positions[ix] *= 0.995;
                positions[iy] *= 0.995;
                positions[iz] *= 0.995;
                
                // Se a partícula chegou muito perto, reposicioná-la
                if (Math.abs(positions[ix]) < 0.1 && 
                    Math.abs(positions[iy]) < 0.1 && 
                    Math.abs(positions[iz]) < 0.1) {
                    const radius = 5 + Math.random() * 10;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    
                    positions[ix] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[iy] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[iz] = radius * Math.cos(phi);
                }
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
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
        
        // Limpar recursos da Three.js
        if (this.scene) {
            this.scene.traverse(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
        }
    }
}

/* ========== EFEITO DE PARTÍCULAS ========== */
class ParticlesEffect {
    constructor() {
        this.vantaEffect = null;
        this.initParticles();
    }

    initParticles() {
        if (!document.getElementById('cyber-particles') || !window.VANTA) return;
        
        this.vantaEffect = VANTA.NET({
            el: "#cyber-particles",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x7000ff,
            backgroundColor: 0x0a0a12,
            points: 15.00,
            maxDistance: 25.00,
            spacing: 15.00,
            showDots: false
        });
    }

    destroy() {
        if (this.vantaEffect) {
            this.vantaEffect.destroy();
        }
    }
}

/* ========== EFEITOS INTERATIVOS ========== */
class InteractiveEffects {
    constructor() {
        this.initInteractiveEffects();
    }

    initInteractiveEffects() {
        this.initGlitchEffects();
        this.initHolographicCards();
        this.initTypewriterEffects();
        this.initSkillBars();
        this.initNavigation();
    }

    /* ===== EFEITOS DE GLITCH ===== */
    initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(el => {
            // Efeito de hover
            el.addEventListener('mouseenter', () => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                
                el.style.animation = 'glitch 0.5s linear infinite';
                
                // Adicionar elemento de glitch
                if (!el.querySelector('.glitch-clone')) {
                    const clone = el.cloneNode(true);
                    clone.classList.add('glitch-clone');
                    clone.style.position = 'absolute';
                    clone.style.top = '0';
                    clone.style.left = '0';
                    clone.style.color = 'var(--cyber-pink)';
                    clone.style.opacity = '0.7';
                    clone.style.animation = 'glitch 0.3s linear infinite';
                    el.style.position = 'relative';
                    el.appendChild(clone);
                }
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.animation = '';
                
                const clone = el.querySelector('.glitch-clone');
                if (clone) {
                    el.removeChild(clone);
                }
            });
        });
    }

    /* ===== CARDS HOLOGRÁFICOS ===== */
    initHolographicCards() {
        const cards = document.querySelectorAll('.holographic-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = card.offsetWidth / 2;
                const centerY = card.offsetHeight / 2;
                const angleX = (centerY - y) / 20;
                const angleY = (x - centerX) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
                
                // Efeito de luz
                const lightPosX = (x / card.offsetWidth) * 100;
                const lightPosY = (y / card.offsetHeight) * 100;
                
                card.style.setProperty('--light-pos-x', `${lightPosX}%`);
                card.style.setProperty('--light-pos-y', `${lightPosY}%`);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    /* ===== EFEITO DE MÁQUINA DE ESCREVER ===== */
    initTypewriterEffects() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
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
                    // Adicionar efeito de glitch após digitação
                    setTimeout(() => {
                        el.classList.add('glitch-active');
                    }, 500);
                }
            }, 100 + Math.random() * 50); // Variação de velocidade
        });
    }

    /* ===== BARRAS DE HABILIDADES ===== */
    initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        
        skillBars.forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                bar.style.boxShadow = '0 0 15px var(--cyber-blue)';
            });
            
            bar.addEventListener('mouseleave', () => {
                bar.style.boxShadow = 'none';
            });
        });
    }

    /* ===== NAVEGAÇÃO RESPONSIVA ===== */
    initNavigation() {
        const menuToggle = document.getElementById('cyberMenuToggle');
        const menu = document.getElementById('main-nav');
        
        if (menuToggle && menu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 
                    menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
                menu.classList.toggle('active');
            });
        }
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.cyber-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('active');
                }
            });
        });
    }

    destroy() {
        // Limpar todos os event listeners
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(el => {
            el.removeEventListener('mouseenter');
            el.removeEventListener('mouseleave');
        });
        
        const cards = document.querySelectorAll('.holographic-card');
        cards.forEach(card => {
            card.removeEventListener('mousemove');
            card.removeEventListener('mouseleave');
        });
        
        const menuToggle = document.getElementById('cyberMenuToggle');
        if (menuToggle) {
            menuToggle.removeEventListener('click');
        }
    }
}

/* ========== INICIALIZAÇÃO ========== */
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar classe para indicar que JS está habilitado
    document.documentElement.classList.add('js-enabled');
    
    // Inicializar todos os efeitos
    window.cyberEffects = new CyberEffectsManager();
});

// Limpeza ao sair da página (compatibilidade com SPAs)
window.addEventListener('beforeunload', () => {
    if (window.cyberEffects) {
        window.cyberEffects.destroy();
    }
});

// Exportar para uso em outros arquivos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CyberEffectsManager,
        CrackedGlassEffect,
        BlackHoleEffect,
        ParticlesEffect,
        InteractiveEffects
    };
}
