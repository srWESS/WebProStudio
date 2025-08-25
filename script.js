// Função para scroll suave para seções
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para comparador de imagens com arraste
function setupImageComparison() {
    const comparison = document.querySelector('.image-comparison');
    const after = document.querySelector('.after');
    
    if (!comparison || !after) return;
    
    let isDragging = false;
    
    // Eventos para mouse
    comparison.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mousemove', drag);
    
    // Eventos para touch (mobile)
    comparison.addEventListener('touchstart', startDrag);
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('touchmove', drag);
    
    function startDrag(e) {
        isDragging = true;
        comparison.style.cursor = 'grabbing';
        updatePosition(e);
    }
    
    function stopDrag() {
        isDragging = false;
        comparison.style.cursor = 'col-resize';
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e);
    }
    
    function updatePosition(e) {
        const rect = comparison.getBoundingClientRect();
        let x;
        
        if (e.type.includes('mouse')) {
            x = e.clientX;
        } else if (e.type.includes('touch')) {
            x = e.touches[0].clientX;
        }
        
        const position = ((x - rect.left) / rect.width) * 100;
        const clampedPosition = Math.max(0, Math.min(100, position));
        
        after.style.width = clampedPosition + '%';
    }
    
    // Inicializar com 50%
    after.style.width = '50%';
}

// Animação de contador para estatísticas
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '%';
        }
    }, 16);
}

// Observador de interseção para animações
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar estatísticas
                if (entry.target.classList.contains('stats-grid')) {
                    const statNumbers = entry.target.querySelectorAll('.stat-item h3');
                    statNumbers.forEach((number, index) => {
                        const targetValues = [87, 63, 45, 24];
                        setTimeout(() => {
                            animateCounter(number, targetValues[index], 2000);
                        }, index * 300);
                    });
                }
                
                // Animar cards
                if (entry.target.classList.contains('beneficio-card') || 
                    entry.target.classList.contains('plano-card') ||
                    entry.target.classList.contains('depoimento-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const elementsToObserve = [
        document.querySelector('.stats-grid'),
        ...document.querySelectorAll('.beneficio-card'),
        ...document.querySelectorAll('.plano-card'),
        ...document.querySelectorAll('.depoimento-card')
    ];

    elementsToObserve.forEach(element => {
        if (element) {
            if (element.classList.contains('beneficio-card') || 
                element.classList.contains('plano-card') ||
                element.classList.contains('depoimento-card')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s ease-out';
            }
            observer.observe(element);
        }
    });
}

// Menu mobile completo
function setupMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.innerHTML = '☰';
    menuToggle.className = 'menu-toggle';
    
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.appendChild(menuToggle);
        
        // Criar overlay para fechar o menu
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        
        const navMenu = document.querySelector('.nav-menu');
        
        // Função para abrir o menu
        function openMenu() {
            navMenu.classList.add('active');
            overlay.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.innerHTML = '✕';
            document.body.style.overflow = 'hidden';
        }
        
        // Função para fechar o menu
        function closeMenu() {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.innerHTML = '☰';
            document.body.style.overflow = '';
        }
        
        // Toggle do menu ao clicar no botão
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Fechar menu ao clicar no overlay
        overlay.addEventListener('click', closeMenu);
        
        // Fechar menu ao clicar em um link
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Fechar menu ao redimensionar a janela para desktop
        function handleResize() {
            if (window.innerWidth > 768) {
                closeMenu();
                menuToggle.style.display = 'none';
            } else {
                menuToggle.style.display = 'block';
            }
        }
        
        // Inicializar estado do botão
        handleResize();
        
        // Adicionar listener para redimensionamento
        window.addEventListener('resize', handleResize);
        
        // Fechar menu com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
}

// Efeito de parallax suave (apenas para ícones de benefícios)
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.beneficio-icon');
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    });
}

// Validação de formulário (para futura implementação)
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Validação básica - pode ser expandida
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'red';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Simular envio bem-sucedido
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                form.reset();
            }
        });
    });
}

// Contador de tempo real para entrega
function updateDeliveryTime() {
    const now = new Date();
    const hour = now.getHours();
    const isBusinessHours = hour >= 9 && hour < 18 && now.getDay() >= 1 && now.getDay() <= 5;
    
    const deliveryElements = document.querySelectorAll('.stat-item:last-child h3');
    deliveryElements.forEach((element, index) => {
        if (isBusinessHours) {
            const remainingHours = 18 - hour;
            if (index === deliveryElements.length - 1) {
                element.textContent = '24h'; // Entrega rápida
            } else {
                element.textContent = remainingHours + 'h'; // Outras estatísticas
            }
        } else {
            element.textContent = '24h'; // Entrega rápida
        }
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar observador de interseção
    setupIntersectionObserver();
    
    // Configurar comparação de imagens
    setupImageComparison();
    
    // Configurar menu mobile
    setupMobileMenu();
    
    // Configurar parallax
    setupParallax();
    
    // Configurar validação de formulário
    setupFormValidation();
    
    // Atualizar tempo de entrega
    updateDeliveryTime();
    
    // Atualizar a cada hora
    setInterval(updateDeliveryTime, 3600000);
    
    // Adicionar event listeners para botões
    const buttons = document.querySelectorAll('button[onclick*="scrollToSection"]');
    buttons.forEach(button => {
        const match = button.getAttribute('onclick').match(/scrollToSection\('(.+)'\)/);
        if (match) {
            button.addEventListener('click', () => scrollToSection(match[1]));
        }
    });
    
    // Efeito de hover nos cards de planos
    const planCards = document.querySelectorAll('.plano-card');
    planCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('popular')) {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('popular')) {
                card.style.transform = '';
                card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        });
    });
    
    // Console log para desenvolvimento
    console.log('FoodImage Pro - Landing Page carregada com sucesso!');
});

// Função para WhatsApp direto
function openWhatsApp() {
    const phone = '5511999999999';
    const message = 'Olá! Gostaria de saber mais sobre o serviço de aprimoramento de imagens.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Função para enviar email
function sendEmail() {
    const email = 'contato@foodimagepro.com.br';
    const subject = 'Interesse no serviço FoodImage Pro';
    const body = 'Olá! Gostaria de saber mais sobre seus serviços de aprimoramento de imagens.';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Adicionar event listeners para contato
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar funcionalidade WhatsApp aos botões de contato
    const whatsappButtons = document.querySelectorAll('button[data-whatsapp]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', openWhatsApp);
    });
    
    // Adicionar funcionalidade email
    const emailButtons = document.querySelectorAll('button[data-email]');
    emailButtons.forEach(button => {
        button.addEventListener('click', sendEmail);
    });
});
