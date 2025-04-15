// cyberEffects.js - Gerenciador Completo de Efeitos Futuristas

class CyberEffectsManager {
    constructor() {
        this.effects = {
            crackedGlass: null,
            blackHole: null,
            particles: null,
            holographic: null,
            terminal: null
        };
        
        this.initEffects();
    }

    /* ========== INICIALIZAÇÃO ========== */
    initEffects() {
        this.loadDependencies().then(() => {
            // Verificar e inicializar cada efeito
            if (document.getElementById('cracked-glass-overlay')) {
                this.effects.crackedGlass = new CrackedGlassEffect();
            }
            
            if (document.getElementById('cyber-bg') && window.THREE) {
                this.effects.blackHole = new BlackHoleEffect('cyber-bg');
            }
            
            if (document.querySelector('.cyber-terminal')) {
                this.effects.terminal = new TerminalEffects();
            }
            
            if (document.querySelector('.holographic-card')) {
                this.effects.holographic = new HolographicEffects();
            }
            
            // Inicializar observadores de interseção
            this.initIntersectionObservers();
            
            console.log('Cyber Effects Manager initialized');
        }).catch(error => {
            console.error('Error loading dependencies:', error);
        });
    }

    /* ========== CARREGAMENTO DE DEPENDÊNCIAS ========== */
    loadDependencies() {
        const promises = [];
        
        // Carregar Three.js se necessário
        if (!window.THREE && document.getElementById('cyber-bg')) {
            promises.push(this.loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js'));
        }
        
        // Carregar GSAP para animações
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

    /* ========== OBSERVADORES DE INTERSEÇÃO ========== */
    initIntersectionObservers() {
        // Animar elementos quando ficam visíveis
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(animateOnScroll, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos com data-animate
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });

        // Animar barras de habilidades quando visíveis
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
            const level = bar.dataset.level || '50';
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = `${level}%`;
            }, 500);
        });
    }

    /* ========== DESTRUIÇÃO ========== */
    destroy() {
        // Limpar todos os efeitos
        Object.values(this.effects).forEach(effect => {
            if (effect && typeof effect.destroy === 'function') {
                effect.destroy();
            }
        });
        
        console.log('Cyber Effects Manager destroyed');
    }
}

/* ========== EFEITO DE VIDRO RACHADO ========== */
class CrackedGlassEffect {
    constructor() {
        this.triggers = [];
        this.overlay = null;
        this.initEffect();
    }

    initEffect() {
        this.overlay = document.getElementById('cracked-glass-overlay');
        if (!this.overlay) return;

        this.generateCracks();
        this.setupEventListeners();
    }

