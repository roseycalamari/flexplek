# FlexPlek IQ - Premium Coworking Space Website

A complete, responsive website for FlexPlek IQ coworking spaces in Beverwijk, Netherlands. The site features a modern, mobile-first design with comprehensive information about the coworking space offerings and services.

## Features

- **Mobile-first responsive design** - Optimized for all device sizes
- **Bilingual support** - Complete Dutch and English versions
- **Interactive kickback calculator** - Dynamic calculation of member returns
- **Real-time room booking system** - With Stripe payment integration
- **Interactive map** - Google Maps integration for location
- **Scroll animations** - Enhanced user experience with subtle animations
- **Modular architecture** - Clean separation of concerns for easy maintenance

## Project Structure

```
flexplekiq-website/
│
├── index.html          # Dutch version (default)
├── en/
│   └── index.html      # English version
│
├── assets/
│   ├── css/
│   │   ├── reset.css   # CSS reset
│   │   ├── style.css   # Main stylesheet
│   │   └── mobile.css  # Mobile-specific styles
│   │
│   ├── js/
│   │   ├── main.js     # Main JavaScript file
│   │   ├── calculator.js # Kickback calculator functionality
│   │   ├── booking.js  # Room booking functionality
│   │   ├── translate.js # Translation functionality
│   │   └── scroll.js   # Scroll animations
│   │
│   ├── img/
│   │   ├── logo.svg    # Logo placeholder
│   │   ├── hero-bg.jpg # Hero background placeholder
│   │   ├── icons/      # SVG icons
│   │   └── partners/   # Partner logos placeholder
│   │
│   └── fonts/         # Custom fonts if needed
│
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- A web server to host the files (for local development, you can use tools like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code)
- For payment processing: Stripe account with API keys

### Installation

1. Clone or download this repository to your local machine or web server
2. Modify placeholder content with your actual content
3. Update API keys:
   - Replace `YOUR_API_KEY` in the Google Maps script tag with your actual Google Maps API key
   - Replace `YOUR_PUBLISHABLE_KEY` in the booking.js file with your Stripe publishable key

### Customization

#### Images
- Replace placeholder images in the `assets/img/` directory with your actual images
- Recommended hero image size: 1920×1080px for optimal display across devices
- Optimize images for web use to maintain performance

#### Content
- Update text content in both Dutch and English versions
- Modify room details, pricing, and kickback percentages to match your actual offerings
- Add actual partner information and logos

#### Styling
- The color scheme can be modified by changing the CSS variables in the `:root` section of style.css
- Custom fonts can be added to the `assets/fonts/` directory and referenced in the CSS

## Room Booking System Setup

To fully implement the room booking system with Stripe:

1. Create a backend service to handle booking requests (not included in this repository)
2. Implement the following API endpoints:
   - `/api/check-availability` - To get real room availability data
   - `/api/create-booking` - To create new bookings
   - `/create-checkout-session` - To initialize Stripe payment sessions

3. Update the booking.js file to communicate with your backend APIs
4. Uncomment and complete the Stripe integration code in booking.js

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Optimization

For production deployment, consider:

1. Minifying CSS and JavaScript files
2. Implementing browser caching
3. Using a CDN for asset delivery
4. Implementing lazy loading for images
5. Compressing images further

## Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [BEM Methodology](https://getbem.com/) - Used for CSS class naming
- [Font Awesome Icons](https://fontawesome.com/) - Used for UI icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for the icon set
- Google Fonts for typography
- Stripe for payment processing capabilities