/**
 * FlexPlek IQ - Language Translation
 * Handles language switching functionality between Dutch and English
 */

document.addEventListener('DOMContentLoaded', function() {
    initTranslation();
});

/**
 * Initialize translation functionality
 */
function initTranslation() {
    // Get language toggle links
    const languageLinks = document.querySelectorAll('.nav__link--language');
    
    // Add click event listeners to language links
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If this is not an external link (like to a different language page)
            // we can handle translation dynamically
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                toggleLanguage();
            }
            // Otherwise, let the link navigate to the dedicated language page
        });
    });

    // Check for language preference in local storage
    const savedLanguage = localStorage.getItem('flexplek-language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }
}

/**
 * Toggle between available languages
 */
function toggleLanguage() {
    const currentLanguage = document.documentElement.lang || 'nl';
    
    // Toggle between Dutch and English
    const newLanguage = currentLanguage === 'nl' ? 'en' : 'nl';
    
    // Update the language
    setLanguage(newLanguage);
}

/**
 * Set the site language and update content
 * 
 * @param {string} language - Language code ('nl' or 'en')
 */
function setLanguage(language) {
    // Set the HTML lang attribute
    document.documentElement.lang = language;
    
    // Save preference to local storage
    localStorage.setItem('flexplek-language', language);
    
    // Update UI elements that indicate current language
    updateLanguageUI(language);
    
    // Translate content
    translateContent(language);
}

/**
 * Update UI elements that indicate the current language
 * 
 * @param {string} language - Language code ('nl' or 'en')
 */
function updateLanguageUI(language) {
    const languageLinks = document.querySelectorAll('.nav__link--language');
    
    languageLinks.forEach(link => {
        // Update text in language links
        if (link.textContent === 'EN' || link.textContent === 'NL') {
            link.textContent = language === 'nl' ? 'EN' : 'NL';
        }
    });
    
    // Update active state in footer language selector
    const footerLanguages = document.querySelectorAll('.footer__language a, .footer__language span');
    
    footerLanguages.forEach(item => {
        if (item.tagName === 'A') {
            item.classList.remove('active');
            if ((language === 'nl' && item.textContent.trim() === 'English') ||
                (language === 'en' && item.textContent.trim() === 'Nederlands')) {
                item.classList.add('active');
            }
        } else if (item.tagName === 'SPAN') {
            item.classList.remove('active');
            if ((language === 'nl' && item.textContent.trim() === 'Nederlands') ||
                (language === 'en' && item.textContent.trim() === 'English')) {
                item.classList.add('active');
            }
        }
    });
}

/**
 * Translate page content based on selected language
 * 
 * @param {string} language - Language code ('nl' or 'en')
 */