    generateCracks() {
        const crackCount = 25;
        let cracksSVG = '';
        
        for (let i = 0; i < crackCount; i++) {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = x1 + (Math.random() * 60 - 30);
            const y2 = y1 + (Math.random() * 60 - 30);
            
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
    constructor(elementId) {
        this.elementId = elementId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.blackHole = null;
        this.animationId = null;
        this.resizeHandler = null;
        this.particles = [];
        this.particleCount = 500;
        
        this.initEffect();
    }

    initEffect() {
        this.container = document.getElementById(this.elementId);
        if (!this.container || !window.THREE) return;

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
        this.camera.position.z = 5;
        
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight(0x00aaff, 0.1);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x00ffff, 0.5, 50);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }

    createBlackHole() {
        const geometry = new THREE.SphereGeometry(1, 128, 128);
        
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
            const radius = 2 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            colors[i * 3] = 0.2 + Math.random() * 0.8;
            colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
            
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
            
            this.blackHole.rotation.x += 0.002;
            this.blackHole.rotation.y += 0.005;
            
            if (this.ring) {
                this.ring.rotation.z += 0.01;
                this.ring.scale.setScalar(1 + Math.sin(time) * 0.1);
            }
            
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < this.particleCount; i++) {
                const ix = i * 3;
                const iy = i * 3 + 1;
                const iz = i * 3 + 2;
                
                positions[ix] *= 0.995;
                positions[iy] *= 0.995;
                positions[iz] *= 0.995;
                
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
        
        if (this.scene) {
            this.scene.traverse(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
        }
    }
}

/* ========== EFEITOS HOLOGRÁFICOS ========== */
class HolographicEffects {
    constructor() {
        this.animationIntervals = [];
        this.gridIntervals = [];
        this.scanlineInterval = null;
        this.initEffect();
    }

    initEffect() {
        this.initHolographicItems();
        this.initScanlineEffect();
        this.initGridEffects();
    }

    initHolographicItems() {
        const holographicItems = document.querySelectorAll('.holographic-card, .holographic-btn');
        
        const handleHolographicMove = (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
            const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
            
            const centerX = e.currentTarget.offsetWidth / 2;
            const centerY = e.currentTarget.offsetHeight / 2;
            
            const angleX = (centerY - y) / 20;
            const angleY = (x - centerX) / 20;
            
            e.currentTarget.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            
            const lightPosX = (x / e.currentTarget.offsetWidth) * 100;
            const lightPosY = (y / e.currentTarget.offsetHeight) * 100;
            
            e.currentTarget.style.setProperty('--light-pos-x', `${lightPosX}%`);
            e.currentTarget.style.setProperty('--light-pos-y', `${lightPosY}%`);
            
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
        });
    }

    initScanlineEffect() {
        const scanline = document.querySelector('.hologram-scanline, .nav-scanline');
        
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

    initGridEffects() {
        const grids = document.querySelectorAll('.hologram-grid');
        
        grids.forEach((grid, index) => {
            let posX = 0;
            let posY = 0;
            let direction = 1;
            
            const gridInterval = setInterval(() => {
                posX = (posX + direction) % 60;
                posY = (posY + direction) % 60;
                
                grid.style.backgroundPosition = `${posX}px ${posY}px`;
                
                if (Math.random() > 0.98) {
                    direction = -direction;
                }
            }, 100);
            
            this.gridIntervals.push(gridInterval);
            this.animationIntervals.push(gridInterval);
            
            const pulseInterval = setInterval(() => {
                grid.style.opacity = (0.3 + Math.random() * 0.4).toString();
            }, 2000 + Math.random() * 3000);
            
            this.animationIntervals.push(pulseInterval);
        });
    }

    destroy() {
        this.animationIntervals.forEach(interval => clearInterval(interval));
        this.gridIntervals.forEach(interval => clearInterval(interval));
        
        if (this.scanlineInterval) clearInterval(this.scanlineInterval);
    }
}

/* ========== EFEITOS DE TERMINAL ========== */
class TerminalEffects {
    constructor() {
        this.typingIntervals = [];
        this.noiseInterval = null;
        this.cursorInterval = null;
        this.initEffect();
    }

    initEffect() {
        this.initTypingEffects();
        this.initTerminalNoise();
        this.initCursorEffect();
        this.initTerminalCommands();
    }

    initTypingEffects() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const commandLines = document.querySelectorAll('.command-line');
        
        commandLines.forEach((line, index) => {
            const command = line.querySelector('.command') || line;
            const text = command.textContent;
            command.textContent = '';
            
            const delay = index * 500;
            
            setTimeout(() => {
                let i = 0;
                const typingSpeed = 50 + Math.random() * 50;
                
                const typingInterval = setInterval(() => {
                    if (i < text.length) {
                        command.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typingInterval);
                        this.typingIntervals = this.typingIntervals.filter(item => item !== typingInterval);
                        
                        setTimeout(() => {
                            command.classList.add('glitch-active');
                            setTimeout(() => command.classList.remove('glitch-active'), 500);
                        }, 500);
                    }
                }, typingSpeed);
                
                this.typingIntervals.push(typingInterval);
            }, delay);
        });
    }

    initTerminalNoise() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const terminals = document.querySelectorAll('.cyber-terminal');
        
