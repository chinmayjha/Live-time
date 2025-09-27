/**
 * Live Time & Date - Modern JavaScript
 * A beautiful real-time digital clock with modern features
 * 
 * @author Chinmay Jha
 * @version 2.0.0
 */

'use strict';

class LiveClock {
  constructor() {
    this.elements = {
      hours: document.querySelector('.hours'),
      minutes: document.querySelector('.minutes'),
      separator: document.querySelector('.separator'),
      period: document.querySelector('.period'),
      dayName: document.getElementById('day-name'),
      dayNumber: document.getElementById('day-number'),
      monthName: document.getElementById('month-name'),
      year: document.getElementById('year'),
      copyrightYear: document.getElementById('copyright-year')
    };
    
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    this.days = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ];
    
    this.intervalId = null;
    this.isVisible = true;
    
    this.init();
  }
  
  /**
   * Initialize the clock
   */
  init() {
    // Check if all required elements exist
    if (!this.validateElements()) {
      console.error('LiveClock: Required elements not found');
      return;
    }
    
    // Set initial time and date
    this.updateTime();
    this.updateDate();
    this.updateCopyright();
    
    // Start the clock
    this.start();
    
    // Handle page visibility changes for performance optimization
    this.handleVisibilityChange();
    
    // Add keyboard shortcuts for accessibility
    this.addKeyboardShortcuts();
    
    console.log('LiveClock: Initialized successfully');
  }
  
  /**
   * Validate that all required DOM elements exist
   */
  validateElements() {
    const requiredElements = ['hours', 'minutes', 'period', 'dayName', 'dayNumber', 'monthName', 'year'];
    return requiredElements.every(element => this.elements[element] !== null);
  }
  
  /**
   * Update the time display
   */
  updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;
    
    // Format with leading zeros
    const formattedHours = hours.toString();
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Update DOM elements with animation
    this.updateElementWithAnimation(this.elements.hours, formattedHours);
    this.updateElementWithAnimation(this.elements.minutes, formattedMinutes);
    this.updateElementWithAnimation(this.elements.period, period);
    
    // Update document title for browser tab
    document.title = `${formattedHours}:${formattedMinutes} ${period} - Live Time & Date`;
  }
  
  /**
   * Update the date display
   */
  updateDate() {
    const now = new Date();
    const dayName = this.days[now.getDay()];
    const dayNumber = now.getDate();
    const monthName = this.months[now.getMonth()];
    const year = now.getFullYear();
    
    // Update DOM elements
    this.updateElementWithAnimation(this.elements.dayName, dayName);
    this.updateElementWithAnimation(this.elements.dayNumber, dayNumber);
    this.updateElementWithAnimation(this.elements.monthName, monthName);
    this.updateElementWithAnimation(this.elements.year, year);
  }
  
  /**
   * Update copyright year
   */
  updateCopyright() {
    if (this.elements.copyrightYear) {
      const currentYear = new Date().getFullYear();
      this.elements.copyrightYear.textContent = `Copyright © ${currentYear}`;
    }
  }
  
  /**
   * Update element with smooth animation
   */
  updateElementWithAnimation(element, newValue) {
    if (!element || element.textContent === newValue.toString()) return;
    
    // Add transition effect
    element.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
    element.style.opacity = '0.7';
    element.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      element.textContent = newValue;
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, 150);
  }
  
  /**
   * Start the clock interval
   */
  start() {
    // Update immediately
    this.updateTime();
    
    // Set up interval to update every second
    this.intervalId = setInterval(() => {
      if (this.isVisible) {
        this.updateTime();
        
        // Update date at midnight
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
          this.updateDate();
        }
      }
    }, 1000);
  }
  
  /**
   * Stop the clock interval
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Handle page visibility changes for performance optimization
   */
  handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      
      if (this.isVisible) {
        // Page is visible again, update immediately
        this.updateTime();
        this.updateDate();
      }
    });
  }
  
  /**
   * Add keyboard shortcuts for accessibility
   */
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Alt + T: Announce current time (for screen readers)
      if (event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        this.announceTime();
      }
      
      // Alt + D: Announce current date (for screen readers)
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        this.announceDate();
      }
    });
  }
  
  /**
   * Announce current time for screen readers
   */
  announceTime() {
    const timeElement = document.getElementById('display-time');
    if (timeElement) {
      const announcement = `Current time is ${timeElement.textContent.replace(/\s+/g, ' ')}`;
      this.createAnnouncement(announcement);
    }
  }
  
  /**
   * Announce current date for screen readers
   */
  announceDate() {
    const dateElement = document.getElementById('display-date');
    if (dateElement) {
      const announcement = `Today is ${dateElement.textContent.replace(/\s+/g, ' ')}`;
      this.createAnnouncement(announcement);
    }
  }
  
  /**
   * Create an announcement for screen readers
   */
  createAnnouncement(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  /**
   * Get current time as object (for external use)
   */
  getCurrentTime() {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      period: now.getHours() >= 12 ? 'PM' : 'AM',
      timestamp: now.getTime()
    };
  }
  
  /**
   * Get current date as object (for external use)
   */
  getCurrentDate() {
    const now = new Date();
    return {
      dayName: this.days[now.getDay()],
      dayNumber: now.getDate(),
      monthName: this.months[now.getMonth()],
      monthNumber: now.getMonth() + 1,
      year: now.getFullYear(),
      timestamp: now.getTime()
    };
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    this.stop();
    console.log('LiveClock: Destroyed');
  }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Create global clock instance
  window.liveClock = new LiveClock();
  
  // Add some console info for developers
  console.log(`%c
  ╔══════════════════════════════════════╗
  ║           Live Time & Date           ║
  ║         Made with ❤️ by Chinmay      ║
  ║                                      ║
  ║  🌐 https://chinmayjha.tech          ║
  ║  📧 contact@chinmayjha.tech          ║
  ║                                      ║
  ║  Keyboard Shortcuts:                 ║
  ║  Alt + T: Announce time              ║
  ║  Alt + D: Announce date              ║
  ╚══════════════════════════════════════╝
  `, 'color: #6366f1; font-family: monospace;');
  
  console.log('🕒 Clock initialized successfully!');
});

/**
 * Handle page unload
 */
window.addEventListener('beforeunload', function() {
  if (window.liveClock) {
    window.liveClock.destroy();
  }
});
