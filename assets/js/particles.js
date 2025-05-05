/**
 * FlexPlek IQ - Advanced Particle System
 * 
 * Creates sophisticated interactive particle backgrounds:
 * - High-performance canvas-based rendering engine
 * - Responsive particle density and behavior
 * - Theme-aware coloring and rendering
 * - Interactive mouse effects with physics simulation
 * - Optimized for all devices including mobile
 */

// Define ParticleSystem namespace
const ParticleSystem = {};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ParticleSystem.init();
});

/**
 * Initialize the particle system
 */
ParticleSystem.init = function() {
    // Identify sections for particle effects - removing hero to fix bg image issue
    this.sectionsWithParticles = [
        // { selector: '.hero', config: 'hero' }, // Commented out to fix hero background image issues
        { selector: '.kickback', config: 'subtle' },
        { selector: '.contact', config: 'minimal' }
    ];
    
    // Cache DOM references for sections
    this.sections = this.sectionsWithParticles.map(section => {
        const element = document.querySelector(section.selector);
        return { 
            element, 
            config: section.config,
            active: false,
            canvas: null,
            particles: [],
            ctx: null,
            animationFrame: null,
            bounds: null
        };
    }).filter(section => section.element !== null);
    
    // Set up configuration presets
    this.configPresets = {
        hero: {
            particleCount: this.isReducedMotion() ? 20 : 80,
            colorArray: ['#1eaa5d', '#24e575', '#ffffff'],
            opacity: { min: 0.1, max: 0.5 },
            size: { min: 1, max: 5 },
            speed: { min: 0.1, max: 0.5 },
            connectParticles: true,
            connectDistance: 120,
            lineOpacity: 0.15,
            mouseEffect: 'attract',
            mouseRadius: 120,
            responsive: true
        },
        subtle: {
            particleCount: this.isReducedMotion() ? 10 : 40,
            colorArray: ['#1eaa5d', '#ffffff'],
            opacity: { min: 0.05, max: 0.15 },
            size: { min: 1, max: 3 },
            speed: { min: 0.05, max: 0.2 },
            connectParticles: true,
            connectDistance: 80,
            lineOpacity: 0.08,
            mouseEffect: 'repel',
            mouseRadius: 100,
            responsive: true
        },
        minimal: {
            particleCount: this.isReducedMotion() ? 5 : 20,
            colorArray: ['#1eaa5d'],
            opacity: { min: 0.03, max: 0.1 },
            size: { min: 1, max: 2 },
            speed: { min: 0.03, max: 0.1 },
            connectParticles: false,
            responsive: true
        }
    };
    
    // Check if reduced motion is preferred
    if (this.isReducedMotion()) {
        this.adjustForReducedMotion();
    }
    
    // Initialize each section with particles if visible
    this.initSections();
    
    // Set up event listeners
    this.setupEventListeners();
};

/**
 * Check if user prefers reduced motion
 */
ParticleSystem.isReducedMotion = function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Adjust configurations for reduced motion preference
 */
ParticleSystem.adjustForReducedMotion = function() {
    // Reduce animation intensity for all presets
    Object.keys(this.configPresets).forEach(preset => {
        const config = this.configPresets[preset];
        config.particleCount = Math.max(5, Math.floor(config.particleCount * 0.3));
        config.speed.min = Math.min(0.03, config.speed.min * 0.5);
        config.speed.max = Math.min(0.05, config.speed.max * 0.5);
        config.connectParticles = false;
    });
};

/**
 * Initialize particle sections
 */
ParticleSystem.initSections = function() {
    // Process each section
    this.sections.forEach(section => {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        
        // Position the canvas
        Object.assign(canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '0'
        });
        
        // Make sure target element has position relative
        if (getComputedStyle(section.element).position === 'static') {
            section.element.style.position = 'relative';
        }
        
        // Add canvas to section
        section.element.prepend(canvas);
        
        // Store canvas reference
        section.canvas = canvas;
        
        // Get context and initialize particles if section is visible
        section.ctx = canvas.getContext('2d');
        
        // Check if section is currently visible
        const isVisible = this.isElementInViewport(section.element);
        
        if (isVisible) {
            this.initializeParticles(section);
        }
    });
};

/**
 * Set up global event listeners
 */
