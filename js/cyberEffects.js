// cyberEffects.js - Gerenciador Completo de Efeitos Cyberpunk

class CyberEffectsManager {
    constructor() {
        this.effects = {
            crackedGlass: null,
            blackHole: null,
            terminal: null,
            particles: null,
            holograms: null,
            glitch: null,
            interactive: null
        };
        
        this.initEffects();
        this.initThemeToggle();
        this.initDynamicEffects();
    }

    /* ========== INICIALIZAÇÃO PRINCIPAL ========== */
    initEffects() {
        // Efeito de vidro quebrado
        if (document.getElementById('cracked-glass-overlay')) {
            this.effects.crackedGlass = new CrackedGlassEffect();
        }
        
        // Efeito de buraco negro (requer Three.js)
        if (document.getElementById('blackhole-bg')) {
            if (window.THREE) {
                this.effects.blackHole = new BlackHoleEffect();
            } else {
                this.loadThreeJS().then(() => {
                    this.effects.blackHole = new BlackHoleEffect();
                });
            }
        }
        
        // Efeitos de terminal
        this.effects.terminal = new TerminalEffects();
        
        // Efeitos de partículas
        this.effects.particles = new ParticleEffects();
        
        // Efeitos holográficos
        this.effects.holograms = new HologramEffects();
        
        // Efeitos de glitch
        this.effects.glitch = new GlitchEffects();
        
        // Efeitos interativos
        this.effects.interactive = new InteractiveEffects();
        
        // Inicializar controles do terminal
        this.initTerminalControls();
    }

    /* ========== CARREGAMENTO DE THREE.JS ========== */
    loadThreeJS() {
        return new Promise((resolve, reject) => {
            if (window.THREE) return resolve();
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /* ========== CONTROLES DE TEMA ========== */
    initThemeToggle() {
        const themeToggle = document.querySelector('[data-theme-toggle]');
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-cyber-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-cyber-theme', newTheme);
            localStorage.setItem('cyberTheme', newTheme);
            
            // Atualizar ícone do botão
            themeToggle.querySelector('.fa-moon').style.opacity = newTheme === 'dark' ? '1' : '0';
            themeToggle.querySelector('.fa-sun').style.opacity = newTheme === 'light' ? '1' : '0';
            
            // Disparar evento personalizado
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
        });
        
        // Carregar tema salvo
        const savedTheme = localStorage.getItem('cyberTheme') || 'dark';
        document.documentElement.setAttribute('data-cyber-theme', savedTheme);
    }

    /* ========== EFEITOS DINÂMICOS ========== */
    initDynamicEffects() {
        // Efeito de hover em cards
        this.initCardHoverEffects();
        
        // Efeito de digitação
        this.initTypewriterEffects();
        
        // Animações de scroll
        this.initScrollAnimations();
        
        // Efeitos de formulário
        this.initFormEffects();
    }

    /* ========== EFEITOS DE HOVER EM CARDS ========== */
    initCardHoverEffects() {
        const cards = document.querySelectorAll('.holographic-card, .project-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = card.offsetWidth / 2;
                const centerY = card.offsetHeight / 2;
                
                const angleX = (centerY - y) / 20;
                const angleY = (x - centerX) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
                
                // Atualizar posição das partículas
                const particles = card.querySelector('.card-particle');
                if (particles) {
                    particles.style.left = `${x}px`;
                    particles.style.top = `${y}px`;
                    particles.style.opacity = '0.5';
                    
                    setTimeout(() => {
                        particles.style.opacity = '0';
                    }, 300);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    /* ========== EFEITOS DE DIGITAÇÃO ========== */
    initTypewriterEffects() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const typewriters = document.querySelectorAll('.typewriter, [data-typewriter-effect]');
        
        typewriters.forEach(el => {
            const text = el.textContent;
            el.textContent = '';
            
            let i = 0;
            const typing = setInterval(() => {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    
                    // Remover cursor piscante após terminar
                    if (el.classList.contains('typewriter')) {
                        setTimeout(() => {
                            el.style.borderRight = 'none';
                        }, 1000);
                    }
                }
            }, 100);
        });
    }

    /* ========== ANIMAÇÕES DE SCROLL ========== */
    initScrollAnimations() {
        if (!window.gsap || !window.ScrollTrigger) return;
        
        // Animar seções ao aparecer
        gsap.utils.toArray('.cyber-section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out"
            });
        });
        
