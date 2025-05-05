/**
 * FlexPlek IQ - Smooth Scrolling
 * Handles smooth scrolling behavior for anchor links
 */

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
});

/**
 * Initialize smooth scrolling behavior for all anchor links
 */
function initSmoothScrolling() {
    // Get all anchor links that point to an ID on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    // Add click event listener to each anchor link
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // If target element exists, scroll to it
            if (targetElement) {
                // Get the header height to offset the scroll position
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate the target position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Scroll to the target position with smooth behavior
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update the URL
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Add scroll event listener for the hero scroll button
    const heroScroll = document.querySelector('.hero__scroll');
    
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            // Find the next section after the hero
            const hero = document.querySelector('.hero');
            const nextSection = hero.nextElementSibling;
            
            if (nextSection) {
                // Get the header height to offset the scroll position
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate the target position with offset
                const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Scroll to the target position with smooth behavior
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Handle initial page load with hash in URL
    if (window.location.hash) {
        // Delay the scroll to ensure all content is loaded
        setTimeout(function() {
            const targetElement = document.querySelector(window.location.hash);
            
            if (targetElement) {
                // Get the header height to offset the scroll position
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate the target position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Scroll to the target position
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'auto'
                });
            }
        }, 100);
    }
}