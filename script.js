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
            
            // Simular envio (substituir por integração real)
            console.log('Mensagem enviada:', { name, email, message });
            
            // Feedback visual
            const btn = contactForm.querySelector('button');
            btn.textContent = 'Enviado com sucesso!';
            btn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = 'Enviar Mensagem';
                btn.style.backgroundColor = '';
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
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('section, .skill-card, .project-card, .certificate-card').forEach(element => {
        observer.observe(element);
    });

    // Inicializar parallax
    if (window.innerWidth > 768) {
        const hero = document.querySelector('.hero');
        if (hero) {
            new Parallax(hero, {
                relativeInput: true,
                hoverOnly: true
            });
        }
    }
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
