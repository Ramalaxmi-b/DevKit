import { resizeWindow } from './resize.js';
import { analyzeTech } from './analyze.js';
import { checkLinks } from './links.js';

document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.nav-link');

    // Initialize tabs
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', function (event) {
            event.preventDefault();
            openTab(event, this.getAttribute('aria-controls'));
            // Ensure this function is available and called
        });
    });

    // Set the first tab as active
    if (tabLinks.length > 0) {
        tabLinks[0].click();
    }

    // Apply size button click handler
    const applySizeButton = document.getElementById('apply-size');
    if (applySizeButton) {
        applySizeButton.addEventListener('click', function () {
            applySize();
            resizeWindow(); // Resize window after applying size
        });
    }

    // Reset size button click handler
    const resetSizeButton = document.getElementById('reset-size');
    if (resetSizeButton) {
        resetSizeButton.addEventListener('click', function () {
            resetSize();
            resizeWindow(); // Resize window after resetting size
        });
    }

    // Check links button click handler
    const checkLinksButton = document.getElementById('check-links');
    if (checkLinksButton) {
        checkLinksButton.addEventListener('click', function () {
            const pageUrl = document.getElementById('page-url').value.trim();
            if (pageUrl) {
                checkLinks(pageUrl);
            } else {
                showError('Please enter a valid page URL.');
            }
        });
    }

    // Analyze tech button click handler
    const analyzeTechButton = document.getElementById('analyze-tech');
    if (analyzeTechButton) {
        analyzeTechButton.addEventListener('click', function () {
            const techUrl = document.getElementById('tech-url').value.trim();
            if (techUrl) {
                analyzeTech(techUrl);
            } else {
                showError('Please enter a valid page URL.');
            }
        });
    }
    
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

    const tab = document.getElementById(tabName);
    if (tab) {
        tab.classList.add('show', 'active');
        evt.currentTarget.classList.add('active');
    }
}
