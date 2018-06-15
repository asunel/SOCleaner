// Update the relevant fields with the new data
function setDOMInfo(info) {
    console.log('setdominfo');
}

document.querySelector('#go-to-options').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        //  new way to open options pages, if supported (chrome 42+).
        chrome.runtime.openOptionsPage();
    } else {
        // reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
    }
});

document.querySelector('#btnQuickSettings').addEventListener('click', function() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id, {
                from: 'popup',
                subject: 'msgQuickSettings'
            },
            // ...also specifying a callback to be called 
            //    from the receiving end (content script)
            setDOMInfo);
    });

});

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function() {
    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id, {
                from: 'popup',
                subject: 'DOMInfo'
            },
            // ...also specifying a callback to be called 
            //    from the receiving end (content script)
            setDOMInfo);
    });
});
