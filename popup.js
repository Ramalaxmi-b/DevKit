import { applySize, resetSize } from './resize.js';
import { analyzeTech } from './analyze.js';
import { checkLinks } from './links.js';
import { resizeWindowBasedOnContent } from './resize.js';

// Execute script immediately when popup.html is loaded
document.addEventListener('DOMContentLoaded', function() {
  const tabLinks = document.querySelectorAll('.nav-link');

  // Initialize tabs
  tabLinks.forEach(tabLink => {
    tabLink.addEventListener('click', function(event) {
      event.preventDefault();
      openTab(event, this.getAttribute('aria-controls'));
      resizeWindowBasedOnContent(); // Ensure this function is available and called
    });
  });

  // Set the first tab as active
  tabLinks[0].click();

  // Retrieve stored width and height settings
 /* chrome.storage.sync.get(['width', 'height'], function(data) {
    if (data.width && data.height) {
      document.getElementById('custom-width').value = data.width;
      document.getElementById('custom-height').value = data.height;
    }
  });*/

  // Apply size button click handler
  document.getElementById('apply-size').addEventListener('click', function() {
    applySize();
  });

  // Reset size button click handler
  document.getElementById('reset-size').addEventListener('click', function() {
    resetSize();
  });

  // Check links button click handler
  document.getElementById('check-links').addEventListener('click', function() {
    const pageUrl = document.getElementById('page-url').value.trim();
    if (pageUrl) {
      checkLinks(pageUrl);
    } else {
      showError('Please enter a valid page URL.');
    }
  });

  // Analyze tech button click handler
  document.getElementById('analyze-tech').addEventListener('click', function() {
    const techUrl = document.getElementById('tech-url').value.trim();
    if (techUrl) {
      analyzeTech(techUrl);
    } else {
      showError('Please enter a valid page URL.');
    }
  });

  // Resize window based on initial content
  resizeWindowBasedOnContent();
});

function openTab(evt, tabName) {
  const tabContents = document.querySelectorAll('.tab-pane');
  tabContents.forEach(tabContent => {
    tabContent.classList.remove('show', 'active');
  });

  const tabLinks = document.querySelectorAll('.nav-link');
  tabLinks.forEach(link => {
    link.classList.remove('active');
  });

  document.getElementById(tabName).classList.add('show', 'active');
  evt.currentTarget.classList.add('active');
}

// Function to show success message
export function showSuccess(message) {
  console.log('Showing success message:', message); // Log message to console for debugging

  const messageElement = document.createElement('div');
  messageElement.className = 'alert alert-success mt-3';
  messageElement.textContent = message;

  const tabContent = document.querySelector('.tab-pane.show.active');
  if (tabContent) {
    console.log('Appending success message to tab content:', tabContent);
    tabContent.appendChild(messageElement);
    setTimeout(function() {
      messageElement.remove();
    }, 3000);
  } else {
    console.error('Active tab content not found.'); // Log error if tab content is not found
  }
}

// Function to show error message
export function showError(message) {
  console.log('Showing error message:', message); // Log message to console for debugging

  const messageElement = document.createElement('div');
  messageElement.className = 'alert alert-danger mt-3';
  messageElement.textContent = message;

  const tabContent = document.querySelector('.tab-pane.show.active');
  if (tabContent) {
    console.log('Appending error message to tab content:', tabContent);
    tabContent.appendChild(messageElement);
    setTimeout(function() {
      messageElement.remove();
    }, 3000);
  } else {
    console.error('Active tab content not found.'); // Log error if tab content is not found
  }
}