ParticleSystem.setupEventListeners = function() {
    // Handle scroll to activate/deactivate sections
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Handle resize to adjust canvas dimensions
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    
    // Handle mouse movement for interactive effects
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    
    // Handle device orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(this.handleResize.bind(this), 300);
    }, { passive: true });
    
    // Check for dark mode changes
    if (window.matchMedia) {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', this.handleColorSchemeChange.bind(this));
    }
    
    // Initial scroll check to activate visible sections
    this.handleScroll();
};

/**
 * Handle scroll events
 */
ParticleSystem.handleScroll = function() {
    // Use requestAnimationFrame for performance
    if (!this.scrollRAF) {
        this.scrollRAF = requestAnimationFrame(() => {
            this.sections.forEach(section => {
                const visible = this.isElementInViewport(section.element);
                
                if (visible && !section.active) {
                    // Section just became visible
                    this.activateParticles(section);
                } else if (!visible && section.active) {
                    // Section just became invisible
                    this.deactivateParticles(section);
                }
            });
            
            this.scrollRAF = null;
        });
    }
};

/**
 * Handle window resize
 */
ParticleSystem.handleResize = function() {
    // Use requestAnimationFrame for performance
    if (!this.resizeRAF) {
        this.resizeRAF = requestAnimationFrame(() => {
            this.sections.forEach(section => {
                if (section.active) {
                    this.resizeCanvas(section);
                }
            });
            
            this.resizeRAF = null;
        });
    }
};

/**
 * Handle mouse movement for interactive effects
 */
ParticleSystem.handleMouseMove = function(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    this.sections.forEach(section => {
        if (!section.active) return;
        
        // Convert to canvas coordinates
        const bounds = section.bounds;
        if (!bounds) return;
        
        // Check if mouse is within this section
        if (mouseX >= bounds.left && mouseX <= bounds.right && 
            mouseY >= bounds.top && mouseY <= bounds.bottom) {
            
            // Set mouse position relative to section
            section.mouseX = mouseX - bounds.left;
            section.mouseY = mouseY - bounds.top;
        } else {
            // Mouse outside section
            section.mouseX = null;
            section.mouseY = null;
        }
    });
};

/**
 * Handle color scheme (dark/light) changes
 */
ParticleSystem.handleColorSchemeChange = function() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Update particle colors based on scheme
    this.sections.forEach(section => {
        if (!section.active) return;
        
        // Adjust particle colors
        this.updateParticleColors(section, isDarkMode);
    });
};

/**
 * Update particle colors based on color scheme
 */
ParticleSystem.updateParticleColors = function(section, isDarkMode) {
    const config = this.configPresets[section.config];
    
    // Update colors for light/dark mode
    if (isDarkMode) {
        // Increase opacity for dark mode
        section.particles.forEach(particle => {
            particle.baseOpacity *= 1.5;
            particle.opacity = particle.baseOpacity;
        });
    } else {
        // Reset to original opacity
        section.particles.forEach(particle => {
            particle.opacity = particle.baseOpacity;
        });
    }
};

/**
 * Check if element is in viewport
 */
ParticleSystem.isElementInViewport = function(el) {
    const rect = el.getBoundingClientRect();
    
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    );
};

/**
 * Initialize particles for a section
 */
ParticleSystem.initializeParticles = function(section) {
    // Resize canvas to match container
    this.resizeCanvas(section);
    
    // Get config for this section
    const config = this.configPresets[section.config];
    
    // Create particles
    section.particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        section.particles.push(this.createParticle(section, config));
    }
    
    // Set section as active
    section.active = true;
    
    // Start animation loop
    this.animateParticles(section);
};

/**
 * Create a new particle
 */
ParticleSystem.createParticle = function(section, config) {
    // Random size within range
    const size = Math.random() * (config.size.max - config.size.min) + config.size.min;
    
    // Random opacity within range
    const opacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min;
    
    // Random speed within range
    const speed = {
        x: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
        y: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min
    };
    
    // Random color from array
    const color = config.colorArray[Math.floor(Math.random() * config.colorArray.length)];
    
    // Create particle
    return {
        x: Math.random() * section.canvas.width,
        y: Math.random() * section.canvas.height,
        size: size,
        baseSize: size,
        color: color,
        speed: speed,
        opacity: opacity,
        baseOpacity: opacity,
        directionAngle: Math.random() * Math.PI * 2
    };
};

