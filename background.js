chrome.runtime.onInstalled.addListener(() => {
  console.log('Devkit installed.');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Devkit action clicked.');
});
