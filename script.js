// Inicializar partículas
document.addEventListener('DOMContentLoaded', function() {
    // Configuração das partículas
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#00F5FF"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#00F5FF",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Ativar menu ativo ao rolar
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        const header = document.querySelector('header');
        
        // Adicionar classe scrolled ao header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Menu ativo
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Resetar erros
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            // Coletar dados do formulário
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;
            
            // Validação
            if (!name) {
                document.getElementById('name').parentElement.classList.add('error');
                document.getElementById('name').parentElement.querySelector('.error-message').textContent = 'Por favor, insira seu nome';
                isValid = false;
            }
            
            if (!email) {
                document.getElementById('email').parentElement.classList.add('error');
                document.getElementById('email').parentElement.querySelector('.error-message').textContent = 'Por favor, insira seu email';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('email').parentElement.classList.add('error');
                document.getElementById('email').parentElement.querySelector('.error-message').textContent = 'Por favor, insira um email válido';
                isValid = false;
            }
            
            if (!message) {
                document.getElementById('message').parentElement.classList.add('error');
                document.getElementById('message').parentElement.querySelector('.error-message').textContent = 'Por favor, insira sua mensagem';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Simular envio
            const formData = {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // Salvar no localStorage para demonstração
            localStorage.setItem('contatoEnviado', JSON.stringify(formData));
            
            // Feedback visual
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '✓ Mensagem Enviada!';
            btn.style.backgroundColor = '#4CAF50';
            btn.disabled = true;
            
            // Mostrar notificação
            showNotification('Mensagem enviada com sucesso! Em breve entrarei em contato.', 'success');
            
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3000);
        });
    }

    // Certificados - Flip no click para mobile
    document.querySelectorAll('.certificate-card').forEach(card => {
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.querySelector('.certificate-flip').classList.toggle('flipped');
            }
        });
    });

    // Animações ao rolar
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                
                // Animar stats dos projetos
                if (entry.target.classList.contains('project-card')) {
                    const stats = entry.target.querySelectorAll('.stat-item');
                    stats.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.style.opacity = '1';
                            stat.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('section, .skill-card, .project-card, .certificate-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Inicializar stats animation
    document.querySelectorAll('.stat-item').forEach(stat => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(10px)';
        stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Função de notificação
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#ff3860'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        `;
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Adicionar estilos para animação da notificação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Transformar textos de contato em links clicáveis
document.querySelectorAll('.contact-info p, .contact-info ul li').forEach(item => {
    const text = item.textContent || item.innerText;
    if (text.includes('github.com')) {
        item.innerHTML = text.replace(/(github\.com\/[^\s]+)/, '<a href="https://$1" target="_blank">$1</a>');
    } else if (text.includes('instagram.com')) {
        item.innerHTML = text.replace(/(instagram\.com\/[^\s]+)/, '<a href="https://$1" target="_blank">$1</a>');
    }
});
