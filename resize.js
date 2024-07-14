// resize.js

export function resizeWindow(windowId, width, height) {
  // Define predefined sizes
  const predefinedSizes = {
    "320x568": { width: 320, height: 568 },
    "375x667": { width: 375, height: 667 },
    "1024x768": { width: 1024, height: 768 },
    "1366x768": { width: 1366, height: 768 },
    "1920x1080": { width: 1920, height: 1080 },
    "1680x1050": { width: 1680, height: 1050 }
  };

  // Use predefined sizes if available
  if (predefinedSizes.hasOwnProperty(width)) {
    const size = predefinedSizes[width];
    width = size.width;
    height = size.height;
  } else {
    // Parse user input if not predefined
    width = parseInt(width);
    height = parseInt(height);
  }

  // Default sizes to use if width or height is NaN (not a number)
  const defaultWidth = 1024;
  const defaultHeight = 768;

  // Use default sizes if width or height is NaN
  if (isNaN(width)) {
    width = defaultWidth;
  }
  if (isNaN(height)) {
    height = defaultHeight;
  }

  chrome.windows.update(windowId, { width: width, height: height }, function () {
      if (chrome.runtime.lastError) {
          console.error("Error resizing window:", chrome.runtime.lastError);
          alert("Failed to resize the window.");
          return;
      }

      chrome.windows.update(windowId, { left: 0, top: 0 }, function () {
          if (chrome.runtime.lastError) {
              console.error("Error moving window:", chrome.runtime.lastError);
              alert("Failed to move the window.");
          }
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");
  const resizeBtn = document.getElementById("resize-btn");
  const predefinedSizesSelect = document.getElementById("predefined-sizes");

  resizeBtn.addEventListener("click", function () {
      let width = widthInput.value.trim();
      let height = heightInput.value.trim();

      // If a predefined size is selected, use its value
      if (predefinedSizesSelect.value) {
          const selectedSize = predefinedSizesSelect.value;
          [width, height] = selectedSize.split("x");
      }

      console.log("Resizing window...");
      chrome.windows.getCurrent({ populate: true }, function (window) {
          if (chrome.runtime.lastError) {
              console.error("Error getting current window:", chrome.runtime.lastError);
              alert("Failed to get the current window.");
              return;
          }

          console.log("Got current window:", window);
          if (window.state === "maximized") {
              chrome.windows.update(window.id, { state: "normal" }, function () {
                  if (chrome.runtime.lastError) {
                      console.error("Error restoring window state:", chrome.runtime.lastError);
                      alert("Failed to restore the window state.");
                      return;
                  }
                  resizeWindow(window.id, width, height);
              });
          } else {
              resizeWindow(window.id, width, height);
          }
      });
  });
});