/**
 * Activate particles for a section
 */
ParticleSystem.activateParticles = function(section) {
    if (section.active) return;
    
    // Initialize particles
    this.initializeParticles(section);
};

/**
 * Deactivate particles for a section
 */
ParticleSystem.deactivateParticles = function(section) {
    if (!section.active) return;
    
    // Cancel animation frame
    if (section.animationFrame) {
        cancelAnimationFrame(section.animationFrame);
        section.animationFrame = null;
    }
    
    // Clear canvas
    if (section.ctx && section.canvas) {
        section.ctx.clearRect(0, 0, section.canvas.width, section.canvas.height);
    }
    
    // Set as inactive
    section.active = false;
};

/**
 * Resize canvas to match container
 */
ParticleSystem.resizeCanvas = function(section) {
    const { canvas, element } = section;
    if (!canvas || !element) return;
    
    // Get element dimensions
    const rect = element.getBoundingClientRect();
    section.bounds = rect;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Scale context to account for high pixel density displays
    const ctx = section.ctx;
    ctx.scale(dpr, dpr);
    
    // Recalculate particle positions if existing
    if (section.particles && section.particles.length) {
        section.particles.forEach(particle => {
            // Keep particles within new bounds
            particle.x = Math.min(particle.x, rect.width);
            particle.y = Math.min(particle.y, rect.height);
        });
    }
};

/**
 * Animate particles for a section
 */
ParticleSystem.animateParticles = function(section) {
    const { ctx, canvas, particles } = section;
    if (!ctx || !canvas || !particles || !section.active) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
    
    // Get config for this section
    const config = this.configPresets[section.config];
    
    // Update and draw particles
    particles.forEach((particle, index) => {
        // Apply mouse interaction if applicable
        if (config.mouseEffect && section.mouseX !== null && section.mouseY !== null) {
            this.applyMouseEffect(particle, section, config);
        }
        
        // Update position
        particle.x += particle.speed.x;
        particle.y += particle.speed.y;
        
        // Check boundaries - wrap around
        const width = canvas.width / devicePixelRatio;
        const height = canvas.height / devicePixelRatio;
        
        if (particle.x < 0) {
            particle.x = width;
        } else if (particle.x > width) {
            particle.x = 0;
        }
        
        if (particle.y < 0) {
            particle.y = height;
        } else if (particle.y > height) {
            particle.y = 0;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = this.hexToRgba(particle.color, particle.opacity);
        ctx.fill();
        
        // Connect particles if enabled
        if (config.connectParticles) {
            this.connectParticles(particle, particles, index, section, config);
        }
    });
    
    // Continue animation loop
    section.animationFrame = requestAnimationFrame(() => {
        this.animateParticles(section);
    });
};

/**
 * Apply mouse interaction to particle
 */
ParticleSystem.applyMouseEffect = function(particle, section, config) {
    const { mouseX, mouseY } = section;
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only apply effect when mouse is within radius
    if (distance < config.mouseRadius) {
        const force = (config.mouseRadius - distance) / config.mouseRadius;
        
        if (config.mouseEffect === 'attract') {
            // Attract towards mouse
            particle.x -= dx * force * 0.03;
            particle.y -= dy * force * 0.03;
        } else if (config.mouseEffect === 'repel') {
            // Repel from mouse
            particle.x += dx * force * 0.05;
            particle.y += dy * force * 0.05;
        }
    }
};

/**
 * Connect particles with lines
 */
ParticleSystem.connectParticles = function(p1, particles, index, section, config) {
    const ctx = section.ctx;
    
    for (let i = index + 1; i < particles.length; i++) {
        const p2 = particles[i];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.connectDistance) {
            // Calculate opacity based on distance
            const opacity = (1 - distance / config.connectDistance) * config.lineOpacity;
            
            // Draw connecting line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = this.hexToRgba(p1.color, opacity);
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
};

/**
 * Convert hex color to rgba
 */
ParticleSystem.hexToRgba = function(hex, opacity) {
    let r, g, b;
    
    // Handle shorthand hex
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Export the ParticleSystem to window for access from other scripts
window.ParticleSystem = ParticleSystem;