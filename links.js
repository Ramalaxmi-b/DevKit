import { resizeWindowBasedOnContent } from './resize.js'; // Import the function

export function checkLinks(url) {
  console.log('Checking links on:', url);
  fetch(url)
   .then(response => response.text())
   .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a');
      const fetchPromises = [];

      links.forEach(link => {
        const fetchPromise = fetch(link.href)
         .then(response => {
            if (response.ok) {
              return false; // Not broken
            } else {
              return true; // Broken
            }
          })
         .catch(() => {
            return true; // Broken
          });
        fetchPromises.push(fetchPromise);
      });

      Promise.all(fetchPromises).then(results => {
        const allNotBroken = results.every(isBroken =>!isBroken);
        const message = allNotBroken? 'All links are not broken.' : 'Some links are broken.';
        showResultMessage(message);
        resizeWindowBasedOnContent(); // Resize window after displaying results
      });
    })
   .catch(error => {
      console.error('Error checking links:', error);
      showError('Error checking links. Please check the console for more details.');
      resizeWindowBasedOnContent(); // Resize window after displaying error
    });
}

// Helper functions

function showResultMessage(message) {
  console.log('Showing result message:', message);

  const messageElement = document.createElement('div');
  messageElement.className = 'alert alert-success mt-3';
  messageElement.textContent = message;

  const tabContent = document.querySelector('.tab-pane.show.active');
  if (tabContent) {
    tabContent.appendChild(messageElement);
  } else {
    console.error('Active tab content not found.');
  }
}

function showError(message) {
  console.log('Showing error message:', message);

  const messageElement = document.createElement('div');
  messageElement.className = 'alert alert-danger mt-3';
  messageElement.textContent = message;

  const tabContent = document.querySelector('.tab-pane.show.active');
  if (tabContent) {
    tabContent.appendChild(messageElement);
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  } else {
    console.error('Active tab content not found.');
  }
}

// Ensure resize function is called after content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  resizeWindowBasedOnContent();
});