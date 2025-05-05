document.addEventListener('DOMContentLoaded', function() {
    const occupancyMeter = {
        currentBookings: 0,
        totalCapacity: 10,
        threshold: 8,
        tables: [],
        tableStatus: ['available', 'occupied', 'reserved', 'unavailable'],
        occupancyLabels: {
            en: {
                available: 'Available',
                occupied: 'Occupied',
                reserved: 'Reserved',
                unavailable: 'Unavailable'
            },
            nl: {
                available: 'Beschikbaar',
                occupied: 'Bezet',
                reserved: 'Gereserveerd',
                unavailable: 'Niet beschikbaar'
            }
        },
        
        init: function() {
            // Detect language
            this.lang = document.documentElement.lang === 'nl' ? 'nl' : 'en';
            
            // Initialize tables data
            this.initializeTables();
            
            // Create visual table representation
            this.createVisualRepresentation();
            
            // Create status legend
            this.createStatusLegend();
            
            // Update the meter display
            this.updateMeter();
            
            // Setup event listeners
            this.setupEventListeners();
        },
        
        initializeTables: function() {
            // Initialize with random table statuses
            this.tables = [];
            for (let i = 1; i <= this.totalCapacity; i++) {
                this.tables.push({
                    id: i,
                    status: this.tableStatus[Math.floor(Math.random() * 3)] // Random initial status
                });
            }
            
            // Count current bookings
            this.currentBookings = this.tables.filter(table => 
                table.status === 'occupied' || table.status === 'reserved'
            ).length;
        },
        
        createVisualRepresentation: function() {
            const meterElement = document.querySelector('.occupancy__meter');
            if (!meterElement) return;
            
            // Create container for the visual representation
            const visualContainer = document.createElement('div');
            visualContainer.className = 'occupancy__visual';
            
            // Create table elements
            this.tables.forEach(table => {
                const tableElement = document.createElement('div');
                tableElement.className = `occupancy__table occupancy__table--${table.status}`;
                tableElement.dataset.tableId = table.id;
                tableElement.textContent = table.id;
                
                // Add tooltip functionality
                tableElement.title = `Table ${table.id}: ${this.occupancyLabels[this.lang][table.status]}`;
                
                visualContainer.appendChild(tableElement);
            });
            
            // Insert before the stats section
            const statsSection = meterElement.querySelector('.occupancy__stats');
            if (statsSection) {
                meterElement.insertBefore(visualContainer, statsSection);
            } else {
                meterElement.appendChild(visualContainer);
            }
        },
        
        createStatusLegend: function() {
            const meterElement = document.querySelector('.occupancy__meter');
            if (!meterElement) return;
            
            // Create legend container
            const legendContainer = document.createElement('div');
            legendContainer.className = 'occupancy__legend';
            
            // Create legend items
            this.tableStatus.forEach(status => {
                const legendItem = document.createElement('div');
                legendItem.className = 'occupancy__legend-item';
                
                const colorIndicator = document.createElement('span');
                colorIndicator.className = 'occupancy__legend-color';
                colorIndicator.style.backgroundColor = this.getStatusColor(status);
                
                const label = document.createElement('span');
                label.textContent = this.occupancyLabels[this.lang][status];
                
                legendItem.appendChild(colorIndicator);
                legendItem.appendChild(label);
                legendContainer.appendChild(legendItem);
            });
            
            // Insert before the stats section
            const visualContainer = meterElement.querySelector('.occupancy__visual');
            if (visualContainer) {
                meterElement.insertBefore(legendContainer, visualContainer.nextSibling);
            }
        },
        
        getStatusColor: function(status) {
            switch(status) {
                case 'available': return '#4aba60';
                case 'occupied': return '#dc3545';
                case 'reserved': return '#ffc107';
                case 'unavailable': return '#adb5bd';
                default: return '#4aba60';
            }
        },
        
        updateMeter: function() {
            const progress = document.querySelector('.occupancy__progress');
            const currentValue = document.querySelector('.occupancy__value');
            
            if (!progress || !currentValue) return;
            
            // Update current bookings calculation
            this.currentBookings = this.tables.filter(table => 
                table.status === 'occupied' || table.status === 'reserved'
            ).length;
            
            // Update progress bar
            const percentage = (this.currentBookings / this.totalCapacity) * 100;
            progress.style.width = `${percentage}%`;
            
            // Update current value text
            currentValue.textContent = `${this.currentBookings}/${this.totalCapacity}`;
            
            // Update progress bar color based on occupancy
            if (this.currentBookings >= this.threshold) {
                progress.style.background = 'linear-gradient(90deg, #4aba60, #2f9947)'; // Green
            } else if (this.currentBookings >= this.threshold * 0.7) {
                progress.style.background = 'linear-gradient(90deg, #ffc107, #e0a800)'; // Yellow
            } else {
                progress.style.background = 'linear-gradient(90deg, #dc3545, #bd2130)'; // Red
            }
            
            // Update table elements
            this.updateTableElements();
            
            // Update stats
            this.updateStats();
        },
        
        updateTableElements: function() {
            this.tables.forEach(table => {
                const tableElement = document.querySelector(`.occupancy__table[data-table-id="${table.id}"]`);
                if (tableElement) {
                    // Remove previous status classes
                    this.tableStatus.forEach(status => {
                        tableElement.classList.remove(`occupancy__table--${status}`);
                    });
                    
                    // Add current status class
                    tableElement.classList.add(`occupancy__table--${table.status}`);
                    
                    // Update tooltip
                    tableElement.title = `Table ${table.id}: ${this.occupancyLabels[this.lang][table.status]}`;
                }
            });
        },
        
        updateStats: function() {
            // Count different types of tables
            const availableTables = this.tables.filter(table => table.status === 'available').length;
            const occupiedTables = this.tables.filter(table => table.status === 'occupied').length;
            
            // Update UI stats if elements exist
            const flexDesksElement = document.querySelector('.occupancy__stat-value');
            if (flexDesksElement) {
                flexDesksElement.textContent = `${this.totalCapacity - availableTables}/${this.totalCapacity}`;
            }
        },
        
        setupEventListeners: function() {
            // Add click events to tables for demo purposes
            document.querySelectorAll('.occupancy__table').forEach(tableElement => {
                tableElement.addEventListener('click', (e) => {
                    const tableId = parseInt(e.target.dataset.tableId);
                    const table = this.tables.find(t => t.id === tableId);
                    
                    if (table) {
                        // Cycle through statuses: available -> occupied -> reserved -> unavailable -> available
                        const currentStatusIndex = this.tableStatus.indexOf(table.status);
                        const nextStatusIndex = (currentStatusIndex + 1) % this.tableStatus.length;
                        table.status = this.tableStatus[nextStatusIndex];
                        
                        // Update the UI
                        this.updateMeter();
                    }
                });
            });
            
            // Simulate real-time updates for demo
            setInterval(() => {
                // Randomly change status of 1-2 tables
                const numChanges = Math.floor(Math.random() * 2) + 1;
                
                for (let i = 0; i < numChanges; i++) {
                    const randomTableIndex = Math.floor(Math.random() * this.tables.length);
                    const randomStatusIndex = Math.floor(Math.random() * this.tableStatus.length);
                    
                    this.tables[randomTableIndex].status = this.tableStatus[randomStatusIndex];
                }
                
                this.updateMeter();
            }, 8000);
        }
    };
    
    occupancyMeter.init();
}); 