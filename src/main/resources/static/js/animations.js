const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `fadeIn 0.6s ease-out`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/**
 * Attach intersection observer scroll animations to cards across the page.
 */
function addScrollAnimations() {
    document.querySelectorAll('.artefact-card, .event-card, .dashboard-card, .floor-card').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Stagger child element animations with a sequential delay.
 *
 * @param {HTMLElement} parent Parent element
 * @param {number} delay Delay between items in seconds
 */
function staggerChildren(parent, delay = 0.1) {
    const children = parent.querySelectorAll('> *');
    children.forEach((child, index) => {
        child.style.animationDelay = `${delay * index}s`;
        child.style.animation = 'slideInLeft 0.6s ease-out forwards';
    });
}

/**
 * Apply subtle parallax scrolling to marked background elements.
 */
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = window.scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Add a ripple click effect to a specific element.
 *
 * @param {HTMLElement} element Target clickable element
 */
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
}

/**
 * Initialize ripple click animations on all button elements.
 */
function initializeRippleEffects() {
    document.querySelectorAll('.btn').forEach(button => {
        addRippleEffect(button);
    });
}

/**
 * Smoothly scroll the viewport to a target element id.
 *
 * @param {string} elementId DOM element id
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Animate a numeric value increasing from 0 up to a target number.
 *
 * @param {HTMLElement} element Target counter element
 * @param {number} target Final numeric value
 * @param {number} duration Animation duration in milliseconds
 */
function animateCountUp(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

/**
 * Generate skeleton placeholder HTML cards for content loading states.
 *
 * @param {number} count Number of skeleton cards to render
 * @return {string} HTML string of skeleton cards
 */
function createLoadingSkeleton(count = 6) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="artefact-card" style="pointer-events:none;">
                <div class="skeleton-loader" style="height:200px;"></div>
                <div style="padding:12px;">
                    <div class="skeleton-loader" style="height:20px; margin-bottom:10px;"></div>
                    <div class="skeleton-loader" style="height:16px; margin-bottom:10px;"></div>
                    <div class="skeleton-loader" style="height:14px;"></div>
                </div>
            </div>
        `;
    }
    return html;
}

/**
 * Render loading skeleton placeholders into a target container.
 *
 * @param {HTMLElement} container Parent DOM container
 */
function showLoadingSkeleton(container) {
    container.innerHTML = createLoadingSkeleton(6);
}

/**
 * Register global keyboard accessibility shortcuts.
 */
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchBox = document.getElementById('searchInput');
            if (searchBox) searchBox.focus();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }

        if (e.key === 'Escape') {
            closeModal({ target: { id: 'artefactModal' } });
        }
    });
}

/**
 * Initialize animation listeners on DOM content loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    addScrollAnimations();
    addParallaxEffect();
    initializeRippleEffects();
    addKeyboardShortcuts();

    window.addEventListener('load', () => {
        document.querySelectorAll('[data-loader]').forEach(el => {
            el.classList.remove('loading');
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
