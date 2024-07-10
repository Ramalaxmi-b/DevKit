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
                return `${link.href} is not broken.`;
              } else {
                return `${link.href} is broken.`;
              }
            })
            .catch(() => {
              return `${link.href} is broken.`;
            });
          fetchPromises.push(fetchPromise);
        });
  
        Promise.all(fetchPromises).then(results => {
          const message = results.join('\n');
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
  
  function showResultMessage(message) {
    const resultElement = document.getElementById('link-results');
    resultElement.textContent = message;
  
    // Style the message based on success or failure
    if (message.includes('broken')) {
      resultElement.classList.add('alert', 'alert-danger');
    } else {
      resultElement.classList.add('alert', 'alert-success');
    }
  }
  