        terminals.forEach(terminal => {
            const createNoise = () => {
                const noise = document.createElement('div');
                noise.className = 'terminal-noise';
                
                let noisePattern = '';
                const noiseDensity = 50;
                
                for (let i = 0; i < noiseDensity; i++) {
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    const opacity = 0.05 + Math.random() * 0.1;
                    noisePattern += `<rect x="${x}" y="${y}" width="1" height="1" fill="rgba(0, 247, 255, ${opacity})"/>`;
                }
                
                noise.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">${noisePattern}</svg>')`;
                
                terminal.appendChild(noise);
                
                setTimeout(() => {
                    if (noise.parentNode === terminal) {
                        terminal.removeChild(noise);
                    }
                }, 100);
            };
            
            this.noiseInterval = setInterval(() => {
                if (Math.random() > 0.3) {
                    createNoise();
                }
            }, 500);
        });
    }

    initCursorEffect() {
        const cursors = document.querySelectorAll('.cursor');
        
        cursors.forEach(cursor => {
            let visible = true;
            
            this.cursorInterval = setInterval(() => {
                visible = !visible;
                cursor.style.visibility = visible ? 'visible' : 'hidden';
                
                if (Math.random() > 0.8) {
                    cursor.style.transform = `translateX(${Math.random() * 5 - 2.5}px)`;
                } else {
                    cursor.style.transform = 'translateX(0)';
                }
            }, 500);
        });
    }

    initTerminalCommands() {
        const terminalInput = document.querySelector('.terminal-input');
        if (!terminalInput) return;
        
        const terminalOutput = document.querySelector('.terminal-output');
        
        const commandHistory = [];
        let historyIndex = -1;
        
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (commandHistory.length === 0) return;
                
                historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex <= 0) {
                    historyIndex = -1;
                    terminalInput.value = '';
                } else {
                    historyIndex = Math.max(historyIndex - 1, 0);
                    terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
                }
                e.preventDefault();
            }
        });
        
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                
                if (command) {
                    commandHistory.push(command);
                    historyIndex = -1;
                    
                    this.processCommand(command, terminalOutput);
                    terminalInput.value = '';
                }
            }
        });
    }

    processCommand(command, outputElement) {
        if (!outputElement) return;
        
        outputElement.innerHTML += `<div class="command-line"><span class="prompt">user@gabriel-dev:~$</span> <span class="command">${command}</span></div>`;
        
        switch (command.toLowerCase()) {
            case 'help':
                outputElement.innerHTML += `<div class="terminal-output">
                    <div>Comandos disponíveis:</div>
                    <div>- help: Mostra esta ajuda</div>
                    <div>- clear: Limpa o terminal</div>
                    <div>- blackhole: Ativa/desativa efeito de buraco negro</div>
                    <div>- about: Mostra informações sobre o desenvolvedor</div>
                </div>`;
                break;
                
            case 'clear':
                outputElement.innerHTML = '';
                break;
                
            case 'about':
                outputElement.innerHTML += `<div class="terminal-output">
                    <div>Gabriel Alves - Desenvolvedor Full Stack</div>
                    <div>Especializado em Python e JavaScript</div>
                    <div>Estudante de Desenvolvimento de Sistemas</div>
                </div>`;
                break;
                
            case 'blackhole':
                document.body.classList.toggle('blackhole-active');
                outputElement.innerHTML += `<div>Efeito de buraco negro ${document.body.classList.contains('blackhole-active') ? 'ativado' : 'desativado'}</div>`;
                break;
                
            default:
                outputElement.innerHTML += `<div>Comando não reconhecido: ${command}</div>`;
                outputElement.innerHTML += `<div>Digite "help" para ver os comandos disponíveis</div>`;
        }
        
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    destroy() {
        this.typingIntervals.forEach(interval => clearInterval(interval));
        
        if (this.noiseInterval) clearInterval(this.noiseInterval);
        if (this.cursorInterval) clearInterval(this.cursorInterval);
    }
}

/* ========== INICIALIZAÇÃO ========== */
document.addEventListener('DOMContentLoaded', () => {
    window.cyberEffects = new CyberEffectsManager();
});

window.addEventListener('beforeunload', () => {
    if (window.cyberEffects) {
        window.cyberEffects.destroy();
    }
});

// Exportar para módulos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CyberEffectsManager,
        CrackedGlassEffect,
        BlackHoleEffect,
        HolographicEffects,
        TerminalEffects
    };
}