        // Animar cards de projeto
        gsap.utils.toArray('.cyber-project').forEach((project, i) => {
            gsap.from(project, {
                scrollTrigger: {
                    trigger: project,
                    start: "top 75%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: i * 0.1,
                ease: "back.out(1.2)"
            });
        });
        
        // Animar barras de habilidades
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(bar => {
            const level = bar.dataset.level || bar.style.width.replace('%', '');
            bar.style.width = '0';
            
            ScrollTrigger.create({
                trigger: bar,
                start: "top 80%",
                onEnter: () => {
                    bar.style.width = `${level}%`;
                }
            });
        });
    }

    /* ========== EFEITOS DE FORMULÁRIO ========== */
    initFormEffects() {
        const inputs = document.querySelectorAll('.cyber-input, .cyber-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const underline = input.nextElementSibling;
                if (underline && underline.classList.contains('input-underline')) {
                    underline.style.width = '100%';
                }
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    const underline = input.nextElementSibling;
                    if (underline && underline.classList.contains('input-underline')) {
                        underline.style.width = '0';
                    }
                }
            });
        });
    }

    /* ========== CONTROLES DE TERMINAL ========== */
    initTerminalControls() {
        // Comando blackhole
        const terminalInput = document.querySelector('.terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = terminalInput.value.trim().toLowerCase();
                    const output = document.querySelector('.terminal-output');
                    
                    if (command === 'blackhole') {
                        document.body.classList.toggle('blackhole-active');
                        
                        if (output) {
                            output.innerHTML += `
                                <div>> ${command}</div>
                                <div>Efeito de buraco negro ${document.body.classList.contains('blackhole-active') ? 'ativado' : 'desativado'}</div>
                                <div class="terminal-divider"></div>
                            `;
                        }
                    } else if (command === 'clear') {
                        if (output) output.innerHTML = '';
                    } else if (command) {
                        if (output) {
                            output.innerHTML += `
                                <div>> ${command}</div>
                                <div>Comando não reconhecido. Digite 'help' para lista de comandos.</div>
                                <div class="terminal-divider"></div>
                            `;
                        }
                    }
                    
                    terminalInput.value = '';
                }
            });
        }

        // Controles de janela do terminal
        document.querySelectorAll('[data-terminal-btn="close"]').forEach(btn => {
            btn.addEventListener('click', function() {
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
            });
        });
    }

    /* ========== DESTRUIÇÃO/LIMPEZA ========== */
    destroy() {
        if (this.effects.crackedGlass) this.effects.crackedGlass.destroy();
        if (this.effects.blackHole) this.effects.blackHole.destroy();
        if (this.effects.terminal) this.effects.terminal.destroy();
        if (this.effects.particles) this.effects.particles.destroy();
        if (this.effects.holograms) this.effects.holograms.destroy();
        if (this.effects.glitch) this.effects.glitch.destroy();
        if (this.effects.interactive) this.effects.interactive.destroy();
        
        // Remover todos os event listeners
        document.querySelectorAll('[data-theme-toggle]').forEach(el => {
            el.removeEventListener('click');
        });
        
        document.querySelectorAll('.holographic-card, .project-card').forEach(card => {
            card.removeEventListener('mousemove');
            card.removeEventListener('mouseleave');
        });
        
        document.querySelectorAll('[data-terminal-btn]').forEach(btn => {
            btn.removeEventListener('click');
        });
        
        if (window.ScrollTrigger) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }
}

