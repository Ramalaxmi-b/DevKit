document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('apply-size').addEventListener('click', applySize);
  document.getElementById('reset-size').addEventListener('click', resetSize);
  document.getElementById('check-links').addEventListener('click', checkLinks);
  document.getElementById('analyze-tech').addEventListener('click', analyzeTech);

  // Initialize tabs
  const tablinks = document.querySelectorAll('.nav-link');
  tablinks.forEach(tablink => {
    tablink.addEventListener('click', function(event) {
      openTab(event, this.getAttribute('href').substring(1));
    });
  });

  // Set the first tab as active
  tablinks[0].click();
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

  chrome.windows.getCurrent(function (win) {
    chrome.windows.update(win.id, { width, height });
  });
}

function resetSize() {
  chrome.windows.getCurrent(function (win) {
    chrome.windows.update(win.id, { width: 800, height: 600 });
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
      links.forEach(link => {
        fetch(link.href)
          .then(response => {
            if (!response.ok) {
              results.push(`${link.href} is broken.`);
            }
          })
          .catch(() => {
            results.push(`${link.href} is broken.`);
          });
      });
      setTimeout(() => {
        document.getElementById('link-results').innerText = results.join('\n');
      }, 3000); 
    });
}

function analyzeTech() {
  const url = document.getElementById('tech-url').value;
  fetch(`https://api.wappalyzer.com/lookup/?urls=${encodeURIComponent(url)}`)
    .then(response => response.json())
    .then(data => {
      const technologies = data.technologies;
      const results = technologies.map(tech => tech.name).join(', ');
      document.getElementById('tech-results').innerText = results;
    });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Devkit installed.');
});
