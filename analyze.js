import { resizeWindowBasedOnContent } from './resize.js'; // Import the function

export function analyzeTech(url) {
    console.log('Analyzing technology on:', url);
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

    fetch(`https://api.wappalyzer.com/lookup/?urls=${encodeURIComponent(url)}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('API response:', data); // Log the response for debugging
        if (data.length > 0 && data[0].technologies) {
            const technologies = data[0].technologies;
            const results = technologies.map(tech => tech.name).join(', ');
            document.getElementById('tech-results').innerText = results;
        } else {
            document.getElementById('tech-results').innerText = 'No technologies found or incorrect response structure.';
        }
        resizeWindowBasedOnContent(); // Resize window after displaying results
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('tech-results').innerText = 'Error fetching technology data. Please check the console for more details.';
        resizeWindowBasedOnContent(); // Resize window after displaying error
    });
}
