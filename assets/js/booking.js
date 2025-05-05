/**
 * FlexPlek IQ - Room Booking System
 * Handles the room booking functionality for both Dutch and English versions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const bookingRooms = document.querySelectorAll('.booking__room');
    const bookingSteps = document.querySelectorAll('.booking__step');
    const bookingAvailability = document.querySelector('.booking__availability');
    const bookingDateInput = document.getElementById('booking-date');
    const bookingTimeSlots = document.querySelector('.booking__time-slots');
    const prevButton = document.querySelector('.booking__btn--secondary');
    const nextButton = document.querySelector('.booking__btn:not(.booking__btn--secondary)');
    
    let selectedRoom = null;
    let selectedDate = null;
    let selectedTimeSlot = null;
    
    // Detect language
    const isEnglish = document.documentElement.lang === 'en';
    
    // Set button text based on language
    if (isEnglish) {
        nextButton.textContent = 'Next';
    } else {
        nextButton.textContent = 'Volgende';
    }
    
    // Initialize date picker with today's date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    bookingDateInput.min = formattedDate; // Can't book dates in the past
    bookingDateInput.value = formattedDate;
    selectedDate = formattedDate;
    
    // Generate initial time slots
    generateTimeSlots();
    
    // Room Selection
    bookingRooms.forEach(room => {
        room.addEventListener('click', function() {
            // Remove selected class from all rooms
            bookingRooms.forEach(r => r.classList.remove('booking__room--selected'));
            
            // Add selected class to clicked room
            this.classList.add('booking__room--selected');
            selectedRoom = this.dataset.room;
            
            // Enable next button
            nextButton.disabled = false;
        });
    });
    
    // Date Selection
    bookingDateInput.addEventListener('change', function() {
        selectedDate = this.value;
        generateTimeSlots();
    });
    
    // Generate time slots
    function generateTimeSlots() {
        if (!selectedDate) return;

        // Clear existing time slots
        bookingTimeSlots.innerHTML = '';

        // Create time slots container
        const timeSlotsContainer = document.createElement('div');
        timeSlotsContainer.className = 'booking__time-slots-container';
        
        // Add time slots header
        const timeSlotHeader = document.createElement('div');
        timeSlotHeader.className = 'booking__time-slots-header';
        timeSlotHeader.innerHTML = `
            <span>${isEnglish ? 'Available Time Slots' : 'Beschikbare Tijdslots'}</span>
            <span class="booking__duration-info">${isEnglish ? 'Select multiple hours by clicking and dragging' : 'Selecteer meerdere uren door te klikken en te slepen'}</span>
        `;
        bookingTimeSlots.appendChild(timeSlotHeader);

        // Generate time slots from 8:00 to 20:00 with 1-hour slots
        for (let hour = 8; hour < 20; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'booking__time-slot';
            timeSlot.dataset.hour = hour;
            
            const formattedHour = hour.toString().padStart(2, '0');
            const nextHour = (hour + 1).toString().padStart(2, '0');
            timeSlot.textContent = `${formattedHour}:00 - ${nextHour}:00`;
            
            // Randomly mark some slots as booked (for demo)
            if (Math.random() < 0.3) {
                timeSlot.classList.add('booking__time-slot--booked');
                const bookedBadge = document.createElement('span');
                bookedBadge.className = 'booking__booked-badge';
                bookedBadge.textContent = isEnglish ? 'Booked' : 'Bezet';
                timeSlot.appendChild(bookedBadge);
            } else {
                timeSlot.addEventListener('mousedown', function(e) {
                    if (e.target.classList.contains('booking__time-slot--booked')) return;
                    
                    // Start selection
                    this.classList.add('booking__time-slot--selected');
                    let isSelecting = true;
                    let lastSelected = this;
                    
                    const handleMouseOver = (slot) => {
                        if (!isSelecting || slot.classList.contains('booking__time-slot--booked')) return;
                        
                        // Get all slots between the first selected and current
                        const startHour = parseInt(lastSelected.dataset.hour);
                        const endHour = parseInt(slot.dataset.hour);
                        const minHour = Math.min(startHour, endHour);
                        const maxHour = Math.max(startHour, endHour);
                        
                        // Update selection
                        document.querySelectorAll('.booking__time-slot').forEach(s => {
                            const hour = parseInt(s.dataset.hour);
                            if (hour >= minHour && hour <= maxHour && !s.classList.contains('booking__time-slot--booked')) {
                                s.classList.add('booking__time-slot--selected');
                            } else if (!s.classList.contains('booking__time-slot--booked')) {
                                s.classList.remove('booking__time-slot--selected');
                            }
                        });
                    };
                    
                    const handleMouseUp = () => {
                        isSelecting = false;
                        document.removeEventListener('mouseover', handleMouseOver);
                        document.removeEventListener('mouseup', handleMouseUp);
                        
                        // Update selected time slots
                        const selectedSlots = document.querySelectorAll('.booking__time-slot--selected');
                        if (selectedSlots.length > 0) {
                            const firstSlot = selectedSlots[0];
                            const lastSlot = selectedSlots[selectedSlots.length - 1];
                            const startTime = firstSlot.textContent.split(' - ')[0];
                            const endTime = lastSlot.textContent.split(' - ')[1];
                            selectedTimeSlot = `${startTime} - ${endTime}`;
                            
                            // Enable next button
                            nextButton.disabled = false;
                        }
                    };
                    
                    document.addEventListener('mouseover', (e) => {
                        if (e.target.classList.contains('booking__time-slot')) {
                            handleMouseOver(e.target);
                        }
                    });
                    
                    document.addEventListener('mouseup', handleMouseUp);
                });
            }
            
            bookingTimeSlots.appendChild(timeSlot);
        }
    }
    
    // Navigation
    nextButton.addEventListener('click', function() {
        if (selectedRoom && !bookingAvailability.classList.contains('booking__availability--active')) {
            // Move to step 2
            bookingSteps[0].classList.remove('booking__step--active');
            bookingSteps[1].classList.add('booking__step--active');
            bookingAvailability.classList.add('booking__availability--active');
            prevButton.disabled = false;
            this.textContent = isEnglish ? 'Confirm' : 'Bevestigen';
            
            // Scroll to the availability section
            bookingAvailability.scrollIntoView({ behavior: 'smooth' });
        } else if (selectedRoom && selectedDate && selectedTimeSlot) {
            // Move to step 3 - Show confirmation
            bookingSteps[1].classList.remove('booking__step--active');
            bookingSteps[2].classList.add('booking__step--active');
            
            // Create a confirmation modal/overlay
            const overlay = document.createElement('div');
            overlay.className = 'booking__overlay';
            
            const modal = document.createElement('div');
            modal.className = 'booking__confirmation-modal';
            
            const modalContent = `
                <h3>${isEnglish ? 'Confirm your booking' : 'Bevestig je boeking'}</h3>
                <div class="booking__confirmation-details">
                    <p><strong>${isEnglish ? 'Room' : 'Ruimte'}:</strong> ${getRoomNameByCode(selectedRoom)}</p>
                    <p><strong>${isEnglish ? 'Date' : 'Datum'}:</strong> ${formatDate(selectedDate)}</p>
                    <p><strong>${isEnglish ? 'Time' : 'Tijd'}:</strong> ${selectedTimeSlot}</p>
                </div>
                <div class="booking__form">
                    <div class="booking__form-field">
                        <label for="booking-name">${isEnglish ? 'Name' : 'Naam'}</label>
                        <input type="text" id="booking-name" required>
                    </div>
                    <div class="booking__form-field">
                        <label for="booking-email">Email</label>
                        <input type="email" id="booking-email" required>
                    </div>
                    <div class="booking__form-field">
                        <label for="booking-phone">${isEnglish ? 'Phone' : 'Telefoon'}</label>
                        <input type="tel" id="booking-phone">
                    </div>
                </div>
                <div class="booking__modal-actions">
                    <button class="booking__btn booking__btn--secondary booking__cancel-btn">${isEnglish ? 'Cancel' : 'Annuleren'}</button>
                    <button class="booking__btn booking__confirm-btn">${isEnglish ? 'Complete Booking' : 'Boeking Voltooien'}</button>
                </div>
            `;
            
            modal.innerHTML = modalContent;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            // Event listeners for modal buttons
            document.querySelector('.booking__cancel-btn').addEventListener('click', function() {
                overlay.remove();
            });
            
            document.querySelector('.booking__confirm-btn').addEventListener('click', function() {
                const name = document.getElementById('booking-name').value;
                const email = document.getElementById('booking-email').value;
                const phone = document.getElementById('booking-phone').value;
                
                if (!name || !email) {
                    alert(isEnglish ? 'Please fill in all required fields.' : 'Vul alstublieft alle verplichte velden in.');
                    return;
                }
                
                // Here you would send the booking data to the server
                console.log('Booking submitted:', {
                    room: selectedRoom,
                    date: selectedDate,
                    time: selectedTimeSlot,
                    name: name,
                    email: email,
                    phone: phone
                });
                
                // Show success message
                modal.innerHTML = `
                    <div class="booking__success">
                        <div class="booking__success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>${isEnglish ? 'Booking Successful!' : 'Boeking Succesvol!'}</h3>
                        <p>${isEnglish ? 'Thank you for your booking,' : 'Bedankt voor je boeking,'} ${name}. ${isEnglish ? 'We have sent a confirmation to' : 'We hebben een bevestiging gestuurd naar'} ${email}.</p>
                        <button class="booking__btn booking__close-btn">${isEnglish ? 'Close' : 'Sluiten'}</button>
                    </div>
                `;
                
                document.querySelector('.booking__close-btn').addEventListener('click', function() {
                    overlay.remove();
                    resetBookingForm();
                });
            });
        }
    });
    
    prevButton.addEventListener('click', function() {
        if (bookingAvailability.classList.contains('booking__availability--active')) {
            // Move back to step 1
            bookingSteps[1].classList.remove('booking__step--active');
            bookingSteps[0].classList.add('booking__step--active');
            bookingAvailability.classList.remove('booking__availability--active');
            this.disabled = true;
            nextButton.textContent = isEnglish ? 'Next' : 'Volgende';
        }
    });
    
    // Helper function to get room name from room code
    function getRoomNameByCode(code) {
        if (isEnglish) {
            switch(code) {
                case 'small':
                    return 'Small Meeting Room';
                case 'medium':
                    return 'Medium Meeting Room';
                case 'large':
                    return 'Large Meeting Room';
                default:
                    return 'Unknown Room';
            }
        } else {
            switch(code) {
                case 'small':
                    return 'Kleine Vergaderruimte';
                case 'medium':
                    return 'Middelgrote Vergaderruimte';
                case 'large':
                    return 'Grote Vergaderruimte';
                default:
                    return 'Onbekende Ruimte';
            }
        }
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(isEnglish ? 'en-US' : 'nl-NL', options);
    }
    
    // Reset booking form
    function resetBookingForm() {
        // Reset selected values
        selectedRoom = null;
        selectedTimeSlot = null;
        
        // Reset UI
        bookingRooms.forEach(r => r.classList.remove('booking__room--selected'));
        document.querySelectorAll('.booking__time-slot').forEach(slot => {
            slot.classList.remove('booking__time-slot--selected');
        });
        
        // Reset steps
        bookingSteps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('booking__step--active');
            } else {
                step.classList.remove('booking__step--active');
            }
        });
        
        bookingAvailability.classList.remove('booking__availability--active');
        prevButton.disabled = true;
        nextButton.disabled = true;
        nextButton.textContent = isEnglish ? 'Next' : 'Volgende';
    }
});