function translateContent(language) {
    // Translation object - Contains all translatable text
    // In a production environment, this would be loaded from a separate file
    // or fetched from a translation service
    const translations = {
        // Navigation
        'nav.offerings': {
            nl: 'Ons Aanbod',
            en: 'Our Offerings'
        },
        'nav.kickback': {
            nl: 'Kickback Programma',
            en: 'Kickback Program'
        },
        'nav.booking': {
            nl: 'Boekingen',
            en: 'Bookings'
        },
        'nav.hours': {
            nl: 'Openingstijden',
            en: 'Opening Hours'
        },
        'nav.partners': {
            nl: 'Partners',
            en: 'Partners'
        },
        'nav.contact': {
            nl: 'Contact',
            en: 'Contact'
        },
        
        // Hero
        'hero.subtitle': {
            nl: 'Premium Coworking Space in Beverwijk',
            en: 'Premium Coworking Space in Beverwijk'
        },
        'hero.cta.discover': {
            nl: 'Ontdek Ons Aanbod',
            en: 'Discover Our Offerings'
        },
        'hero.cta.contact': {
            nl: 'Neem Contact Op',
            en: 'Contact Us'
        },
        
        // Offerings
        'offerings.title': {
            nl: 'Ons Aanbod',
            en: 'Our Offerings'
        },
        'offerings.flexDesk.title': {
            nl: 'Flexibele Werkplekken',
            en: 'Flexible Workspaces'
        },
        'offerings.privateOffice.title': {
            nl: 'Privékantoren',
            en: 'Private Offices'
        },
        'offerings.meetingRooms.title': {
            nl: 'Vergaderruimtes',
            en: 'Meeting Rooms'
        },
        'offerings.gym.title': {
            nl: 'Fitnessruimte',
            en: 'Fitness Room'
        },
        'offerings.bar.title': {
            nl: 'Bar & Lounge',
            en: 'Bar & Lounge'
        },
        'offerings.terrace.title': {
            nl: 'Buitenterras',
            en: 'Outdoor Terrace'
        },
        'offerings.more': {
            nl: 'Meer Info',
            en: 'More Info'
        },
        
        // Kickback Program
        'kickback.title': {
            nl: 'Kickback Programma',
            en: 'Kickback Program'
        },
        'kickback.subtitle': {
            nl: 'Uniek Concept in Nederland',
            en: 'Unique Concept in The Netherlands'
        },
        'kickback.how.title': {
            nl: 'Hoe Het Werkt',
            en: 'How It Works'
        },
        'kickback.calculator.title': {
            nl: 'Bereken Je Rendement',
            en: 'Calculate Your Return'
        },
        'kickback.calculator.revenue': {
            nl: 'Maandelijkse Inkomsten (€)',
            en: 'Monthly Revenue (€)'
        },
        'kickback.calculator.baseCosts': {
            nl: 'Basiskosten',
            en: 'Base Costs'
        },
        'kickback.calculator.excess': {
            nl: 'Overtollig Bedrag',
            en: 'Excess Amount'
        },
        'kickback.calculator.yourKickback': {
            nl: 'Jouw Kickback (50%)',
            en: 'Your Kickback (50%)'
        },
        'kickback.calculator.annual': {
            nl: 'Jaarlijks Rendement',
            en: 'Annual Return'
        },
        'kickback.benefits.title': {
            nl: 'Ledenvoordelen',
            en: 'Member Benefits'
        },
        
        // Booking Section
        'booking.title': {
            nl: 'Boekingsopties',
            en: 'Booking Options'
        },
        'booking.membership.title': {
            nl: 'Maandelijks Lidmaatschap',
            en: 'Monthly Membership'
        },
        'booking.membership.cta': {
            nl: 'Informatie Aanvragen',
            en: 'Request Information'
        },
        'booking.meeting.title': {
            nl: 'Vergaderruimte Boekingen',
            en: 'Meeting Room Bookings'
        },
        'booking.meeting.cta': {
            nl: 'Nu Boeken',
            en: 'Book Now'
        },
        'booking.availability.title': {
            nl: 'Live Beschikbaarheid Vergaderruimtes',
            en: 'Live Meeting Room Availability'
        },
        'booking.date': {
            nl: 'Selecteer Datum:',
            en: 'Select Date:'
        },
        'booking.room.small': {
            nl: 'Kleine Vergaderruimte',
            en: 'Small Meeting Room'
        },
        'booking.room.large': {
            nl: 'Grote Vergaderruimte',
            en: 'Large Meeting Room'
        },
        'booking.capacity': {
            nl: 'Capaciteit:',
            en: 'Capacity:'
        },
        'booking.people': {
            nl: 'personen',
            en: 'people'
        },
        'booking.price': {
            nl: '/uur (€1/uur voor leden)',
            en: '/hour (€1/hour for members)'
        },
        'booking.unavailable': {
            nl: 'Geen ruimtes beschikbaar op weekenden',
            en: 'No rooms available on weekends'
        },
        
        // Hours Section
        'hours.title': {
            nl: 'Openingstijden',
            en: 'Opening Hours'
        },
        'hours.weekdays': {
            nl: 'Maandag - Vrijdag',
            en: 'Monday - Friday'
        },
        'hours.saturday': {
            nl: 'Zaterdag',
            en: 'Saturday'
        },
        'hours.sunday': {
            nl: 'Zondag',
            en: 'Sunday'
        },
        'hours.closed': {
            nl: 'Gesloten',
            en: 'Closed'
        },
        'hours.wifi': {
            nl: '24/7 WiFi Toegang',
            en: '24/7 WiFi Access'
        },
        'hours.key': {
            nl: 'Sleuteltoegang Voor Leden',
            en: 'Key Access For Members'
        },
        'hours.coffee': {
            nl: 'Koffiebar: 8:00-18:00',
            en: 'Coffee Bar: 8:00-18:00'
        },
        'hours.online': {
            nl: 'Online Boeken Beschikbaar',
            en: 'Online Booking Available'
        },
        'hours.note': {
            nl: 'Vergaderruimtes kunnen worden geboekt tijdens openingstijden.',
            en: 'Meeting rooms can be booked during opening hours.'
        },
        'hours.check': {
            nl: 'Beschikbaarheid Controleren',
            en: 'Check Availability'
        },
        
        // Partners Section
        'partners.title': {
            nl: 'Onze Partners',
            en: 'Our Partners'
        },
        'partners.intro': {
            nl: 'Ontdek de innovatieve bedrijven die deel uitmaken van onze FlexPlek IQ community.',
            en: 'Discover the innovative companies that are part of our FlexPlek IQ community.'
        },
        'partners.visit': {
            nl: 'Bezoek Website',
            en: 'Visit Website'
        },
        'partners.cta.text': {
            nl: 'Interesse om jouw bedrijf toe te voegen aan onze community?',
            en: 'Interested in adding your company to our community?'
        },
        'partners.cta.button': {
            nl: 'Neem Contact Op',
            en: 'Contact Us'
        },
        
        // Contact Section
        'contact.title': {
            nl: 'Contact',
            en: 'Contact'
        },
        'contact.visit': {
            nl: 'Bezoek Ons',
            en: 'Visit Us'
        },
        'contact.email': {
            nl: 'E-mail',
            en: 'Email'
        },
        
        // Footer
        'footer.navigation': {
            nl: 'Navigatie',
            en: 'Navigation'
        },
        'footer.contact': {
            nl: 'Contact',
            en: 'Contact'
        },
        'footer.follow': {
            nl: 'Volg Ons',
            en: 'Follow Us'
        },
        'footer.copyright': {
            nl: 'Alle rechten voorbehouden.',
            en: 'All rights reserved.'
        },
        'footer.lang.nl': {
            nl: 'Nederlands',
            en: 'Dutch'
        },
        'footer.lang.en': {
            nl: 'Engels',
            en: 'English'
        }
    };
    
    // Get all elements with data-translate attribute
    const translatableElements = document.querySelectorAll('[data-translate]');
    
    // Translate each element
    translatableElements.forEach(element => {
        const translationKey = element.getAttribute('data-translate');
        
        if (translations[translationKey] && translations[translationKey][language]) {
            element.textContent = translations[translationKey][language];
        }
    });
}

