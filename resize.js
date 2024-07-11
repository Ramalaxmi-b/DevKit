// Constants
const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;

// Helper function to show an error message
function showError(message) {
  console.error(message);
  alert(`Error: ${message}`); // Display error message in an alert box
  // You can also display an error notification or toast here
}

// Helper function to show a success message
function showSuccess(message) {
  console.log(message);
  alert(`Success: ${message}`); // Display success message in an alert box
  // You can also display a success notification or toast here
}

// Function to validate dimensions
function validateDimensions(width, height) {
  if (isNaN(width) || isNaN(height)) {
    showError('Invalid dimensions provided.');
    return false;
  }
  return true;
}

// Function to calculate window position
function calculateWindowPosition(width, height) {
  const left = Math.max(0, Math.min(screen.availWidth - width, screen.availWidth / 2 - width / 2));
  const top = Math.max(0, Math.min(screen.availHeight - height, screen.availHeight / 2 - height / 2));
  return { left, top };
}

// Function to apply a new size to the window
export function applySize() {
  const predefinedSize = document.getElementById('predefined-sizes').value.split('x');
  const customWidth = document.getElementById('custom-width').value;
  const customHeight = document.getElementById('custom-height').value;
  let width = parseInt(predefinedSize[0], 10);
  let height = parseInt(predefinedSize[1], 10);

  // Override with custom dimensions if provided
  if (customWidth) width = parseInt(customWidth, 10);
  if (customHeight) height = parseInt(customHeight, 10);

  if (!validateDimensions(width, height)) return;

  const { left, top } = calculateWindowPosition(width, height);

  // Save dimensions to Chrome storage and update window
  chrome.storage.sync.set({ width, height }, function() {
    console.log('Settings saved:', width, height);

    chrome.windows.getCurrent(function(window) {
      chrome.windows.update(window.id, {
        width: width,
        height: height,
        left: left,
        top: top
      }, function(updatedWindow) {
        if (chrome.runtime.lastError) {
          showError(chrome.runtime.lastError.message);
          return;
        }
        console.log('Window resized:', updatedWindow);
        showSuccess('Window resized successfully.');
      });
    });
  });
}

// Function to resize window based on content
export function resizeWindowBasedOnContent() {
  const resizeDiv = document.getElementById('resizeDiv');
  if (!resizeDiv) return; // Ensure resizeDiv is available

  const width = resizeDiv.offsetWidth + 20;  // Adding padding
  const height = resizeDiv.offsetHeight + 100; // Adding padding

  // Update window size
  chrome.windows.getCurrent(function(window) {
    chrome.windows.update(window.id, {
      width: width,
      height: height
    }, function(updatedWindow) {
      if (chrome.runtime.lastError) {
        showError('Error resizing window:', chrome.runtime.lastError.message);
        return;
      }
      console.log('Window resized to fit content:', updatedWindow);
      showSuccess('Window resized successfully.');
    });
  });
}

// Function to reset window size to default
export function resetSize() {
  return new Promise((resolve, reject) => {
    // Save default dimensions to Chrome storage
    chrome.storage.sync.set({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }, function() {
      if (chrome.runtime.lastError) {
        showError(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
        return;
      }
      console.log('Default settings saved:', DEFAULT_WIDTH, DEFAULT_HEIGHT);

      // Get the current window and update its size
      chrome.windows.getCurrent(function(win) {
        if (chrome.runtime.lastError) {
          showError(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
          return;
        }

        chrome.windows.update(win.id, { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }, function(updatedWindow) {
          if (chrome.runtime.lastError) {
            showError(chrome.runtime.lastError.message);
            reject(chrome.runtime.lastError.message);
          } else {
            console.log('Window reset to default size:', updatedWindow);
            showSuccess('Window reset to default size.');
            resolve(updatedWindow);
          }
        });
      });
    });
  });
}