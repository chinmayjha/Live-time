/**
 * Live Time & Date - Minimal JavaScript
 * A beautiful minimal real-time digital clock
 * 
 * @author Chinmay Jha
 * @version 3.0.0
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
      year: document.getElementById('year')
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
  
  init() {
    if (!this.validateElements()) {
      console.error('LiveClock: Required elements not found');
      return;
    }
    
    this.updateTime();
    this.updateDate();
    this.start();
    this.handleVisibilityChange();
    this.addKeyboardShortcuts();
    
    console.log('LiveClock: Initialized successfully');
  }
  
  validateElements() {
    const requiredElements = ['hours', 'minutes', 'period', 'dayName', 'dayNumber', 'monthName', 'year'];
    return requiredElements.every(element => this.elements[element] !== null);
  }
  
  updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    const formattedHours = hours.toString();
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    this.updateElement(this.elements.hours, formattedHours);
    this.updateElement(this.elements.minutes, formattedMinutes);
    this.updateElement(this.elements.period, period);
    
    document.title = `${formattedHours}:${formattedMinutes} ${period} - Live Time & Date`;
  }
  
  updateDate() {
    const now = new Date();
    const dayName = this.days[now.getDay()];
    const dayNumber = now.getDate();
    const monthName = this.months[now.getMonth()];
    const year = now.getFullYear();
    
    this.updateElement(this.elements.dayName, dayName);
    this.updateElement(this.elements.dayNumber, dayNumber);
    this.updateElement(this.elements.monthName, monthName);
    this.updateElement(this.elements.year, year);
  }
  
  updateElement(element, newValue) {
    if (!element || element.textContent === newValue.toString()) return;
    
    element.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    element.style.opacity = '0.7';
    element.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      element.textContent = newValue;
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, 100);
  }
  
  start() {
    this.updateTime();
    
    this.intervalId = setInterval(() => {
      if (this.isVisible) {
        this.updateTime();
        
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
          this.updateDate();
        }
      }
    }, 1000);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      
      if (this.isVisible) {
        this.updateTime();
        this.updateDate();
      }
    });
  }
  
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if (event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        this.announceTime();
      }
      
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        this.announceDate();
      }
    });
  }
  
  announceTime() {
    const timeText = `${this.elements.hours.textContent}:${this.elements.minutes.textContent} ${this.elements.period.textContent}`;
    const announcement = `Current time is ${timeText}`;
    this.createAnnouncement(announcement);
  }
  
  announceDate() {
    const dateText = `${this.elements.dayName.textContent}, ${this.elements.monthName.textContent} ${this.elements.dayNumber.textContent}, ${this.elements.year.textContent}`;
    const announcement = `Today is ${dateText}`;
    this.createAnnouncement(announcement);
  }
  
  createAnnouncement(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
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
  
  destroy() {
    this.stop();
    console.log('LiveClock: Destroyed');
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.liveClock = new LiveClock();
  
  console.log(`%c
  ╔══════════════════════════════════════╗
  ║        Minimal Live Time & Date      ║
  ║         Made with ❤️ by Chinmay      ║
  ║                                      ║
  ║  🌐 https://chinmayjha.tech          ║
  ║  📧 chinmayjha2021@gmail.com         ║
  ║                                      ║
  ║  Keyboard Shortcuts:                 ║
  ║  Alt + T: Announce time              ║
  ║  Alt + D: Announce date              ║
  ╚══════════════════════════════════════╝
  `, 'color: #3b82f6; font-family: monospace;');
  
  console.log('🕒 Minimal Clock initialized successfully!');
});

// Handle page unload
window.addEventListener('beforeunload', function() {
  if (window.liveClock) {
    window.liveClock.destroy();
  }
});

