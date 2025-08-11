// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = window.scrollY;
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe demo examples
    const demoExamples = document.querySelectorAll('.demo-example');
    demoExamples.forEach((example, index) => {
        example.style.opacity = '0';
        example.style.transform = 'translateY(20px)';
        example.style.transition = `all 0.5s ease ${index * 0.2}s`;
        observer.observe(example);
    });
});

// Demo example interactions
function showDemoResult(type) {
    const examples = document.querySelectorAll('.demo-example');
    
    examples.forEach(example => {
        example.style.transform = 'scale(0.98)';
        example.style.opacity = '0.7';
    });
    
    setTimeout(() => {
        examples.forEach(example => {
            example.style.transform = 'scale(1)';
            example.style.opacity = '1';
        });
    }, 200);
    
    // Add ripple effect
    const clickedExample = document.querySelector(`.demo-example.${type}`);
    if (clickedExample) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        clickedExample.style.position = 'relative';
        clickedExample.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.98);
        backdrop-filter: blur(20px);
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for background shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.bg-shape');
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Enhanced button hover effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add custom cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Create custom cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    opacity: 0;
`;
document.body.appendChild(cursor);

// Show/hide custom cursor
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '0.7';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Stats counter animation
function animateCounter(element, target, duration = 4000, suffix = '', startPercent = 0.3) {
    let start = target * startPercent; // Start from 30% of target value
    const increment = (target - start) / (duration / 60); // Slower, more visible steps
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            // Show appropriate formatting during animation
            if (suffix === '%') {
                element.textContent = Math.floor(start * 10) / 10 + suffix;
            } else if (suffix === 'ms') {
                element.textContent = Math.floor(start) + suffix;
            } else if (suffix === ' sec') {
                element.textContent = (Math.floor(start * 10) / 10).toFixed(1) + suffix;
            } else if (suffix === '+') {
                element.textContent = Math.floor(start) + suffix;
            } else {
                element.textContent = Math.floor(start);
            }
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    }
    
    updateCounter();
}

// Initialize counters when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const text = stat.textContent;
                
                // All stats start at the same time and end at the same time
                // Handle different stat formats
                if (text.includes('%')) {
                    const number = parseFloat(text);
                    if (!isNaN(number)) {
                        animateCounter(stat, number, 4000, '%'); // 4 seconds, starts from 30%
                    }
                } else if (text.includes('ms')) {
                    const number = parseFloat(text);
                    if (!isNaN(number)) {
                        animateCounter(stat, number, 4000, 'ms'); // 4 seconds, starts from 30%
                    }
                } else if (text.includes('sec')) {
                    const number = parseFloat(text);
                    if (!isNaN(number)) {
                        animateCounter(stat, number, 4000, ' sec'); // 4 seconds, starts from 30%
                    }
                } else if (text.includes('+')) {
                    const number = parseFloat(text);
                    if (!isNaN(number)) {
                        animateCounter(stat, number, 4000, '+'); // 4 seconds, starts from 30%
                    }
                } else {
                    const number = parseFloat(text);
                    if (!isNaN(number)) {
                        animateCounter(stat, number, 4000);
                    }
                }
            });
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}