/* ========== EFEITO DE VIDRO QUEBRADO ========== */
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
        const crackCount = 20;
        let cracksSVG = '';
        
        for (let i = 0; i < crackCount; i++) {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = x1 + (Math.random() * 60 - 30);
            const y2 = y1 + (Math.random() * 60 - 30);
            
            cracksSVG += `
                <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                     stroke="rgba(0, 247, 255, ${0.3 + Math.random() * 0.4})" 
                     stroke-width="${0.3 + Math.random() * 0.7}" 
                     stroke-linecap="round"/>
            `;
            
            // Adicionar pequenas rachaduras secundárias
            if (Math.random() > 0.7) {
                const x3 = x1 + (Math.random() * 20 - 10);
                const y3 = y1 + (Math.random() * 20 - 10);
                cracksSVG += `
                    <line x1="${x1}" y1="${y1}" x2="${x3}" y2="${y3}" 
                         stroke="rgba(0, 247, 255, ${0.2 + Math.random() * 0.3})" 
                         stroke-width="${0.2 + Math.random() * 0.3}" 
                         stroke-linecap="round"/>
                `;
            }
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
        
        // Adicionar efeito de pulso
        this.overlay.style.animation = 'crackPulse 2s infinite';
    }

    handleMouseLeave() {
        this.overlay.style.opacity = '0';
        this.overlay.style.animation = 'none';
    }

    destroy() {
        this.triggers.forEach(trigger => {
            trigger.removeEventListener('mouseenter', this.handleMouseEnter);
            trigger.removeEventListener('mouseleave', this.handleMouseLeave);
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
        this.particles = null;
        
        this.initBlackHole();
    }

    initBlackHole() {
        this.container = document.getElementById('blackhole-bg');
        if (!this.container) return;

        this.setupScene();
        this.createBlackHole();
        this.createParticles();
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
        
        // Adicionar luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // Adicionar luz direcional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    createBlackHole() {
        // Geometria mais complexa para o buraco negro
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Material com textura de distorção
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            emissive: 0x000000,
            specular: 0x111111,
            shininess: 30,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });
        
        this.blackHole = new THREE.Mesh(geometry, material);
        this.scene.add(this.blackHole);
        
        // Adicionar anel ao redor do buraco negro
        const ringGeometry = new THREE.RingGeometry(1.2, 1.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x7000ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
        this.ring.rotation.x = Math.PI / 2;
        this.scene.add(this.ring);
    }

    createParticles() {
        const particleCount = 500;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Posições aleatórias em uma esfera
            const radius = 2 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Cores aleatórias em tons de roxo/azul
            colors[i * 3] = 0.5 + Math.random() * 0.5; // R
            colors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // G
            colors[i * 3 + 2] = 0.7 + Math.random() * 0.3; // B
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particles);
    }

    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            
            // Animar buraco negro
            this.blackHole.rotation.x += 0.005;
            this.blackHole.rotation.y += 0.01;
            
            // Animar anel
            this.ring.rotation.z += 0.01;
            
            // Animar partículas (espiral em direção ao buraco negro)
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const dx = -positions[i] * 0.01;
                const dy = -positions[i + 1] * 0.01;
                const dz = -positions[i + 2] * 0.01;
                
                positions[i] += dx;
                positions[i + 1] += dy;
                positions[i + 2] += dz;
                
                // Se a partícula chegar muito perto do centro, reposicione-a
                if (Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2) < 0.5) {
                    const radius = 2 + Math.random() * 3;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    
                    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[i + 2] = radius * Math.cos(phi);
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

/* ========== EFEITOS DE TERMINAL ========== */
class TerminalEffects {
    constructor() {
        this.initTerminalEffects();
    }

    initTerminalEffects() {
        // Efeito de cursor piscante
        this.initCursorBlink();
        
        // Efeito de ruído no terminal
        this.initTerminalNoise();
        
        // Efeito de digitação nos comandos
        this.initCommandTyping();
    }

    initCursorBlink() {
        const cursors = document.querySelectorAll('.cursor');
        if (cursors.length === 0) return;
        
        cursors.forEach(cursor => {
            setInterval(() => {
                cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
            }, 500);
        });
    }

    initTerminalNoise() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const terminals = document.querySelectorAll('.cyber-terminal');
        if (terminals.length === 0) return;
        
        terminals.forEach(terminal => {
            setInterval(() => {
                const noise = document.createElement('div');
                noise.className = 'terminal-noise';
                noise.style.position = 'absolute';
                noise.style.top = `${Math.random() * 100}%`;
                noise.style.left = '0';
                noise.style.width = '100%';
                noise.style.height = '1px';
                noise.style.background = `rgba(0, 247, 255, ${Math.random() * 0.1})`;
                noise.style.pointerEvents = 'none';
                
                terminal.appendChild(noise);
                
                setTimeout(() => {
                    noise.remove();
                }, 1000);
            }, 3000);
        });
    }

    initCommandTyping() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const commands = document.querySelectorAll('.command');
        if (commands.length === 0) return;
        
        commands.forEach(command => {
            const originalText = command.textContent;
            command.textContent = '';
            
            let i = 0;
            const typing = setInterval(() => {
                if (i < originalText.length) {
                    command.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 50);
        });
    }
}

/* ========== EFEITOS DE PARTÍCULAS ========== */
class ParticleEffects {
    constructor() {
        this.initParticleEffects();
    }

    initParticleEffects() {
        // Efeito de partículas nos cards
        this.initCardParticles();
        
        // Efeito de partículas nas barras de habilidades
        this.initSkillBarParticles();
    }

    initCardParticles() {
        const cards = document.querySelectorAll('[data-crack-trigger]');
        if (cards.length === 0) return;
        
        cards.forEach(card => {
            const particle = document.createElement('div');
            particle.className = 'card-particle';
            card.appendChild(particle);
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = '0.5';
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                }, 300);
            });
        });
    }

    initSkillBarParticles() {
        const skillBars = document.querySelectorAll('.skill-bar');
        if (skillBars.length === 0) return;
        
        skillBars.forEach(bar => {
            setInterval(() => {
                if (Math.random() > 0.7) {
                    const particle = document.createElement('div');
                    particle.className = 'skill-particle';
                    particle.style.position = 'absolute';
                    particle.style.width = '2px';
                    particle.style.height = '2px';
                    particle.style.background = 'white';
                    particle.style.borderRadius = '50%';
                    particle.style.opacity = '0.5';
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = '0';
                    particle.style.pointerEvents = 'none';
                    
                    bar.appendChild(particle);
                    
                    // Animação da partícula
                    let pos = 0;
                    const animate = () => {
                        pos += 0.5;
                        particle.style.top = `${pos}px`;
                        
                        if (pos < bar.offsetHeight) {
                            requestAnimationFrame(animate);
                        } else {
                            particle.remove();
                        }
                    };
                    
                    requestAnimationFrame(animate);
                }
            }, 100);
        });
    }
}

