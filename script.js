/* ========================================
   ARE INFRATECH — JavaScript Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const reveals = document.querySelectorAll('.reveal');

    // ===== Mobile Nav Overlay =====
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    // ===== Navbar Scroll Effect =====
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.scrollY;

        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (currentScroll > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // ===== Active Nav Link =====
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ===== Mobile Hamburger Menu =====
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    overlay.addEventListener('click', closeMenu);

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Close menu on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ===== Back to Top =====
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Scroll Reveal Animation =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for items in the same parent
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let siblingIndex = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) siblingIndex = i;
                });

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, siblingIndex * 100);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // ===== Counter Animation =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // ===== Contact Form =====
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !phone || !message) {
            shakeButton();
            return;
        }

        // Build WhatsApp message
        const waMessage = `Hello ARE Infratech!%0A%0A` +
            `*Name:* ${name}%0A` +
            `*Phone:* ${phone}%0A` +
            (email ? `*Email:* ${email}%0A` : '') +
            (service ? `*Service:* ${service}%0A` : '') +
            `*Message:* ${message}`;

        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/919350071000?text=${waMessage}`, '_blank');

        // Show success message
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');

        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'flex';
            formSuccess.classList.remove('show');
        }, 5000);
    });

    function shakeButton() {
        const btn = document.getElementById('submitBtn');
        btn.style.animation = 'shake 0.5s ease';
        setTimeout(() => btn.style.animation = '', 500);
    }

    // ===== Smooth scroll for all anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== Add shake keyframe dynamically =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-8px); }
        }
    `;
    document.head.appendChild(style);

    // ===== Parallax on Hero (subtle) =====
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero-bg img');
        if (hero && window.scrollY < window.innerHeight) {
            hero.style.transform = `scale(${1.05 + window.scrollY * 0.0001}) translateY(${window.scrollY * 0.2}px)`;
        }
    }, { passive: true });
});
