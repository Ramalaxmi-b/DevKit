export function applySize() {
    const predefinedSize = document.getElementById('predefined-sizes').value.split('x');
    const customWidth = document.getElementById('custom-width').value;
    const customHeight = document.getElementById('custom-height').value;
    let width = parseInt(predefinedSize[0], 10);
    let height = parseInt(predefinedSize[1], 10);

    // Override with custom dimensions if provided
    if (customWidth) width = parseInt(customWidth, 10);
    if (customHeight) height = parseInt(customHeight, 10);

    // Validate dimensions
    if (isNaN(width) || isNaN(height)) {
        console.error('Invalid dimensions:', width, height);
        return Promise.reject('Invalid dimensions');
    }

    // Calculate window position to center on screen
    const screenWidth = screen.availWidth;
    const screenHeight = screen.availHeight;
    const left = Math.max(0, Math.min(screenWidth - width, screenWidth / 2 - width / 2));
    const top = Math.max(0, Math.min(screenHeight - height, screenHeight / 2 - height / 2));

    // Save dimensions to Chrome storage and update window
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ width, height }, function() {
            console.log('Settings saved:', width, height);
            resolve();
        });

        chrome.windows.getCurrent(function(window) {
            chrome.windows.update(window.id, {
                width: width,
                height: height,
                left: left,
                top: top
            }, function(updatedWindow) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else {
                    console.log('Window resized:', updatedWindow);
                    resolve(updatedWindow);
                }
            });
        });
    });
}
export function resizeWindowBasedOnContent() {
    const resizeDiv = document.getElementById('resizeDiv');
    if (!resizeDiv) return; // Ensure resizeDiv is available

    // Get dimensions based on content
    const width = resizeDiv.offsetWidth + 20;  // Adding padding
    const height = resizeDiv.offsetHeight + 100; // Adding padding

    // Update window size
    chrome.windows.getCurrent(function(window) {
        chrome.windows.update(window.id, {
            width: width,
            height: height
        }, function(updatedWindow) {
            if (chrome.runtime.lastError) {
                console.error('Error resizing window:', chrome.runtime.lastError.message);
                showError('Error resizing window. Please try again.');
            } else {
                console.log('Window resized to fit content:', updatedWindow);
                showSuccess('Window resized successfully.');
            }
        });
    });
}
export function resetSize() {
    const defaultWidth = 1024;
    const defaultHeight = 768;

    // Save default dimensions to Chrome storage and update window
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ width: defaultWidth, height: defaultHeight }, function() {
            console.log('Default settings saved:', defaultWidth, defaultHeight);
            resolve();
        });

        chrome.windows.getCurrent(function (win) {
            chrome.windows.update(win.id, { width: defaultWidth, height: defaultHeight }, function(updatedWindow) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else {
                    console.log('Window reset to default size:', updatedWindow);
                    resolve(updatedWindow);
                }
            });
        });
    });
}