/* ========== EFEITOS HOLOGRÁFICOS ========== */
class HologramEffects {
    constructor() {
        this.initHologramEffects();
    }

    initHologramEffects() {
        // Efeito de grade holográfica
        this.initHologramGrids();
        
        // Efeito de scanline
        this.initScanlines();
        
        // Efeito de hover holográfico
        this.initHologramHover();
    }

    initHologramGrids() {
        const holograms = document.querySelectorAll('.hologram-container, .holographic-card');
        if (holograms.length === 0) return;
        
        holograms.forEach(hologram => {
            const grid = document.createElement('div');
            grid.className = 'hologram-grid-effect';
            grid.style.position = 'absolute';
            grid.style.top = '0';
            grid.style.left = '0';
            grid.style.width = '100%';
            grid.style.height = '100%';
            grid.style.background = 
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="rgba(0,247,255,0.1)" stroke-width="1"/></svg>\')';
            grid.style.backgroundSize = '50px 50px';
            grid.style.opacity = '0.5';
            grid.style.pointerEvents = 'none';
            grid.style.animation = 'gridMove 20s linear infinite';
            
            hologram.appendChild(grid);
        });
    }

    initScanlines() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const containers = document.querySelectorAll('.hologram-container, .cyber-terminal');
        if (containers.length === 0) return;
        
