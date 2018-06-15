// Inform the background page that this tab should have a page-action
chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
	var domInfo;
	chrome.storage.sync.get(null, function (items){
		if (JSON.stringify(items) === '{}') {
            soCleaner.setDefaultSettingsInChromeStorage();
			chrome.storage.sync.get(null, function (items2){
				soCleaner.changeUI(items2);
			});
        }
		else{
			soCleaner.changeUI(items);
		}
});
    }
	else if ((msg.from === 'popup') && (msg.subject === 'msgQuickSettings')) {
		soCleaner.openQuickSettings();
		
	response('world');
	}
});
