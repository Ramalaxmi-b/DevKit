import { resizeWindowBasedOnContent } from './resize.js'; // Import the function

export function analyzeTech() {
    const username = 'Ramalaxmi-b';
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(repos => {
            console.log('GitHub API response:', repos);

            // Process repository data (example: extracting languages used)
            const languagesUsed = repos.map(repo => repo.language).filter(lang => lang !== null);
            const uniqueLanguages = [...new Set(languagesUsed)]; // Unique languages used

            const techResult = uniqueLanguages.length > 0 ? uniqueLanguages.join(', ') : 'No technologies found.';

            // Display the results
            showResultMessage(techResult);
            resizeWindowBasedOnContent(); // Resize window after displaying results
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('tech-results').innerText = 'Error fetching technology data. Please check the console for more details.';
            resizeWindowBasedOnContent(); // Resize window after displaying error
        });
}

function showResultMessage(message) {
    console.log('Showing result message:', message);

    const messageElement = document.createElement('div');
    messageElement.className = 'alert alert-success mt-3';
    messageElement.textContent = `Detected Technologies: ${message}
    Html,
    css,
    Tailwind`;

    const tabContent = document.querySelector('.tab-pane.show.active');
    if (tabContent) {
        tabContent.appendChild(messageElement);
    } else {
        console.error('Active tab content not found.');
    }
}

/*// Ensure resize function is called after content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    analyzeTech(); // Analyze technologies on page load
});*/