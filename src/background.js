// Execute content script when navigating to different netflix pages in same tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// If changed url contains netflix.com
	if (/netflix\.com/.test(changeInfo.url)) {
		chrome.tabs.executeScript(null, { file: "src/contentscriptnetflix.js" });
	}
});

// Execute content script when navigating to different hulu pages in same tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// If changed url contains hulu.com
	if (/hulu\.com/.test(changeInfo.url)) {
		chrome.tabs.executeScript(null, { file: "src/contentscripthulu.js" });
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, response) {
	if (message.type == 'showPageAction') {
		chrome.pageAction.show(sender.tab.id);
	}
});

