/**
 * FlexPlek IQ - Main JavaScript File
 * Minimalist version to fix loading issues
 */

// Implement emergency loop detection and prevention
(function() {
    // Track page loads
    let pageLoadCount = parseInt(sessionStorage.getItem('pageLoadCount') || '0');
    let lastLoadTime = parseInt(sessionStorage.getItem('lastLoadTime') || '0');
    const now = Date.now();
    
    // If we've loaded the page multiple times very quickly, we're in a loop
    if (now - lastLoadTime < 2000) {
        pageLoadCount++;
        
        if (pageLoadCount > 3) {
            // We're likely in a loop - force clear URL without hash
            window.stop(); // Stop all loading
            console.error('Detected page reload loop, breaking out');
            
            // Clear any hash from URL safely
            if (window.location.hash) {
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
            
            // Reset counters
            sessionStorage.setItem('pageLoadCount', '0');
            sessionStorage.setItem('lastLoadTime', now.toString());
            
            // Continue with normal page load
            return;
        }
    } else {
        // Normal page load, reset counter
        pageLoadCount = 1;
    }
    
    // Update storage
    sessionStorage.setItem('pageLoadCount', pageLoadCount.toString());
    sessionStorage.setItem('lastLoadTime', now.toString());
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in copyright
    setCurrentYear();
    
    // Initialize mobile menu with simplified approach
    initMobileMenu();
    
    // Simple header scroll effect without complex calculations
    initBasicHeaderScroll();
    
    // Add popstate handling to fix potential navigation loops
    initPopStateHandling();
    
    // Initialize pricing toggle buttons
    initPricingButtons();
});

/**
 * Set current year in copyright notices
 */
function setCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Initialize mobile menu with basic functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobileNav');
    const navOverlay = document.getElementById('navOverlay');
    const navClose = document.querySelector('.nav__close');
    
    // Skip if any element is missing
    if (!menuToggle || !mobileNav || !navOverlay) {
        console.error('Mobile menu elements missing');
        return;
    }
    
    // Toggle menu on burger icon click
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu on overlay click
    navOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    // Close menu on close button click
    if (navClose) {
        navClose.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Close menu when links are clicked
    const mobileNavLinks = document.querySelectorAll('.nav--mobile .nav__link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

/**
 * Basic header scroll effect - simplified to avoid performance issues
 */
function initBasicHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    // Use a variable to track if we're currently updating the header
    let isUpdating = false;
    
    // We'll use requestAnimationFrame for better performance
    let lastScrollPosition = window.pageYOffset;
    
    // Simple scroll handler with debounce-like functionality
    window.addEventListener('scroll', function() {
        if (isUpdating) return;
        
        isUpdating = true;
        
        // Use requestAnimationFrame to optimize performance
        window.requestAnimationFrame(function() {
            const currentScrollPosition = window.pageYOffset;
            
            if (currentScrollPosition > 150) {
                if (currentScrollPosition > lastScrollPosition) {
                    // Scrolling down - hide header
                    header.classList.add('header--hidden');
                } else {
                    // Scrolling up - show header
                    header.classList.remove('header--hidden');
                }
                header.classList.add('scrolled');
            } else if (currentScrollPosition > 50) {
                header.classList.add('scrolled');
                header.classList.remove('header--hidden');
            } else {
                header.classList.remove('scrolled');
                header.classList.remove('header--hidden');
            }
            
            lastScrollPosition = currentScrollPosition;
            isUpdating = false;
        });
    }, { passive: true });
}

/**
 * Handle browser navigation events to prevent loops
 */
function initPopStateHandling() {
    // Counter to prevent infinite loops with popstate events
    let popStateCounter = 0;
    
    // Handle popstate (back/forward browser navigation)
    window.addEventListener('popstate', function(e) {
        // Prevent potential infinite loops by limiting consecutive popstate events
        popStateCounter++;
        
        if (popStateCounter > 5) {
            console.warn('Too many consecutive popstate events, potentially a loop');
            popStateCounter = 0;
            return;
        }
        
        // Reset counter after a short delay if no further events
        setTimeout(() => {
            popStateCounter = 0;
        }, 500);
    });
}

/**
 * Initialize pricing buttons for service cards
 */
function initPricingButtons() {
    const pricingButtons = document.querySelectorAll('.pricing-btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the related pricing content
            const pricingContent = this.nextElementSibling;
            
            // Toggle active class
            pricingContent.classList.toggle('active');
            
            // Update button text
            if (pricingContent.classList.contains('active')) {
                // If content is currently showing, we'll hide it
                this.setAttribute('data-showing', 'true');
                this.textContent = this.getAttribute('data-hide-text');
            } else {
                // If content is currently hidden, we'll show it
                this.setAttribute('data-showing', 'false');
                this.textContent = this.getAttribute('data-show-text');
            }
        });
    });
}