// Enhanced Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Add animation to bars
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.transition = 'all 0.3s ease';
        if (navToggle.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'translateY(8px) rotate(45deg)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Reset hamburger animation
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add visual feedback
            anchor.style.transform = 'scale(0.95)';
            setTimeout(() => {
                anchor.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

// Enhanced navbar background change on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Enhanced animated counter for statistics
function animateCounter(element, target, duration = 2000, suffix = '') {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        
        const value = Math.floor(start);
        if (suffix === '%') {
            element.textContent = value + '%';
        } else if (suffix === '+') {
            element.textContent = value + '+';
        } else {
            element.textContent = value;
        }
        
        // Add pulse effect when reaching target
        if (start >= target) {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }, 16);
}

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate statistics when they come into view
            if (entry.target.classList.contains('stat-number')) {
                const text = entry.target.textContent;
                const value = parseInt(text);
                const suffix = text.includes('%') ? '%' : (text.includes('+') ? '+' : '');
                
                // Reset and animate
                entry.target.textContent = '0';
                setTimeout(() => {
                    animateCounter(entry.target, value, 2000, suffix);
                }, 200);
            }
            
            // Animate service cards with stagger effect
            if (entry.target.classList.contains('service-card')) {
                const cards = document.querySelectorAll('.service-card');
                const index = Array.from(cards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
            
            // Animate testimonial cards
            if (entry.target.classList.contains('testimonial-card')) {
                const cards = document.querySelectorAll('.testimonial-card');
                const index = Array.from(cards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
            
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .testimonial-card, .timeline-item, .stat-number, .detail-item, .contact-item').forEach(el => {
    fadeInObserver.observe(el);
});

// Enhanced contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Add loading animation to form
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Enhanced validation with visual feedback
    const requiredFields = ['name', 'email', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = this.querySelector(`[name="${field}"]`);
        if (!data[field]) {
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
            isValid = false;
            
            // Reset styling after 3 seconds
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }, 3000);
        } else {
            input.style.borderColor = '#22c55e';
            input.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.3)';
        }
    });
    
    if (!isValid) {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = this.querySelector('[name="email"]');
    if (!emailRegex.test(data.email)) {
        emailInput.style.borderColor = '#ef4444';
        emailInput.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate processing time
    setTimeout(() => {
        // Create email content
        const emailSubject = `New Contact Form Submission - ${data.service || 'General Inquiry'}`;
        const emailBody = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Service: ${data.service || 'Not specified'}

Message:
${data.message}

---
This message was sent from your portfolio website contact form.
        `.trim();
        
        // Create mailto link
        const mailtoLink = `mailto:kajolshah6504@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Email client opened! Please send the email to complete your inquiry.', 'success');
        
        // Reset form with animation
        this.reset();
        this.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        });
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Add success animation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    }, 1500);
});

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.style.transform = 'translateX(100%)';
        setTimeout(() => existingNotification.remove(), 300);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Enhanced styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 450px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: flex;
        align-items: center;
        gap: 1rem;
        backdrop-filter: blur(10px);
        ${type === 'success' ? 'background: linear-gradient(135deg, #22c55e, #16a34a);' : ''}
        ${type === 'error' ? 'background: linear-gradient(135deg, #ef4444, #dc2626);' : ''}
        ${type === 'info' ? 'background: linear-gradient(135deg, #3b82f6, #2563eb);' : ''}
    `;
    
    // Icon styles
    const icon = notification.querySelector('.notification-icon i');
    icon.style.cssText = `
        font-size: 1.5rem;
        animation: bounce 0.6s ease-out;
    `;
    
    // Close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.3s ease;
        margin-left: auto;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
        closeBtn.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.8';
        closeBtn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeNotification = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 400);
    };
    
    closeBtn.addEventListener('click', closeNotification);
    
    // Auto close after 6 seconds
    setTimeout(() => {
        if (document.contains(notification)) {
            closeNotification();
        }
    }, 6000);
}

// Enhanced parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroPlaceholder = document.querySelector('.hero-placeholder');
    
    if (hero && scrolled < hero.offsetHeight) {
        // Parallax for hero content
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        // Rotate hero placeholder
        if (heroPlaceholder) {
            heroPlaceholder.style.transform = `rotate(${scrolled * 0.1}deg)`;
        }
    }
});

// Enhanced typing effect for hero title
function typeWriter(element, text, speed = 100, callback = null) {
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '3px solid #d4af37';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor
            setTimeout(() => {
                element.style.borderRight = 'none';
                if (callback) callback();
            }, 500);
        }
    }
    
    type();
}

// Initialize enhanced typing effect on page load
document.addEventListener('DOMContentLoaded', function() {
    const titleMain = document.querySelector('.title-main');
    const titleSub = document.querySelector('.title-sub');
    
    if (titleMain && titleSub) {
        // Reset initial state
        titleMain.style.opacity = '1';
        titleSub.style.opacity = '0';
        
        setTimeout(() => {
            typeWriter(titleMain, 'Kajol Shah', 120, () => {
                titleSub.style.opacity = '1';
                titleSub.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    typeWriter(titleSub, 'Civil & Criminal Litigation Expert', 60);
                }, 300);
            });
        }, 1000);
    }
});

// Enhanced scroll to top functionality
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #d4af37, #f4d03f);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: translateY(100px) scale(0.8);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Enhanced hover effects
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = scrollBtn.style.transform.replace('scale(0.8)', 'scale(1.1)').replace('scale(1)', 'scale(1.1)');
        scrollBtn.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = scrollBtn.style.transform.replace('scale(1.1)', 'scale(1)');
        scrollBtn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    });
    
    scrollBtn.addEventListener('click', () => {
        // Add click animation
        scrollBtn.style.transform = scrollBtn.style.transform + ' scale(0.9)';
        setTimeout(() => {
            scrollBtn.style.transform = scrollBtn.style.transform.replace('scale(0.9)', '');
        }, 150);
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
            scrollBtn.style.transform = 'translateY(0) scale(1)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
            scrollBtn.style.transform = 'translateY(100px) scale(0.8)';
        }
    });
}

// Initialize scroll to top button
createScrollToTop();

// Enhanced preloader
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <i class="fas fa-balance-scale"></i>
            </div>
            <div class="preloader-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <div class="preloader-text">Loading Excellence...</div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a2332 0%, #2c3e50 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.8s ease, visibility 0.8s ease;
    `;
    
    // Enhanced preloader styles
    const style = document.createElement('style');
    style.textContent = `
        .preloader-content {
            text-align: center;
            color: white;
        }
        
        .preloader-logo {
            font-size: 5rem;
            color: #d4af37;
            margin-bottom: 2rem;
            animation: logoGlow 2s ease-in-out infinite alternate;
        }
        
        .preloader-spinner {
            position: relative;
            margin: 2rem auto;
            width: 80px;
            height: 80px;
        }
        
        .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-top: 4px solid #d4af37;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
        }
        
        .spinner-ring:nth-child(2) {
            width: 60px;
            height: 60px;
            top: 10px;
            left: 10px;
            border-top-color: #f4d03f;
            animation-duration: 1s;
            animation-direction: reverse;
        }
        
        .spinner-ring:nth-child(3) {
            width: 40px;
            height: 40px;
            top: 20px;
            left: 20px;
            border-top-color: #d4af37;
            animation-duration: 0.75s;
        }
        
        .preloader-text {
            font-size: 1.3rem;
            font-weight: 500;
            animation: textPulse 2s ease-in-out infinite;
        }
        
        @keyframes logoGlow {
            from { text-shadow: 0 0 20px rgba(212, 175, 55, 0.5); }
            to { text-shadow: 0 0 30px rgba(212, 175, 55, 0.8), 0 0 40px rgba(212, 175, 55, 0.3); }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes textPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(preloader);
    
    // Hide preloader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.remove();
                style.remove();
            }, 800);
        }, 1500);
    });
}

// Initialize enhanced preloader
createPreloader();

// Enhanced mouse cursor effects
function createCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #d4af37, #f4d03f);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.2s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Smooth cursor movement
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Enhanced cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .testimonial-card, input, textarea, select');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'linear-gradient(45deg, #f4d03f, #d4af37)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'linear-gradient(45deg, #d4af37, #f4d03f)';
        });
    });
}

// Initialize cursor effects (only on desktop)
if (window.innerWidth > 768) {
    createCursorEffects();
}

// Console enhancement
console.log(`
%c🏛️ Kajol Shah - Civil & Criminal Litigation Expert
%cBuilt with modern web technologies for optimal performance.
%cWebsite designed for professional legal services.
%c✨ Enhanced with advanced animations and interactions!`,
'color: #d4af37; font-size: 18px; font-weight: bold;',
'color: #1a2332; font-size: 14px;',
'color: #666; font-size: 12px;',
'color: #d4af37; font-size: 14px; font-weight: bold;'
);

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 