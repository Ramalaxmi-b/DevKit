// popup.js

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('apply-size').addEventListener('click', applySize);
  document.getElementById('reset-size').addEventListener('click', resetSize);
  document.getElementById('check-links').addEventListener('click', checkLinks);
  document.getElementById('analyze-tech').addEventListener('click', analyzeTech);

  // Initialize tabs
  const tablinks = document.querySelectorAll('.nav-link');
  tablinks.forEach(tablink => {
    tablink.addEventListener('click', function(event) {
      event.preventDefault();
      openTab(event, this.getAttribute('aria-controls'));
    });
  });

  // Set the first tab as active
  tablinks[0].click();

  // Retrieve stored settings on popup open
  chrome.storage.sync.get(['width', 'height'], function(data) {
    if (data.width && data.height) {
      document.getElementById('custom-width').value = data.width;
      document.getElementById('custom-height').value = data.height;
    }
  });
});

function openTab(evt, tabName) {
  const tabcontent = document.querySelectorAll('.tab-pane');
  tabcontent.forEach(tab => {
    tab.classList.remove('show', 'active');
  });
  const tablinks = document.querySelectorAll('.nav-link');
  tablinks.forEach(link => {
    link.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('show', 'active');
  evt.currentTarget.classList.add('active');
}

function applySize() {
  const predefinedSize = document.getElementById('predefined-sizes').value.split('x');
  const customWidth = document.getElementById('custom-width').value;
  const customHeight = document.getElementById('custom-height').value;
  let width = parseInt(predefinedSize[0], 10);
  let height = parseInt(predefinedSize[1], 10);

  if (customWidth) width = parseInt(customWidth, 10);
  if (customHeight) height = parseInt(customHeight, 10);

  // Save settings to storage
  chrome.storage.sync.set({ width, height }, function() {
    console.log('Settings saved:', width, height);
  });

  // Update window size
  chrome.windows.getCurrent(function (win) {
    chrome.windows.update(win.id, { width, height });
  });
}

function resetSize() {
  const defaultWidth = 800;
  const defaultHeight = 600;

  // Save default settings to storage
  chrome.storage.sync.set({ width: defaultWidth, height: defaultHeight }, function() {
    console.log('Default settings saved:', defaultWidth, defaultHeight);
  });

  // Update window size
  chrome.windows.getCurrent(function (win) {
    chrome.windows.update(win.id, { width: defaultWidth, height: defaultHeight });
  });
}

function checkLinks() {
  const url = document.getElementById('page-url').value;
  fetch(url)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a');
      const results = [];
      const fetchPromises = [];

      links.forEach(link => {
        const fetchPromise = fetch(link.href)
          .then(response => {
            if (!response.ok) {
              results.push(`${link.href} is broken.`);
            }
          })
          .catch(() => {
            results.push(`${link.href} is broken.`);
          });
        fetchPromises.push(fetchPromise);
      });

      Promise.all(fetchPromises).then(() => {
        if (results.length > 0) {
          document.getElementById('link-results').innerText = results.join('\n');
        } else {
          document.getElementById('link-results').innerText = 'All links are working.';
        }
      });
    })
    .catch(error => {
      console.error('Error fetching page:', error);
      document.getElementById('link-results').innerText = 'Error fetching page.';
    });
}

function analyzeTech() {
  const url = document.getElementById('tech-url').value;
  fetch(`https://api.wappalyzer.com/lookup/?urls=${encodeURIComponent(url)}`, {
    headers: {
      'x-api-key': 'YOUR_WAPPALYZER_API_KEY'
    }
  })
    .then(response => response.json())
    .then(data => {
      const results = data[0].technologies.map(tech => tech.name).join(', ');
      document.getElementById('tech-results').innerText = results;
    })
    .catch(error => {
      console.error('Error fetching technologies:', error);
      document.getElementById('tech-results').innerText = 'Error fetching technologies.';
    });
}