/**
 * For production use: More sophisticated translation implementation
 * 
 * This function demonstrates how you might implement a more robust translation
 * system for larger projects with many translatable elements and languages.
 */
function enhancedTranslationSystem() {
    // This is a placeholder showing what a more advanced implementation might include
    
    /*
    // 1. Fetch translations from a JSON file or API
    async function fetchTranslations(language) {
        try {
            const response = await fetch(`/assets/lang/${language}.json`);
            return await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            return {};
        }
    }
    
    // 2. Apply translations using a recursive function that can handle nested objects
    function applyTranslation(element, translations, prefix = '') {
        // Process element's own translation
        const key = element.getAttribute('data-translate');
        if (key) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const translation = getNestedValue(translations, fullKey);
            
            if (translation) {
                // Handle different translation types (text, attributes, etc.)
                if (typeof translation === 'string') {
                    element.textContent = translation;
                } else if (typeof translation === 'object') {
                    // Handle attributes
                    if (translation.attributes) {
                        Object.entries(translation.attributes).forEach(([attr, value]) => {
                            element.setAttribute(attr, value);
                        });
                    }
                    
                    // Handle text content
                    if (translation.text) {
                        element.textContent = translation.text;
                    }
                    
                    // Handle HTML content
                    if (translation.html) {
                        element.innerHTML = translation.html;
                    }
                }
            }
        }
        
        // Process children
        Array.from(element.children).forEach(child => {
            applyTranslation(child, translations, prefix || key);
        });
    }
    
    // Helper to get nested values from an object using dot notation
    function getNestedValue(obj, path) {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null
        }, obj);
    }
    
    // 3. Support for dynamic content translation
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        applyTranslation(node, currentTranslations);
                    }
                });
            }
        });
    });
    
    // 4. Initialize enhanced translation system
    async function initEnhancedTranslation() {
        const language = localStorage.getItem('language') || 'nl';
        const translations = await fetchTranslations(language);
        
        // Store translations for later use with dynamically added content
        window.currentTranslations = translations;
        
        // Apply translations to the whole document
        applyTranslation(document.body, translations);
        
        // Start observing for dynamic content
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    */
}