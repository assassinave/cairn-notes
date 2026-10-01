// Background script for Cairn Notes extension

// Listen for installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log('Cairn Notes extension installed or updated');
  
  // Initialize empty clips array in storage if it doesn't exist
  chrome.storage.local.get('claudeNotes', (result) => {
    if (!result.claudeNotes) {
      chrome.storage.local.set({ 'claudeNotes': [] });
    }
  });
});

function openLibraryTab() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('library.html')
  });
}

function isRestrictedUrl(url) {
  if (!url) return true;
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:') ||
    url.startsWith('devtools://')
  );
}

/** Toggle in-page Notes / Library panel; fall back to opening Library. */
function togglePanelOrOpenLibrary(tab) {
  if (!tab?.id || isRestrictedUrl(tab.url)) {
    openLibraryTab();
    return;
  }

  chrome.tabs.sendMessage(
    tab.id,
    { action: 'toggleModal' },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error toggling panel:', chrome.runtime.lastError);

        // No receiver (e.g. tab opened before install/reload): inject once and retry
        if (tab.url && /^https?:/.test(tab.url)) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }).then(() => {
            setTimeout(() => {
              chrome.tabs.sendMessage(
                tab.id,
                { action: 'toggleModal' },
                (retryResponse) => {
                  if (chrome.runtime.lastError || (retryResponse && !retryResponse.success)) {
                    console.error('Still could not toggle modal:', chrome.runtime.lastError || retryResponse?.error);
                    openLibraryTab();
                  }
                }
              );
            }, 300);
          }).catch((err) => {
            console.error('Could not inject content script:', err);
            openLibraryTab();
          });
          return;
        }

        // Non-web pages: open Library
        openLibraryTab();
        return;
      }

      if (response && !response.success) {
        console.log('Panel toggle failed:', response.error);
        openLibraryTab();
      }
    }
  );
}

// Toolbar icon: toggle Notes / Library access panel on the page
chrome.action.onClicked.addListener((tab) => {
  togglePanelOrOpenLibrary(tab);
});

// Helper function to show notifications
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: title,
    message: message
  });
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message, 'from:', sender);
  
  // Handle toggle request coming *from* the content script (e.g., injected button)
  if (message.action === 'toggleModal') {
    // Ensure the message is from a content script in a tab
    if (sender.tab) {
      const tabId = sender.tab.id;
      console.log(`Forwarding toggleModal request to tab ${tabId}`);
      // Send the message back to the specific content script to perform the toggle
      chrome.tabs.sendMessage(
        tabId,
        { action: 'toggleModal' }, // Send the same action back
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending toggleModal back to content script:', chrome.runtime.lastError.message);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else if (response && !response.success) {
            console.log('Content script failed to toggle modal:', response.error);
            showNotification('Cairn Notes', response.error || 'Could not toggle notes panel.');
            sendResponse({ success: false, error: response.error });
          } else {
            console.log('Modal toggle initiated by content script successful.');
            sendResponse({ success: true });
          }
        }
      );
      return true; // Indicate async response
    } else {
      console.error('toggleModal message received without sender tab info.');
      sendResponse({ success: false, error: 'Internal error: Sender tab not found.' });
    }
  } else if (message.action === 'saveClip') {
    // Forward the clip to any open Claude.ai tabs
    chrome.tabs.query({url: 'https://claude.ai/*'}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message).catch(err => {
          console.error('Error sending message to tab:', err);
        });
      });
    });
    sendResponse({success: true});
    return true; // Indicate we'll respond asynchronously
  }

  if (message.action === 'openLibrary') {
    openLibraryTab();
    sendResponse({success: true});
    return true;
  }
});
