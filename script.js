// ==========================================================================
// EFEITO TYPEWRITER (HERO)
// ==========================================================================
const text = "A Verdadeira Evolução Começa no Tatame.";
const speed = 60; // Velocidade da digitação em milissegundos
let i = 0;

function typeWriter() {
    const el = document.getElementById("typewriter");
    if (el && i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

// ==========================================================================
// BOTÃO "VOLTAR AO TOPO"
// ==========================================================================
function handleScroll() {
    const backToTopBtn = document.getElementById('backToTop');

    // Mostra o botão se descer mais de 300 pixels
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

// ==========================================================================
// MENU MOBILE (HAMBÚRGUER)
// ==========================================================================
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    if (!toggle || !nav || !overlay) return;

    const closeMenu = () => {
        nav.classList.remove('open');
        overlay.classList.remove('show');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    const toggleMenu = () => {
        const isOpen = nav.classList.toggle('open');
        overlay.classList.toggle('show', isOpen);
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('no-scroll', isOpen);
    };

    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMenu();
    });
}

// ==========================================================================
// FILTRO GENÉRICO DE ABAS (EQUIPE / HORÁRIOS)
// ==========================================================================
function initTabFilter(buttonSelector, dataAttr, wrapperSelector) {
    const buttons = document.querySelectorAll(buttonSelector);
    const wrappers = document.querySelectorAll(wrapperSelector);
    if (!buttons.length || !wrappers.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute(dataAttr);

            buttons.forEach(btn => btn.classList.remove('active'));
            wrappers.forEach(wrap => wrap.classList.remove('active'));

            button.classList.add('active');

            const targetWrapper = document.getElementById(targetId);
            if (targetWrapper) {
                targetWrapper.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// ANIMAÇÃO DE ENTRADA AO ROLAR (SCROLL REVEAL)
// ==========================================================================
function initScrollReveal() {
    const groups = [
        '.card-equipe',
        '.card-personal',
        '.tabela-horarios tbody tr',
        '.mapa-item',
        '.card-depoimento',
        '.avaliacoes-cta'
    ];

    const elements = document.querySelectorAll(groups.join(','));
    if (!elements.length) return;

    elements.forEach(el => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Aplica um pequeno atraso escalonado para cards dentro do mesmo grid
    const containers = new Set();
    elements.forEach(el => containers.add(el.parentElement));

    containers.forEach(container => {
        Array.from(container.children).forEach((child, index) => {
            if (groups.some(sel => child.matches(sel))) {
                child.style.transitionDelay = `${Math.min(index, 5) * 0.08}s`;
            }
        });
    });

    elements.forEach(el => observer.observe(el));
}

// ==========================================================================
// DESTAQUE DO DIA ATUAL NA GRADE DE HORÁRIOS
// ==========================================================================
function initHighlightToday() {
    const table = document.querySelector('.tabela-horarios');
    if (!table) return;

    const today = new Date().getDay(); // 0 = Domingo ... 6 = Sábado
    const th = table.querySelector(`thead th[data-day="${today}"]`);
    if (!th) return; // domingo: academia fechada, nenhuma coluna corresponde

    const index = Array.from(th.parentElement.children).indexOf(th) + 1;

    th.classList.add('coluna-hoje');
    const span = document.createElement('span');
    span.className = 'hoje-tag';
    span.textContent = 'Hoje';
    th.appendChild(span);

    table.querySelectorAll('tbody tr').forEach(row => {
        const cell = row.querySelector(`td:nth-child(${index})`);
        if (cell) cell.classList.add('coluna-hoje');
    });
}

// ==========================================================================
// INICIALIZADORES
// ==========================================================================
window.onload = () => {
    typeWriter();
    initMobileMenu();
    initTabFilter('.btn-unidade[data-target]', 'data-target', '.unidade-wrapper');
    initTabFilter('.btn-unidade[data-horario-target]', 'data-horario-target', '.horario-wrapper');
    initScrollReveal();
    initHighlightToday();
};

window.addEventListener('scroll', handleScroll);
