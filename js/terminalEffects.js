// terminalEffects.js - Efeitos de Terminal Avançados

class TerminalEffects {
    constructor() {
        this.animationIntervals = [];
        this.typingIntervals = [];
        this.noiseInterval = null;
        this.cursorInterval = null;
        this.initEffects();
    }

    /* ========== INICIALIZAÇÃO PRINCIPAL ========== */
    initEffects() {
        this.initTypingEffects();
        this.initTerminalNoise();
        this.initCursorEffect();
        this.initProgressBars();
        this.initExerciseCards();
        this.initTerminalCommands();
        
        console.log('Terminal Effects initialized');
    }

    /* ========== EFEITOS DE DIGITAÇÃO ========== */
    initTypingEffects() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const commandLines = document.querySelectorAll('.command-line, .terminal-line');
        
        commandLines.forEach((line, index) => {
            const command = line.querySelector('.command') || line;
            const text = command.textContent;
            command.textContent = '';
            
            // Delay baseado no índice para efeito em cascata
            const delay = index * 500;
            
            const timeout = setTimeout(() => {
                let i = 0;
                const typingSpeed = 50 + Math.random() * 50; // Velocidade variada
                
                const typingInterval = setInterval(() => {
                    if (i < text.length) {
                        command.textContent += text.charAt(i);
                        i++;
                        
                        // Efeito sonoro opcional (descomente se quiser adicionar)
                        // this.playTypingSound();
                    } else {
                        clearInterval(typingInterval);
                        
                        // Adicionar efeito de glitch após digitação
                        setTimeout(() => {
                            command.classList.add('glitch-active');
                            setTimeout(() => command.classList.remove('glitch-active'), 500);
                        }, 500);
                    }
                }, typingSpeed);
                
                this.typingIntervals.push(typingInterval);
            }, delay);
            
            this.animationTimeouts.push(timeout);
        });
    }

    /* ========== EFEITO DE RUÍDO DE TERMINAL ========== */
    initTerminalNoise() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const terminals = document.querySelectorAll('.cyber-terminal');
        
        terminals.forEach(terminal => {
            const createNoise = () => {
                const noise = document.createElement('div');
                noise.className = 'terminal-noise';
                
                // Criar padrão de ruído mais complexo
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
            
            // Intervalo de ruído variável
            this.noiseInterval = setInterval(() => {
                if (Math.random() > 0.3) {
                    createNoise();
                }
            }, 500);
            
            this.animationIntervals.push(this.noiseInterval);
        });
    }

    /* ========== EFEITO DE CURSOR PISCANDO ========== */
    initCursorEffect() {
        const cursors = document.querySelectorAll('.cursor');
        
        cursors.forEach(cursor => {
            let visible = true;
            
            const cursorInterval = setInterval(() => {
                visible = !visible;
                cursor.style.visibility = visible ? 'visible' : 'hidden';
                
                // Efeito de glitch aleatório no cursor
                if (Math.random() > 0.8) {
                    cursor.style.transform = `translateX(${Math.random() * 5 - 2.5}px)`;
                } else {
                    cursor.style.transform = 'translateX(0)';
                }
            }, 500);
            
            this.cursorInterval = cursorInterval;
            this.animationIntervals.push(cursorInterval);
        });
    }

    /* ========== BARRAS DE PROGRESSO DO TERMINAL ========== */
    initProgressBars() {
        const progressBars = document.querySelectorAll('.terminal-progress .progress-value');
        
        progressBars.forEach(bar => {
            let width = parseInt(bar.style.width) || 0;
            let loading = true;
            
            const progressInterval = setInterval(() => {
                if (loading) {
                    width += 2;
                    if (width >= 100) {
                        loading = false;
                        setTimeout(() => loading = true, 2000);
                    }
                } else {
                    width -= 2;
                    if (width <= 0) {
                        width = 0;
                    }
                }
                
                bar.style.width = `${width}%`;
                
                // Mudar cor baseada no progresso
                const hue = 160 + (width * 1.6); // De ciano (160) a rosa (320)
                bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            }, 50);
            
            this.animationIntervals.push(progressInterval);
        });
    }

    /* ========== CARDS DE EXERCÍCIOS ========== */
    initExerciseCards() {
        const exerciseCards = document.querySelectorAll('.exercise-card');
        
        exerciseCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const glitch = this.querySelector('.exercise-glitch');
                if (glitch) {
                    glitch.style.opacity = '0.3';
                    glitch.style.animation = 'glitch 0.3s infinite';
                }
                
                // Efeito de levitação
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 20px 30px rgba(0, 247, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                const glitch = this.querySelector('.exercise-glitch');
                if (glitch) {
                    glitch.style.opacity = '0';
                    glitch.style.animation = 'none';
                }
                
                // Resetar efeito de levitação
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0, 247, 255, 0.2)';
            });
        });
    }

    /* ========== COMANDOS DE TERMINAL INTERATIVOS ========== */
    initTerminalCommands() {
        const terminalInput = document.querySelector('.terminal-input');
        if (!terminalInput) return;
        
        const terminalOutput = document.querySelector('.terminal-output');
        
        // Histórico de comandos
        const commandHistory = [];
        let historyIndex = -1;
        
        terminalInput.addEventListener('keydown', (e) => {
            // Navegação pelo histórico
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
                    // Adicionar ao histórico
                    commandHistory.push(command);
                    historyIndex = -1;
                    
                    // Processar comando
                    this.processCommand(command, terminalOutput);
                    
                    // Limpar input
                    terminalInput.value = '';
                }
            }
        });
    }

    processCommand(command, outputElement) {
        if (!outputElement) return;
        
        // Simular processamento
        outputElement.innerHTML += `<div class="command-line"><span class="prompt">user@gabriel-dev:~$</span> <span class="command">${command}</span></div>`;
        
        // Comandos especiais
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
        
        // Rolagem automática para baixo
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    /* ========== EFEITO SONORO DE DIGITAÇÃO (OPCIONAL) ========== */
    playTypingSound() {
        // Implementação básica - pode ser expandida com Web Audio API
        const sounds = ['click', 'tap', 'pop'];
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        
        // Isso requer arquivos de som correspondentes
        // new Audio(`sounds/${sound}.mp3`).play().catch(e => console.log('Audio playback error:', e));
    }

    /* ========== DESTRUIÇÃO/LIMPEZA ========== */
    destroy() {
        // Limpar todos os intervalos e timeouts
        this.animationIntervals.forEach(interval => clearInterval(interval));
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.typingIntervals.forEach(interval => clearInterval(interval));
        
        // Limpar intervalos específicos
        if (this.noiseInterval) clearInterval(this.noiseInterval);
        if (this.cursorInterval) clearInterval(this.cursorInterval);
        
        console.log('Terminal Effects destroyed');
    }
}

/* ========== INICIALIZAÇÃO ========== */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há elementos de terminal na página
    const terminalElements = document.querySelectorAll('.cyber-terminal, .command-line');
    
    if (terminalElements.length > 0) {
        window.terminalEffects = new TerminalEffects();
    }
});

// Limpeza ao sair da página
window.addEventListener('beforeunload', () => {
    if (window.terminalEffects) {
        window.terminalEffects.destroy();
    }
});

// Exportar para uso em outros arquivos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerminalEffects;
}