        containers.forEach(container => {
            const scanline = document.createElement('div');
            scanline.className = 'hologram-scanline';
            scanline.style.position = 'absolute';
            scanline.style.top = '0';
            scanline.style.left = '0';
            scanline.style.width = '100%';
            scanline.style.height = '1px';
            scanline.style.background = 'var(--cyber-blue)';
            scanline.style.boxShadow = '0 0 5px var(--cyber-blue)';
            scanline.style.opacity = '0.3';
            scanline.style.animation = 'scanline 3s linear infinite';
            scanline.style.pointerEvents = 'none';
            
            container.appendChild(scanline);
        });
    }

    initHologramHover() {
        const holograms = document.querySelectorAll('.holographic');
        if (holograms.length === 0) return;
        
        holograms.forEach(hologram => {
            hologram.addEventListener('mousemove', (e) => {
                const rect = hologram.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = hologram.offsetWidth / 2;
                const centerY = hologram.offsetHeight / 2;
                
                const angleX = (centerY - y) / 20;
                const angleY = (x - centerX) / 20;
                
                hologram.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
                
                // Atualizar efeito de luz
                hologram.style.setProperty('--light-pos-x', `${x}px`);
                hologram.style.setProperty('--light-pos-y', `${y}px`);
            });
            
            hologram.addEventListener('mouseleave', () => {
                hologram.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }
}

/* ========== EFEITOS DE GLITCH ========== */
class GlitchEffects {
    constructor() {
        this.initGlitchEffects();
    }

    initGlitchEffects() {
        // Efeito de glitch em elementos
        this.initElementGlitch();
        
        // Efeito de glitch em texto
        this.initTextGlitch();
        
        // Efeito de glitch em imagens
        this.initImageGlitch();
    }

    initElementGlitch() {
        const glitchElements = document.querySelectorAll('.glitch');
        if (glitchElements.length === 0) return;
        
        glitchElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.animation = 'glitch 0.5s linear infinite';
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.animation = 'none';
            });
        });
    }

    initTextGlitch() {
        const glitchTexts = document.querySelectorAll('[data-text]');
        if (glitchTexts.length === 0) return;
        
        glitchTexts.forEach(text => {
            // Criar camadas de glitch
            const glitchContainer = document.createElement('div');
            glitchContainer.style.position = 'relative';
            glitchContainer.style.display = 'inline-block';
            
            text.parentNode.insertBefore(glitchContainer, text);
            glitchContainer.appendChild(text);
            
            // Criar camadas de glitch
            for (let i = 0; i < 2; i++) {
                const glitchLayer = document.createElement('span');
                glitchLayer.textContent = text.dataset.text;
                glitchLayer.style.position = 'absolute';
                glitchLayer.style.top = '0';
                glitchLayer.style.left = '0';
                glitchLayer.style.width = '100%';
                glitchLayer.style.height = '100%';
                glitchLayer.style.opacity = '0';
                glitchLayer.style.pointerEvents = 'none';
                
                if (i === 0) {
                    glitchLayer.style.color = 'var(--cyber-pink)';
                    glitchLayer.style.animation = 'glitch-effect 3s infinite';
                    glitchLayer.style.clipPath = 'polygon(0 0, 100% 0, 100% 45%, 0 45%)';
                } else {
                    glitchLayer.style.color = 'var(--cyber-blue)';
                    glitchLayer.style.animation = 'glitch-effect 2s infinite reverse';
                    glitchLayer.style.clipPath = 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)';
                }
                
                glitchContainer.appendChild(glitchLayer);
            }
        });
    }

    initImageGlitch() {
        const glitchImages = document.querySelectorAll('.glitch-img');
        if (glitchImages.length === 0) return;
        
        glitchImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.filter = 'url("#glitchFilter")';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.filter = 'none';
            });
        });
    }
}

/* ========== EFEITOS INTERATIVOS ========== */
class InteractiveEffects {
    constructor() {
        this.initInteractiveEffects();
    }

    initInteractiveEffects() {
        // Efeito de ripple
        this.initRippleEffect();
        
        // Efeito de hover em botões
        this.initButtonHover();
        
        // Efeito de hover em menus
        this.initMenuHover();
    }

    initRippleEffect() {
        const rippleElements = document.querySelectorAll('[data-ripple]');
        if (rippleElements.length === 0) return;
        
        rippleElements.forEach(el => {
            el.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'ripple-effect';
                
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.position = 'absolute';
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.left = `${x - size/2}px`;
                ripple.style.top = `${y - size/2}px`;
                ripple.style.background = 'rgba(0, 247, 255, 0.3)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'scale(0)';
                ripple.style.opacity = '1';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'ripple 0.6s linear';
                
                el.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    initButtonHover() {
        const buttons = document.querySelectorAll('.cyber-btn');
        if (buttons.length === 0) return;
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                btn.style.setProperty('--mouse-x', `${x}px`);
                btn.style.setProperty('--mouse-y', `${y}px`);
            });
            
            // Efeito de eco no hover
            const echo = btn.querySelector('.btn-echo');
            if (echo) {
                btn.addEventListener('mouseenter', () => {
                    echo.style.opacity = '0.5';
                    echo.style.transform = 'scale(1.1) translateY(5px)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    echo.style.opacity = '0';
                    echo.style.transform = 'scale(1.05) translateY(5px)';
                });
            }
        });
    }

    initMenuHover() {
        const menuItems = document.querySelectorAll('.cyber-menu-item');
        if (menuItems.length === 0) return;
        
        menuItems.forEach(item => {
            const underline = item.querySelector('.menu-underline');
            if (underline) {
                item.addEventListener('mouseenter', () => {
                    underline.style.width = '100%';
                });
                
                item.addEventListener('mouseleave', () => {
                    underline.style.width = '0';
                });
            }
        });
    }
}

/* ========== INICIALIZAÇÃO ========== */
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar classe para indicar que JS está habilitado
    document.documentElement.classList.add('js-enabled');
    
    // Inicializar todos os efeitos
    window.cyberEffects = new CyberEffectsManager();
});

// Limpeza ao navegar para outra página (compatibilidade com SPA)
window.addEventListener('beforeunload', () => {
    if (window.cyberEffects) {
        window.cyberEffects.destroy();
    }
});
