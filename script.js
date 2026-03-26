document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggling Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) {
        console.warn('localStorage is not available: ', e);
    }
    
    let prefersDark = false;
    try {
        prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
        console.warn('matchMedia is not available: ', e);
    }

    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        htmlEl.setAttribute('data-theme', 'dark');
    } else {
        htmlEl.setAttribute('data-theme', 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.warn('localStorage is not available: ', e);
        }
    });

    // 2. Premium Reveal Observer (Blur + FadeUp)
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // trigger slightly before it hits bottom
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-blur');
    revealElements.forEach(el => revealObserver.observe(el));


    // 3. Dynamic Timeline Scroll Progress
    const timelineContainer = document.getElementById('timeline');
    const progressFill = document.getElementById('progress-line');

    const updateScrollProgress = () => {
        if (!timelineContainer || !progressFill) return;

        const rect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Map the scroll relative to the center of the viewport
        const viewportCenter = windowHeight / 2;
        
        // Progress calculates how far the timeline elements have moved past the center line.
        let progress = (viewportCenter - rect.top) / (rect.height - 100); 

        // If user scrolled to the absolute bottom of the page, guarantee 100% closure.
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
            progress = 1;
        }

        let progressPercentage = Math.max(0, Math.min(100, progress * 100));
        
        progressFill.style.height = `${progressPercentage}%`;
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrollProgress);
    });
    
    // Initial call
    updateScrollProgress();
});
