const CairnIcons = (() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const icons = {
    x: [['path', { d: 'M18 6L6 18M6 6l12 12' }]],
    copy: [
      ['rect', { x: 8, y: 8, width: 14, height: 14, rx: 2, ry: 2 }],
      ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }]
    ],
    check: [['path', { d: 'M20 6L9 17l-5-5' }]],
    settings: [
      ['path', { d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915' }],
      ['circle', { cx: 12, cy: 12, r: 3 }]
    ],
    arrowUp: [['path', { d: 'M12 19V5M6 11l6-6 6 6' }]]
  };
  const createIcon = (name, size = 24, color = 'currentColor') => {
    const svg = document.createElementNS(SVG_NS, 'svg');
    Object.entries({
      width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke: color, 'stroke-width': 2,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }).forEach(([k, v]) => svg.setAttribute(k, v));
    (icons[name] || []).forEach(([tag, attrs]) => {
      const el = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      svg.appendChild(el);
    });
    return svg;
  };
  return { createIcon, icons };
})();

// Style utility functions
const styles = {
  colors: {
    primary: '#c96442',
    border: '#ddd',
    background: {
      light: '#f5f5f5',
      white: '#fff'
    },
    text: {
      normal: '#666',
      dark: '#000'
    },
    highlights: {
      clip:       'rgba(79, 240, 255, 0.35)',
      annotation: 'rgba(255, 79, 182, 0.35)',
      comment:    'rgba(255, 213, 79, 0.35)',
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px'
  }
};

// Inject highlight styles
const injectHighlightStyles = () => {
  let s = document.getElementById('cairn-styles');
  if (!s) {
    s = document.createElement('style');
    s.id = 'cairn-styles';
    document.head.appendChild(s);
  }
  s.textContent = `
    .cairn-clip-highlight,.cairn-comment-highlight{border-radius:2px}
    .cairn-clip-highlight{background:${styles.colors.highlights.clip}}
    .cairn-clip-highlight[data-secondary]{background:${styles.colors.highlights.annotation}}
    .cairn-comment-highlight{background:${styles.colors.highlights.comment};cursor:default}
    .cairn-richtext p{margin:0 0 4px 0}
    .cairn-richtext p:last-child{margin-bottom:0}
    .cairn-richtext strong{font-weight:600}
    .cairn-richtext em{font-style:italic}
    .cairn-richtext ul,.cairn-richtext ol{margin:2px 0;padding-left:16px}
    .cairn-richtext li{margin:0}
    .cairn-richtext pre{margin:0;white-space:pre-wrap}
    .cairn-richtext code{font-family:monospace;font-size:.85em}
  `;
};

// Design tokens for the redesigned Notes panel (#cairn-modal), matching the
// "Panel" UI reference. Kept separate from `styles`/`baseStyles` above, which
// remain in use by the Add-to-Topic modal, comment popover, and library-access
// panel — none of those are in scope for this redesign.
const panel = {
  colors: {
    bg: '#F7F8F6',
    text: '#1C2624',
    subtext: '#5D6A67',
    subtext2: '#3E4A47',
    border: '#E4E8E5',
    borderStrong: '#DDE3E0',
    card: '#FFFFFF',
    tabTrack: '#EBEFED',
    tabBadgeOn: '#E7EFEC',
    tabBadgeOff: '#DFE5E2',
    iconBg: '#E7EFEC',
    topicPillBg: '#EEF2F0',
    replyBg: '#F4F6F5',
    danger: '#A33A2A',
    dangerBg: '#F7ECE9',
    muted: '#9AA6A2',
    accent: '#2F6F62' // mockup's own accent color (Main.dc.html props default), not the Claude brand orange
  },
  font: {
    sans: "'Instrument Sans', system-ui, sans-serif",
    serif: "'Newsreader', Georgia, serif"
  },
  sourceColors: {
    Claude: '#B07A4F',
    ChatGPT: '#3F8A74',
    Gemini: '#5676B3',
    Grok: '#6E6E73',
    Kimi: '#8A6FB0'
  }
};

const injectPanelStyles = () => {
  if (!document.getElementById('cairn-panel-font')) {
    const link = document.createElement('link');
    link.id = 'cairn-panel-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap';
    document.head.appendChild(link);
  }
  let s = document.getElementById('cairn-panel-styles');
  if (!s) {
    s = document.createElement('style');
    s.id = 'cairn-panel-styles';
    document.head.appendChild(s);
  }
  s.textContent = `
    #cairn-modal .cairn-ib, #cairn-onboarding-modal .cairn-ib{transition:background .15s,color .15s}
    #cairn-modal .cairn-ib:hover, #cairn-onboarding-modal .cairn-ib:hover{background:#EDF1EF;color:${panel.colors.text}}
    #cairn-modal .cairn-card:hover{border-color:${panel.colors.borderStrong}}
    #cairn-modal .cairn-lnk{text-decoration:none}
    #cairn-modal .cairn-lnk:hover{text-decoration:underline}
    #cairn-modal .cairn-danger-btn:hover{color:${panel.colors.danger};background:${panel.colors.dangerBg}}
    #cairn-modal .cairn-primary-btn:hover, #cairn-onboarding-modal .cairn-primary-btn:hover{filter:brightness(1.1)}
    #cairn-modal .cairn-chip:hover{border-color:${panel.colors.borderStrong}}
  `;
};

const panelIconButtonStyle = (size = '36px') => ({
  width: size,
  height: size,
  border: '0',
  borderRadius: '9px',
  background: 'transparent',
  color: panel.colors.subtext,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '0',
  flexShrink: '0'
});

// bucketId -> a human-readable source label + accent color for cross-bucket
// Topics-tab cards. Non-'web:' bucket ids are Claude conversations.
function getBucketSourceLabel(bucketId) {
  if (!bucketId || !bucketId.startsWith('web:')) return 'Claude';
  const host = bucketId.slice(4);
  if (host === 'chatgpt.com' || host === 'chat.openai.com') return 'ChatGPT';
  if (host === 'gemini.google.com') return 'Gemini';
  if (host === 'grok.com' || host === 'grok.x.ai') return 'Grok';
  if (host === 'kimi.com' || host === 'kimi.moonshot.cn') return 'Kimi';
  return host;
}

function formatRelativeClipTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const diffMin = Math.floor((now - d) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((startOfToday - startOfDate) / 86400000);
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return d.toLocaleDateString(undefined, { weekday: 'short' });
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const createStyleObject = (...objects) => Object.assign({}, ...objects);

const baseStyles = {
  modal: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '350px',
    maxHeight: 'calc(100vh - 40px)',
    backgroundColor: styles.colors.background.white,
    border: `1px solid ${styles.colors.border}`,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '10000',
    display: 'none', // Initially hidden
    flexDirection: 'column',
    overflow: 'hidden',
    // Update font family here
    fontFamily: '\'Lato\', Arial, sans-serif', 
    fontSize: '14px',
    color: styles.colors.text.dark
  },
  header: {
    padding: styles.spacing.md,
    backgroundColor: styles.colors.background.light,
    borderBottom: `1px solid ${styles.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  container: {
    display: 'flex',
    borderBottom: `1px solid ${styles.colors.border}`,
    backgroundColor: styles.colors.background.light
  },
  tab: {
    padding: `${styles.spacing.sm} ${styles.spacing.lg}`,
    border: 'none',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flex: '1',
    fontSize: '14px'
  },
  tabActive: {
    fontWeight: 'bold',
    borderBottom: `2px solid ${styles.colors.primary}`
  },
  content: {
    padding: styles.spacing.md,
    overflowY: 'auto',
    flex: '1'
  },
  actions: {
    padding: styles.spacing.md,
    borderTop: `1px solid ${styles.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  actionButton: {
    padding: `${styles.spacing.sm} ${styles.spacing.md}`,
    borderRadius: '4px',
    cursor: 'pointer',
    color: styles.colors.background.white,
    textDecoration: 'none',
    display: 'inline-block'
  },
  clip: {
    padding: styles.spacing.sm,
    marginBottom: styles.spacing.sm,
    border: `1px solid ${styles.colors.border}`,
    borderRadius: '4px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: styles.spacing.sm
  },
  clipNumber: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  clipContent: {
    flex: '1',
    minWidth: '0'
  },
  clipText: {
    margin: '0',
    fontSize: '0.875rem',
    width: '100%',
    overflowX: 'hidden',
    textOverflow: 'ellipsis'
  },
  clipTextSecondary: {
    fontStyle: 'italic'
  },
  codeClip: {
    display: 'block',
    backgroundColor: '#1e1e1e', // Dark background for code
    color: '#d4d4d4', // Light text for code
    padding: styles.spacing.sm,
    borderRadius: '4px',
    // Keep specific monospace font for code blocks
    fontFamily: '"Fira Code", "Menlo", "Monaco", "Courier New", monospace', 
    whiteSpace: 'pre', // Changed from pre-wrap to pre
    overflowX: 'auto', // Keep this for horizontal scroll
    fontSize: '0.85em', // Slightly smaller font for code
    lineHeight: '1.4',
    maxHeight: '150px',
    overflowY: 'auto'
  },
  deleteButton: {
    position: 'absolute',
    top: styles.spacing.sm,
    right: styles.spacing.sm,
    background: 'none',
    border: 'none',
    color: styles.colors.text.normal,
    fontSize: '1.25rem',
    cursor: 'pointer',
  }
};

const applyStyles = (element, styleObject) => {
  Object.assign(element.style, styleObject);
};

// Global variables
let noteModal;
let clips = [];
let allClips = {}; // Organized by conversation ID
let currentClipId = 0;
let comments = [];
let currentCommentId = 0;
let currentConversationId = '';
let conversationTitle = '';
let lastUrl = ''; // Track URL for SPA navigation detection
let activeTab = 'clips'; // Track active tab
let isApplyingHighlights = false;
let currentAnnotationFilter = null; // Holds a topic id when the Topics tab filter is active
let topicsCache = []; // In-memory mirror of cairnTopics, kept in sync so sync render paths can resolve topicId -> name
let sendCommentToInput = localStorage.getItem('cairn-send-on-comment') !== 'false';
let activeArtifactName = null;
let activeArtifactTimeout = null;
let lastClipShortcutTime = 0;
let hasInitialized = false;
const CLIP_SHORTCUT_DOUBLE_TAP_MS = 400;

function isClaudeSite() {
  const host = window.location.hostname;
  return host === 'claude.ai' || host.endsWith('.claude.ai');
}

function isWebClipMode() {
  return !isClaudeSite();
}

/** Clips are matched back to page elements (tag + elementText + occurrenceIndex) so they
 *  can be highlighted and restored on reload. This locator system doesn't assume any
 *  particular site structure — it just walks up from the selection to the nearest element
 *  ancestor and re-finds it later by tag + trimmed text + nth-occurrence — so it applies
 *  the same way on Claude and on any other site. Restoration degrades gracefully (no
 *  match found -> no highlight rendered, no error) if a site's DOM changes shape between
 *  visits, which is expected on unfamiliar/arbitrary sites. */
function supportsElementHighlights() {
  return true;
}

function getBucketId() {
  if (isClaudeSite()) {
    return extractConversationId();
  }
  return 'web:' + location.hostname;
}

function getBucketTitle() {
  if (isClaudeSite()) {
    return document.title.replace(' - Claude', '').trim();
  }
  return document.title.trim() || location.hostname;
}

function ensureBucket() {
  if (!currentConversationId || currentConversationId === 'default') return;
  if (!allClips[currentConversationId]) {
    allClips[currentConversationId] = {
      id: currentConversationId,
      title: conversationTitle,
      lastUpdated: new Date().toISOString(),
      clips: [],
      comments: []
    };
  }
}

// Style utility functions
const buttonStyles = {
  base: {
    padding: '5px 10px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
  },
  container: {
    position: 'absolute',
    zIndex: '10001',
    display: 'flex',
    gap: '5px'
  }
};

const applyButtonStyles = (button, type = 'primary') => {
  Object.assign(button.style, buttonStyles.base);
  button.style.backgroundColor = type === 'primary' ? '#c96442' : '#444';
};

function getChatComposerEditable(root) {
  if (!root) return null;
  if (root instanceof HTMLTextAreaElement || root instanceof HTMLInputElement) return root;
  if (root.isContentEditable) return root;
  const inner = root.querySelector('[contenteditable="true"]');
  return inner || root;
}

function moveCaretToEnd(el) {
  if (!el) return;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    let len = el.value.length;
    if (el.maxLength > 0 && len > el.maxLength) len = el.maxLength;
    el.setSelectionRange(len, len);
    return;
  }
  if (el.isContentEditable) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function sendToClaudeInput(text) {
  const input = document.querySelector('[data-testid="chat-input"]');
  if (!input) return false;
  const editable = getChatComposerEditable(input);
  input.focus();
  const runInsert = () => {
    try {
      moveCaretToEnd(editable);
    } catch (_) {
      /* selection APIs can throw in edge cases; insertText still runs */
    }
    document.execCommand('insertText', false, text);
  };
  requestAnimationFrame(runInsert);
  return true;
}

// Inject a Notes button into Claude's action bar, before Share
function findShareButton() {
  return (
    document.querySelector('[data-testid="wiggle-controls-actions-share"]') ||
    document.querySelector('[data-testid="wiggle-controls-actions"] button') ||
    Array.from(document.querySelectorAll('button')).find(
      (btn) => btn.textContent.trim() === 'Share'
    ) ||
    null
  );
}

function injectHeaderButton() {
  const buttonId = 'cairn-action-button';
  const checkInterval = setInterval(() => {
    if (document.getElementById(buttonId)) {
      clearInterval(checkInterval);
      return;
    }

    const shareButton = findShareButton();
    // Actions bar is the direct parent of Share in current Claude DOM
    const actionsContainer =
      shareButton?.closest('[data-testid="wiggle-controls-actions"]') ||
      shareButton?.parentElement;

    if (!shareButton || !actionsContainer) return;

    clearInterval(checkInterval);

    const notesButton = shareButton.cloneNode(true);
    notesButton.id = buttonId;
    notesButton.removeAttribute('data-testid');
    notesButton.setAttribute('data-testid', 'cairn-notes-button');
    notesButton.removeAttribute('aria-pressed');
    notesButton.removeAttribute('aria-expanded');
    notesButton.removeAttribute('aria-haspopup');

    const newSvgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path fill="currentColor" fill-rule="evenodd" d="M3.422 2.85a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v12.3a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-.68H3a.422.422 0 0 1 0-.845h.422v-1.68H3a.422.422 0 0 1 0-.843h.422v-1.68H3a.422.422 0 0 1 0-.843h.422v-1.68H3a.422.422 0 0 1 0-.844h.422v-1.68H3a.422.422 0 0 1 0-.843h.422v-.683Zm.844 1.525h.425a.422.422 0 0 0 0-.843h-.425v-.59a.25.25 0 0 1 .25-.25h9.812a.25.25 0 0 1 .25.25V15.06a.25.25 0 0 1-.25.25H4.516a.25.25 0 0 1-.25-.25v-.59h.425a.422.422 0 0 0 0-.843h-.425v-1.68h.425a.42.42 0 0 0 .262-.091.425.425 0 0 0 .16-.331.422.422 0 0 0-.422-.422h-.425v-1.68h.425a.422.422 0 0 0 0-.843h-.425v-1.68h.425a.422.422 0 0 0 0-.844h-.425v-1.68Zm1.695.84c0 .233.19.422.422.422h6.084a.422.422 0 0 0 0-.844H6.383a.415.415 0 0 0-.309.136.39.39 0 0 0-.107.223l-.006.063Zm0 2.524c0 .233.19.422.422.422h6.084a.422.422 0 0 0 0-.844H6.383a.422.422 0 0 0-.422.422Zm.422 2.945a.422.422 0 0 1 0-.844h6.084a.422.422 0 0 1 0 .844H6.383Zm-.422 2.102c0 .233.19.421.422.421h6.084a.422.422 0 0 0 0-.843H6.383a.423.423 0 0 0-.422.422Z" clip-rule="evenodd"/></svg>`;

    // Keep Claude's CDS button chrome (bg span); only swap the label span
    const labelSpan = notesButton.querySelector('span:not([aria-hidden])');
    if (labelSpan) {
      labelSpan.innerHTML = newSvgMarkup + ' Notes';
    } else {
      notesButton.innerHTML = newSvgMarkup + ' Notes';
    }

    notesButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      chrome.runtime.sendMessage({ action: 'toggleModal' });
    });

    actionsContainer.insertBefore(notesButton, shareButton);
  }, 500);

  setTimeout(() => {
    clearInterval(checkInterval);
    if (!document.getElementById(buttonId)) {
      console.log('Cairn:Could not find Share button anchor after 15 seconds.');
    }
  }, 15000);
}

function initWebClipMode() {
  currentConversationId = getBucketId();
  conversationTitle = getBucketTitle();
  lastUrl = window.location.href;
  if (supportsElementHighlights()) {
    injectHighlightStyles();
    setupWebHighlightUrlMonitoring();
  }
  loadClips();
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keydown', handleClipDoubleTapShortcut, true);
}

// Initialize extension (once per page; SPA navigation is handled by setupUrlChangeMonitoring)
function init() {
  if (hasInitialized) return;
  hasInitialized = true;

  setupStorageChangeMonitoring();

  if (isWebClipMode()) {
    // Every non-Claude site gets the full Notes modal (Clips + Topics), same as Claude.
    initWebClipMode();
    return;
  }

  
  // Inject our styles
  injectHighlightStyles();
  
  // Attempt to inject the header/action bar button
  injectHeaderButton(); // This now targets the action bar button
  
  // Store current URL
  lastUrl = window.location.href;
  
  // Extract conversation ID from URL
  currentConversationId = extractConversationId();
  
  
  // Get conversation title
  conversationTitle = getBucketTitle();
  
  
  // Create modal if it doesn't exist yet (including new chats with no /chat/[id] yet)
  if (!document.getElementById('cairn-modal')) {
    createModal();
  }
  
  // Clipping / highlights only once a conversation id exists
  if (currentConversationId !== 'default') {
    // Load saved clips
    loadClips();
    
    // Add event listeners
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keydown', handleClipDoubleTapShortcut, true);

    // Track which artifact panel the user most recently opened (must stay aligned with findArtifactViewControl)
    document.addEventListener('click', (e) => {
      const btn =
        e.target.closest('[aria-label^="View "]') ||
        e.target.closest('[aria-label^="Open "]');
      if (btn) {
        const label = btn.getAttribute('aria-label') || '';
        activeArtifactName = label.replace(/^View\s+/i, '').replace(/^Open\s+/i, '').trim();
        clearTimeout(activeArtifactTimeout);
        activeArtifactTimeout = setTimeout(() => { activeArtifactName = null; }, 30000);
      }
    }, true);
    
    // Show modal on initial load if we have a valid conversation
    if (noteModal) {
      noteModal.style.display = 'flex';
    }
    
    // Set up a content-ready check to ensure Claude has loaded its content
    waitForClaudeContent();
  } else {
    clips = [];
    comments = [];
    currentClipId = 0;
    currentCommentId = 0;
    document.removeEventListener('mouseup', handleTextSelection);
    document.removeEventListener('keydown', handleClipDoubleTapShortcut, true);
    if (noteModal) {
      updateModalContent();
    }
  }
  
  // Add resize listener to keep modal within bounds
  window.addEventListener('resize', ensureModalWithinBounds);
  
  // Setup URL change monitoring for SPA navigation
  setupUrlChangeMonitoring();
}

// Notes/topics can also be deleted from library.html, a separate page/tab. Keep this
// content script's in-memory clips/topics (and the modal, if open) in sync with storage
// writes that didn't originate here, so deleted topics/clips don't linger until reload.
function setupStorageChangeMonitoring() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;

    if (changes.cairnTopics) {
      topicsCache = changes.cairnTopics.newValue || [];
      if (noteModal) updateModalContent();
    }

    if (changes.cairnNotesV2) {
      allClips = changes.cairnNotesV2.newValue || {};
      const bucket = allClips[currentConversationId];
      clips = bucket ? bucket.clips : [];
      comments = bucket ? (bucket.comments || []) : [];
      clearAllHighlights();
      applyHighlights();
      applyCommentHighlights();
      if (noteModal) updateModalContent();
    }
  });
}

// Wait for Claude's content to be ready before applying highlights
function waitForClaudeContent(attempt = 0, maxAttempts = 10) {
  // Check if Claude has rendered its messages
  const messageContainers = document.querySelectorAll('.message, .prose, [role="region"], .whitespace-pre-wrap');
  
  if (messageContainers.length > 0) {
    // Apply highlights now that content is available
    setTimeout(() => {
      applyHighlights();
      applyCommentHighlights();
    }, 200);
  } else if (attempt < maxAttempts) {
    // Retry with exponential backoff
    const delay = 300 * Math.pow(1.5, attempt);
    setTimeout(() => {
      waitForClaudeContent(attempt + 1, maxAttempts);
    }, delay);
  }
}

// Setup monitoring for URL changes in SPA
function setupUrlChangeMonitoring() {
  // Check frequently for URL changes (SPA navigation)
  setInterval(checkUrlChange, 1000);
  
  // Also use a MutationObserver as a backup detection method
  const observer = new MutationObserver((mutations) => {
    // If URL has changed, the title often changes too
    if (window.location.href !== lastUrl) {
      checkUrlChange();
    }
  });
  
  // Observe title changes which often correlate with navigation
  observer.observe(document.querySelector('title'), { 
    subtree: true, 
    characterData: true, 
    childList: true 
  });
}

// Check if URL has changed and handle conversation changes
function checkUrlChange() {
  const currentUrl = window.location.href;
  const previousUrl = lastUrl; // Store previous URL for comparison

  // If URL hasn't changed, do nothing
  if (currentUrl === previousUrl) return;

  lastUrl = currentUrl; // Update lastUrl immediately

  // Get new conversation ID
  const newConversationId = extractConversationId();

  // Handle case where URL changes but ID extraction might be delayed
  if (newConversationId === 'default' && currentUrl.includes('claude.ai/chat/')) {
    setTimeout(checkUrlChange, 500); // Retry after delay
    return;
  }

  // Handle navigation AWAY from a conversation (new chat / home)
  if (newConversationId === 'default') {
    currentConversationId = newConversationId;
    conversationTitle = getBucketTitle();
    clips = [];
    comments = [];
    currentClipId = 0;
    currentCommentId = 0;

    // Stop clipping until a chat id exists; keep modal available via toolbar / Notes
    document.removeEventListener('mouseup', handleTextSelection);
    document.removeEventListener('keydown', handleClipDoubleTapShortcut, true);
    clearAllHighlights();

    if (!document.getElementById('cairn-modal')) {
      createModal();
    }
    if (noteModal) {
      updateModalContent();
    }

    // Re-inject Notes if Share bar is present (e.g. new chat UI)
    injectHeaderButton();
    return;
  }

  // --- Key Change: Ensure button injection happens on valid navigation ---
  // Whether the conversation ID changed or just the URL (indicating potential DOM update),
  // ensure the button is present.
  injectHeaderButton(); // Call injection function - it has internal checks

  // Handle conversation *data* change only if ID is different
  if (newConversationId !== currentConversationId) {
    currentConversationId = newConversationId;

    // Update conversation title (with retry for SPA transitions)
    const updateTitle = () => {
      conversationTitle = document.title.replace(' - Claude', '').trim();

      if (conversationTitle === 'Claude' || conversationTitle === '') {
        setTimeout(updateTitle, 300);
        return;
      }


      // Add selection listeners if they were removed
      document.removeEventListener('mouseup', handleTextSelection);
      document.addEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keydown', handleClipDoubleTapShortcut, true);
      document.addEventListener('keydown', handleClipDoubleTapShortcut, true);

      // Reload clips for the new conversation
      loadClips(); // This will eventually call applyHighlights via waitForClaudeContent

      // Update modal content if it's visible
      if (noteModal && noteModal.style.display !== 'none') {
        updateModalContent();
      }

      // Clear old highlights before loading new ones
      clearAllHighlights();
    };

    updateTitle(); // Start the title update process
  } else {
      // Optional: Maybe trigger a light refresh or highlight check even if ID is the same?
      // For now, ensuring the button exists is the main goal.
      // We might need to re-apply highlights if the content area also re-rendered.
      waitForClaudeContent(); // Re-check content and apply highlights if needed
  }
}

// Extract conversation ID from URL
function extractConversationId() {
  const url = window.location.href;
  const match = url.match(/\/chat\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : 'default';
}

// Many sites are single-page apps: navigating within them swaps content without a
// full reload, which drops any highlight spans in it. The clip bucket for web sites
// is per-hostname (not per-page), so there is no data to reload here — just reapply
// highlights against whatever page is now shown.
function setupWebHighlightUrlMonitoring() {
  let lastWebUrl = window.location.href;
  const reapply = () => {
    if (window.location.href === lastWebUrl) return;
    lastWebUrl = window.location.href;
    setTimeout(() => applyHighlights(), 300);
  };
  setInterval(reapply, 1000);
  const titleEl = document.querySelector('title');
  if (titleEl) {
    new MutationObserver(reapply).observe(titleEl, { subtree: true, characterData: true, childList: true });
  }
}

// Ensure initialization runs at the right time
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Create the floating modal
function createModal() {
  injectPanelStyles();

  // Create modal container
  noteModal = document.createElement('div');
  noteModal.id = 'cairn-modal';
  applyStyles(noteModal, {
    position: 'fixed',
    top: '100px',
    right: '24px',
    width: '380px',
    maxHeight: 'min(640px, calc(100vh - 140px))',
    boxSizing: 'border-box',
    display: 'none', // Start hidden
    flexDirection: 'column',
    background: panel.colors.bg,
    border: `1px solid ${panel.colors.borderStrong}`,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '10000',
    fontFamily: panel.font.sans,
    fontSize: '14px',
    color: panel.colors.text
  });

  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.id = 'cairn-header';
  applyStyles(modalHeader, {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 12px 14px 16px',
    flexShrink: '0'
  });

  const iconBox = document.createElement('div');
  applyStyles(iconBox, {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: panel.colors.iconBg,
    color: panel.colors.accent,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0'
  });
  const iconBoxImg = document.createElement('img');
  iconBoxImg.src = chrome.runtime.getURL('images/cairn-stack.png');
  iconBoxImg.alt = '';
  applyStyles(iconBoxImg, { width: '20px', height: '20px', objectFit: 'contain', mixBlendMode: 'multiply' });
  iconBox.appendChild(iconBoxImg);

  const titleBlock = document.createElement('div');
  applyStyles(titleBlock, { display: 'flex', flexDirection: 'column', gap: '1px', flexGrow: '1', minWidth: '0' });

  const modalTitle = document.createElement('div');
  modalTitle.textContent = 'Cairn';
  applyStyles(modalTitle, { fontSize: '15px', fontWeight: '600', letterSpacing: '-0.01em' });

  titleBlock.appendChild(modalTitle);

  // Placeholder for a future settings panel — for now it just opens the
  // onboarding modal so it can be previewed/tested on demand. Whether this
  // stays as the permanent way in (vs. a real settings surface) is TBD.
  const settingsButton = document.createElement('button');
  settingsButton.className = 'cairn-ib';
  settingsButton.setAttribute('aria-label', 'Settings');
  applyStyles(settingsButton, panelIconButtonStyle('36px'));
  settingsButton.appendChild(CairnIcons.createIcon('settings', 17, panel.colors.subtext));
  settingsButton.addEventListener('click', () => {
    openOnboardingModal();
  });

  const closeButton = document.createElement('button');
  closeButton.className = 'cairn-ib';
  closeButton.setAttribute('aria-label', 'Close panel');
  applyStyles(closeButton, panelIconButtonStyle('36px'));
  closeButton.appendChild(CairnIcons.createIcon('x', 17, panel.colors.subtext));
  closeButton.addEventListener('click', () => {
    noteModal.style.display = 'none';
  });

  modalHeader.appendChild(iconBox);
  modalHeader.appendChild(titleBlock);
  modalHeader.appendChild(settingsButton);
  modalHeader.appendChild(closeButton);

  // Make header draggable — translate3d during drag (compositor), commit left/top on release
  modalHeader.style.cursor = 'grab';
  modalHeader.style.touchAction = 'none';

  function setupModalDrag(startEvent) {
    if (startEvent.target.closest && startEvent.target.closest('button')) return;
    if (startEvent.pointerType === 'mouse' && startEvent.button !== 0) return;
    startEvent.preventDefault();

    const rect = noteModal.getBoundingClientRect();
    const baseLeft = rect.left;
    const baseTop = rect.top;
    noteModal.style.left = `${baseLeft}px`;
    noteModal.style.top = `${baseTop}px`;
    noteModal.style.right = '';
    modalHeader.style.cursor = 'grabbing';
    noteModal.style.userSelect = 'none';

    const startX = startEvent.clientX;
    const startY = startEvent.clientY;
    const pointerId = startEvent.pointerId;

    let captureOk = false;
    if (typeof pointerId === 'number' && modalHeader.setPointerCapture) {
      try {
        modalHeader.setPointerCapture(pointerId);
        captureOk = true;
      } catch (_) {
        captureOk = false;
      }
    }

    const moveTarget = captureOk ? modalHeader : document;
    const usePointer =
      typeof window.PointerEvent !== 'undefined' && startEvent instanceof PointerEvent;

    let dragEnded = false;

    function onMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      noteModal.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }

    function onEnd(e) {
      if (dragEnded) return;
      dragEnded = true;
      if (captureOk && typeof pointerId === 'number' && modalHeader.releasePointerCapture) {
        try {
          modalHeader.releasePointerCapture(pointerId);
        } catch (_) {
          /* ignore */
        }
      }

      if (usePointer) {
        moveTarget.removeEventListener('pointermove', onMove);
        moveTarget.removeEventListener('pointerup', onEnd);
        moveTarget.removeEventListener('pointercancel', onEnd);
      } else {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
      }

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      noteModal.style.transform = '';
      noteModal.style.left = `${baseLeft + dx}px`;
      noteModal.style.top = `${baseTop + dy}px`;
      modalHeader.style.cursor = 'grab';
      noteModal.style.userSelect = '';
      ensureModalWithinBounds();
      chrome.storage.local.set({
        cairnModalPosition: {
          top: noteModal.style.top,
          left: noteModal.style.left
        }
      });
    }

    if (usePointer) {
      moveTarget.addEventListener('pointermove', onMove);
      moveTarget.addEventListener('pointerup', onEnd);
      moveTarget.addEventListener('pointercancel', onEnd);
    } else {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
    }
  }

  if (typeof window.PointerEvent !== 'undefined') {
    modalHeader.addEventListener('pointerdown', setupModalDrag);
  }
  modalHeader.addEventListener('mousedown', (e) => {
    if (typeof window.PointerEvent !== 'undefined') return;
    setupModalDrag(e);
  });

  // Tab bar — contents are (re)rendered by renderTabsRow() so badge counts stay live
  const tabsEl = document.createElement('div');
  tabsEl.id = 'cairn-tabs';

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.id = 'cairn-content';
  applyStyles(modalContent, {
    flexGrow: '1',
    overflowY: 'auto',
    padding: '14px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxSizing: 'border-box'
  });

  // Footer actions
  const modalActions = document.createElement('div');
  modalActions.id = 'cairn-actions';
  applyStyles(modalActions, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderTop: `1px solid ${panel.colors.border}`,
    background: panel.colors.bg,
    flexShrink: '0',
    boxSizing: 'border-box'
  });

  const clearButton = document.createElement('button');
  clearButton.id = 'cairn-clear-all-button';
  clearButton.className = 'cairn-danger-btn';
  clearButton.textContent = 'Clear all';
  applyStyles(clearButton, {
    height: '38px',
    padding: '0 12px',
    border: '0',
    borderRadius: '9px',
    background: 'transparent',
    color: panel.colors.subtext,
    font: `500 13px ${panel.font.sans}`,
    cursor: 'pointer'
  });
  clearButton.addEventListener('click', clearAllClips);

  const actionsSpacer = document.createElement('div');
  applyStyles(actionsSpacer, { flexGrow: '1' });

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'cairn-view-all-button';
  viewAllButton.className = 'cairn-primary-btn';
  applyStyles(viewAllButton, {
    height: '38px',
    padding: '0 14px',
    border: '0',
    borderRadius: '10px',
    background: panel.colors.accent,
    color: '#FFFFFF',
    font: `500 13px ${panel.font.sans}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  });
  viewAllButton.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6z"></path><path d="M6 4v16M10 8.5h5M10 12.5h5"></path></svg>Open notebook';
  viewAllButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openLibrary' });
  });

  modalActions.appendChild(clearButton);
  modalActions.appendChild(actionsSpacer);
  modalActions.appendChild(viewAllButton);

  // Assemble modal
  noteModal.appendChild(modalHeader);
  noteModal.appendChild(tabsEl);
  noteModal.appendChild(modalContent);
  noteModal.appendChild(modalActions);

  // Add modal to document
  document.body.appendChild(noteModal);

  renderTabsRow({ clips: 0, topics: 0, comments: 0 });

  maybeShowOnboarding();
}

// --- Onboarding (first-launch walkthrough) ---
// Design reference: ui-updates/Onboarding · first launch-html. Auto-shown once,
// extension-wide, the first time the full Notes modal is created (Claude or any
// other site — see createModal()'s maybeShowOnboarding() call). The
// settings icon in the modal header re-opens it on demand for testing; whether
// that stays as a permanent access point is a decision for later.
const ONBOARDING_SEEN_KEY = 'cairnOnboardingSeen';

const ONBOARDING_STEPS = [
  {
    kicker: 'Clips',
    heading: 'Clips keep what matters',
    body: 'Highlight any passage and save it as a clip. Clips stay with the site you saved them on, and each one links back to its spot in the conversation.',
    claudeOnly: false
  },
  {
    kicker: 'Topics',
    heading: 'Topics gather your research',
    body: 'When you’re going deeper, file a clip under a topic. Topics pull clips together across Claude, ChatGPT, Gemini and Grok, so one line of research lives in one place.',
    claudeOnly: false
  },
  {
    kicker: 'Comments',
    heading: 'Comments start your next prompt',
    body: 'Clip a passage and add a note. Both drop into Claude’s message box, ready to send, and the clip is still saved for later.',
    claudeOnly: true
  }
];

let onboardingStep = 0;

function maybeShowOnboarding() {
  chrome.storage.local.get([ONBOARDING_SEEN_KEY], (result) => {
    if (result[ONBOARDING_SEEN_KEY]) return;
    openOnboardingModal();
    chrome.storage.local.set({ [ONBOARDING_SEEN_KEY]: true });
  });
}

function openOnboardingModal() {
  if (!document.getElementById('cairn-onboarding-modal')) {
    createOnboardingModal();
  }
  const modal = document.getElementById('cairn-onboarding-modal');
  modal.style.display = 'flex';
  renderOnboardingStep(0);
}

function closeOnboardingModal() {
  const modal = document.getElementById('cairn-onboarding-modal');
  if (modal) modal.style.display = 'none';
}

function createOnboardingModal() {
  injectPanelStyles();

  const modal = document.createElement('div');
  modal.id = 'cairn-onboarding-modal';
  applyStyles(modal, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '380px',
    height: '640px',
    maxHeight: 'calc(100vh - 40px)',
    boxSizing: 'border-box',
    display: 'none',
    flexDirection: 'column',
    background: panel.colors.bg,
    border: `1px solid ${panel.colors.borderStrong}`,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(28,38,36,.3)',
    zIndex: '10003',
    fontFamily: panel.font.sans,
    fontSize: '14px',
    color: panel.colors.text
  });

  // Header
  const header = document.createElement('div');
  applyStyles(header, { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 12px 10px 16px', flexShrink: '0' });

  const iconBox = document.createElement('div');
  applyStyles(iconBox, {
    width: '34px', height: '34px', borderRadius: '10px',
    background: panel.colors.iconBg, color: panel.colors.accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0'
  });
  const iconImg = document.createElement('img');
  iconImg.src = chrome.runtime.getURL('images/cairn-stack.png');
  iconImg.alt = '';
  applyStyles(iconImg, { width: '20px', height: '20px', objectFit: 'contain', mixBlendMode: 'multiply' });
  iconBox.appendChild(iconImg);

  const title = document.createElement('div');
  title.textContent = 'Welcome to Cairn';
  applyStyles(title, { fontSize: '15px', fontWeight: '600', letterSpacing: '-0.01em', flexGrow: '1' });

  const skipButton = document.createElement('button');
  skipButton.className = 'cairn-ib';
  skipButton.textContent = 'Skip';
  applyStyles(skipButton, {
    height: '34px', padding: '0 10px', border: '0', borderRadius: '9px',
    background: 'transparent', color: panel.colors.subtext,
    font: `500 13px ${panel.font.sans}`, cursor: 'pointer'
  });
  skipButton.addEventListener('click', closeOnboardingModal);

  header.appendChild(iconBox);
  header.appendChild(title);
  header.appendChild(skipButton);

  // Body — rebuilt per step by renderOnboardingStep()
  const body = document.createElement('div');
  body.id = 'cairn-onboarding-body';
  applyStyles(body, { flexGrow: '1', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 20px 0', overflowY: 'auto' });

  // Footer
  const footer = document.createElement('div');
  applyStyles(footer, { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px 16px', flexShrink: '0' });

  const progressWrap = document.createElement('div');
  applyStyles(progressWrap, { display: 'flex', alignItems: 'center', gap: '8px', flexGrow: '1', paddingLeft: '4px' });

  const progressDots = ONBOARDING_STEPS.map(() => {
    const dot = document.createElement('span');
    applyStyles(dot, { width: '7px', height: '7px', borderRadius: '50%', background: panel.colors.border, flexShrink: '0' });
    progressWrap.appendChild(dot);
    return dot;
  });

  const stepLabel = document.createElement('span');
  applyStyles(stepLabel, { fontSize: '12px', color: panel.colors.subtext });
  progressWrap.appendChild(stepLabel);

  const backButton = document.createElement('button');
  backButton.className = 'cairn-ib';
  backButton.textContent = 'Back';
  applyStyles(backButton, {
    height: '40px', padding: '0 14px', border: '0', borderRadius: '10px',
    background: 'transparent', color: panel.colors.subtext2,
    font: `500 13.5px ${panel.font.sans}`, cursor: 'pointer'
  });
  backButton.addEventListener('click', () => renderOnboardingStep(onboardingStep - 1));

  const nextButton = document.createElement('button');
  nextButton.className = 'cairn-primary-btn';
  applyStyles(nextButton, {
    height: '40px', padding: '0 18px', border: '0', borderRadius: '10px',
    background: panel.colors.accent, color: '#FFFFFF',
    font: `500 13.5px ${panel.font.sans}`, cursor: 'pointer'
  });
  nextButton.addEventListener('click', () => {
    if (onboardingStep === ONBOARDING_STEPS.length - 1) {
      closeOnboardingModal();
    } else {
      renderOnboardingStep(onboardingStep + 1);
    }
  });

  footer.appendChild(progressWrap);
  footer.appendChild(backButton);
  footer.appendChild(nextButton);

  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  document.body.appendChild(modal);

  modal._onboardingRefs = { body, progressDots, stepLabel, backButton, nextButton };
}

function renderOnboardingStep(n) {
  const modal = document.getElementById('cairn-onboarding-modal');
  if (!modal || !modal._onboardingRefs) return;
  onboardingStep = Math.max(0, Math.min(ONBOARDING_STEPS.length - 1, n));
  const step = ONBOARDING_STEPS[onboardingStep];
  const { body, progressDots, stepLabel, backButton, nextButton } = modal._onboardingRefs;

  body.innerHTML = '';
  body.appendChild(buildOnboardingPreview(onboardingStep));
  body.appendChild(buildOnboardingCopy(step));

  progressDots.forEach((dot, i) => {
    dot.style.background = i <= onboardingStep ? panel.colors.accent : panel.colors.border;
  });
  stepLabel.textContent = `${onboardingStep + 1} of ${ONBOARDING_STEPS.length}`;
  backButton.style.visibility = onboardingStep === 0 ? 'hidden' : 'visible';
  nextButton.textContent = onboardingStep === ONBOARDING_STEPS.length - 1 ? 'Start clipping' : 'Next';
}

function buildOnboardingCopy(step) {
  const wrap = document.createElement('div');
  applyStyles(wrap, { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 4px' });

  const kickerRow = document.createElement('div');
  applyStyles(kickerRow, { display: 'flex', alignItems: 'center', gap: '8px' });

  const kicker = document.createElement('span');
  kicker.textContent = step.kicker;
  applyStyles(kicker, { fontSize: '12px', fontWeight: '600', color: panel.colors.accent, letterSpacing: '0.04em', textTransform: 'uppercase' });
  kickerRow.appendChild(kicker);

  if (step.claudeOnly) {
    const badge = document.createElement('span');
    badge.textContent = 'Claude only';
    applyStyles(badge, { fontSize: '11px', fontWeight: '600', color: panel.colors.subtext, background: '#E6EAE8', borderRadius: '6px', padding: '2px 7px' });
    kickerRow.appendChild(badge);
  }

  const heading = document.createElement('h2');
  heading.textContent = step.heading;
  applyStyles(heading, { margin: '0', fontSize: '21px', fontWeight: '600', letterSpacing: '-0.015em', lineHeight: '1.25' });

  const body = document.createElement('p');
  body.textContent = step.body;
  applyStyles(body, { margin: '0', fontSize: '14px', lineHeight: '1.55', color: panel.colors.subtext });

  wrap.appendChild(kickerRow);
  wrap.appendChild(heading);
  wrap.appendChild(body);
  return wrap;
}

// Illustrative (not literal) preview of each feature, styled with the same
// tokens as the real modal so it doesn't need its own asset.
function buildOnboardingPreview(stepIndex) {
  const box = document.createElement('div');
  applyStyles(box, {
    height: '236px', boxSizing: 'border-box', flexShrink: '0',
    background: '#EDF2EF', borderRadius: '14px', padding: '20px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px'
  });

  if (stepIndex === 0) {
    const pill = document.createElement('div');
    applyStyles(pill, {
      alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '6px',
      background: panel.colors.text, color: '#FFFFFF', fontSize: '12px', fontWeight: '500',
      padding: '6px 10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(28,38,36,.18)'
    });
    pill.appendChild(CairnIcons.createIcon('copy', 13, '#FFFFFF'));
    pill.appendChild(document.createTextNode('Clip'));

    const card = document.createElement('p');
    card.style.margin = '0';
    applyStyles(card, { background: '#FFFFFF', borderRadius: '10px', padding: '14px', fontFamily: panel.font.serif, fontSize: '15px', lineHeight: '1.55', color: panel.colors.subtext });
    card.innerHTML = 'Most answers have one paragraph worth keeping. <span style="background:#CFE3DB;color:#1C2624;border-radius:3px;padding:1px 2px;">Select it and clip it</span> — the rest of the reply stays where it is.';

    box.appendChild(pill);
    box.appendChild(card);
  } else if (stepIndex === 1) {
    const pillRow = document.createElement('div');
    applyStyles(pillRow, { display: 'flex', gap: '6px' });
    ['Roadmap', 'Onboarding', 'Caching'].forEach((name, i) => {
      const pill = document.createElement('span');
      pill.textContent = name;
      applyStyles(pill, {
        fontSize: '12px', fontWeight: '500', padding: '5px 11px', borderRadius: '14px',
        background: i === 0 ? panel.colors.accent : '#FFFFFF',
        color: i === 0 ? '#FFFFFF' : panel.colors.subtext2,
        border: i === 0 ? 'none' : `1px solid ${panel.colors.borderStrong}`
      });
      pillRow.appendChild(pill);
    });

    const sources = [
      { name: 'Claude', color: panel.sourceColors.Claude, text: 'Cache invalidation is the hard half — writes need a plan, not just a TTL.' },
      { name: 'Grok', color: panel.sourceColors.Grok, text: 'Start with a TTL cache; add invalidation once you feel the staleness.' }
    ];
    const sourceStack = document.createElement('div');
    applyStyles(sourceStack, { display: 'flex', flexDirection: 'column', gap: '8px' });
    sources.forEach((s) => {
      const card = document.createElement('div');
      applyStyles(card, { background: '#FFFFFF', borderRadius: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' });
      const label = document.createElement('div');
      applyStyles(label, { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '600', color: panel.colors.subtext2 });
      const dot = document.createElement('span');
      applyStyles(dot, { width: '7px', height: '7px', borderRadius: '50%', background: s.color, flexShrink: '0' });
      label.appendChild(dot);
      label.appendChild(document.createTextNode(s.name));
      const text = document.createElement('div');
      text.textContent = s.text;
      applyStyles(text, { fontFamily: panel.font.serif, fontSize: '14px', lineHeight: '1.4' });
      card.appendChild(label);
      card.appendChild(text);
      sourceStack.appendChild(card);
    });

    box.appendChild(pillRow);
    box.appendChild(sourceStack);
  } else {
    const card = document.createElement('div');
    applyStyles(card, { background: '#FFFFFF', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 2px rgba(28,38,36,.06)' });

    const quote = document.createElement('div');
    quote.textContent = '“Rewrite this section in plain English.”';
    applyStyles(quote, { background: panel.colors.replyBg, borderRadius: '8px', padding: '9px 11px', fontFamily: panel.font.serif, fontStyle: 'italic', fontSize: '14px', lineHeight: '1.4', color: panel.colors.subtext });

    const comment = document.createElement('div');
    comment.textContent = 'Can you say this without the jargon?';
    applyStyles(comment, { fontSize: '14px', lineHeight: '1.45', color: panel.colors.text });

    const sendRow = document.createElement('div');
    applyStyles(sendRow, { display: 'flex', justifyContent: 'flex-end' });
    const sendBtn = document.createElement('span');
    applyStyles(sendBtn, { width: '30px', height: '30px', borderRadius: '9px', background: panel.colors.accent, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' });
    sendBtn.appendChild(CairnIcons.createIcon('arrowUp', 15, '#FFFFFF'));
    sendRow.appendChild(sendBtn);

    card.appendChild(quote);
    card.appendChild(comment);
    card.appendChild(sendRow);
    box.appendChild(card);
  }

  return box;
}

// Rebuilds the segmented tab bar (#cairn-tabs) with live badge counts.
function renderTabsRow(counts) {
  const tabsEl = document.getElementById('cairn-tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = '';

  const defs = [
    { id: 'clips', label: 'Clips', count: counts.clips },
    { id: 'annotations', label: 'Topics', count: counts.topics }
  ];
  // Comments are a Claude-only feature — no tab on other sites.
  if (!isWebClipMode()) {
    defs.push({ id: 'comments', label: 'Comments', count: counts.comments });
  }

  applyStyles(tabsEl, {
    margin: '0 16px',
    padding: '3px',
    background: panel.colors.tabTrack,
    borderRadius: '11px',
    display: 'grid',
    gridTemplateColumns: `repeat(${defs.length}, minmax(0, 1fr))`,
    gap: '2px',
    flexShrink: '0'
  });

  defs.forEach((t) => {
    const on = t.id === activeTab;
    const btn = document.createElement('button');
    applyStyles(btn, {
      height: '34px',
      border: '0',
      borderRadius: '8px',
      font: `500 13px ${panel.font.sans}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      cursor: 'pointer',
      transition: 'background .15s, color .15s',
      background: on ? '#FFFFFF' : 'transparent',
      color: on ? panel.colors.text : panel.colors.subtext,
      boxShadow: on ? '0 1px 2px rgba(28,38,36,.08), 0 0 0 1px rgba(28,38,36,.04)' : 'none'
    });
    btn.textContent = t.label;

    if (t.count > 0) {
      const badge = document.createElement('span');
      badge.textContent = String(t.count);
      applyStyles(badge, {
        fontSize: '11px',
        fontWeight: '600',
        minWidth: '18px',
        padding: '1px 5px',
        boxSizing: 'border-box',
        borderRadius: '9px',
        background: on ? panel.colors.tabBadgeOn : panel.colors.tabBadgeOff,
        color: on ? panel.colors.accent : panel.colors.subtext
      });
      btn.appendChild(badge);
    }

    btn.addEventListener('click', () => switchTab(t.id));
    tabsEl.appendChild(btn);
  });
}

// Switch between tabs
function switchTab(tabId) {
  activeTab = tabId;
  updateModalContent();
}

// Find the Claude message container from a node
function findMessageContainer(node) {
  // Look for Claude.ai message containers
  // Claude has updated its DOM structure multiple times, so we need to be comprehensive
  if (!node) return null;
  
  // Walk up the DOM tree to find a suitable container
  while (node && node !== document.body) {
    // Check for various class names and attributes that might indicate a message container
    
    // Direct class-based checks - check both className string and classList
    const className = node.className || '';
    if (typeof className === 'string') {
      // Check for common patterns in Claude's class names
      if (className.includes('message') || 
          className.includes('claude') || 
          className.includes('assistant') ||
          className.includes('prose') ||
          className.includes('text-message')) {
        return node;
      }
    }
    
    // Check using classList API if available
    if (node.classList && (
        node.classList.contains('message') || 
        node.classList.contains('claude-message') ||
        node.classList.contains('assistant-message') ||
        node.classList.contains('prose') ||
        node.classList.contains('assistant-content') ||
        node.classList.contains('whitespace-pre-wrap')
      )) {
      return node;
    }
    
    // Role-based checks for accessibility attributes
    if (node.getAttribute) {
      const role = node.getAttribute('role');
      const ariaLabel = node.getAttribute('aria-label');
      
      if ((role === 'region' || role === 'article') && 
          ariaLabel && 
          (ariaLabel.includes('Assistant') || ariaLabel.includes('Claude'))) {
        return node;
      }
    }
    
    // Data attribute checks
    if (node.dataset && 
        (node.dataset.message || 
         node.dataset.assistant || 
         node.dataset.claude)) {
      return node;
    }
    
    // Move up to parent node
    node = node.parentNode;
  }

  // If we can't find a container but we're definitely in the message area,
  // try to find a generic container that's large enough to be a message
  if (window.location.href.includes('claude.ai/chat')) {
    // Check if we're near any text that looks like a message
    if (node && node.textContent && node.textContent.length > 50) {
      return node;
    }
  }
  
  return null;
}

// Handle text selection
function isSelectionInsideIgnoredUi(selection) {
  if (!selection || selection.rangeCount === 0) return false;
  let ancestor = selection.getRangeAt(0).commonAncestorContainer;
  while (ancestor && ancestor !== document.body) {
    if (ancestor.nodeType === Node.ELEMENT_NODE &&
        (ancestor.id === 'cairn-modal' || ancestor.id === 'cairn-annotation-modal' ||
         ancestor.id === 'cairn-comment-popover' || ancestor.id === 'cairn-onboarding-modal' ||
         ancestor.getAttribute?.('data-testid') === 'chat-input')) {
      return true;
    }
    ancestor = ancestor.parentNode;
  }
  return false;
}

function isSelectionInCodeBlock(selection) {
  let node = selection?.anchorNode;
  while (node && node !== document.body) {
    if (node.nodeName === 'CODE' ||
        (node.classList &&
         node.classList.contains('prismjs') &&
         node.classList.contains('code-block__code'))) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function removeFloatingClipButtons() {
  const clipButton = document.getElementById('cairn-clip-button');
  const container = clipButton?.closest('div[style*="position: absolute"]');
  if (container && document.body.contains(container)) {
    document.body.removeChild(container);
  }
}

function flashClipButtonSaved() {
  const clipButton = document.getElementById('cairn-clip-button');
  if (!clipButton) {
    removeFloatingClipButtons();
    return;
  }
  clipButton.textContent = 'Saved!';
  clipButton.style.backgroundColor = '#4CAF50';
  setTimeout(() => removeFloatingClipButtons(), 1000);
}

// Double-tap C with an active selection clips the text (same as Clip button).
// Claude often steals focus to the composer on keypress — judge by where the
// selection lives, not activeElement. Capture-phase + preventDefault keeps "c"
// out of the chat box when we're claiming the shortcut.
function handleClipDoubleTapShortcut(e) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key.toLowerCase() !== 'c') {
    lastClipShortcutTime = 0;
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() || '';

  if (!selectedText || !selection.rangeCount) {
    lastClipShortcutTime = 0;
    return;
  }
  // Typing in composer / extension UI with that field selected — don't hijack
  if (isSelectionInsideIgnoredUi(selection)) {
    lastClipShortcutTime = 0;
    return;
  }

  const isCodeBlock = isSelectionInCodeBlock(selection);
  const range = selection.getRangeAt(0);
  // Claude: only clip message/code selections. Web: any page selection.
  if (!isWebClipMode()) {
    const container = findMessageContainer(range.commonAncestorContainer);
    if (!container && !isCodeBlock) {
      lastClipShortcutTime = 0;
      return;
    }
  }

  // Claim the key so it does not land in the chat composer / page inputs
  e.preventDefault();
  e.stopPropagation();

  const now = Date.now();
  if (now - lastClipShortcutTime <= CLIP_SHORTCUT_DOUBLE_TAP_MS) {
    lastClipShortcutTime = 0;
    saveClip(selection, isCodeBlock, false);
    flashClipButtonSaved();
    return;
  }

  lastClipShortcutTime = now;
}

function handleTextSelection(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  // Prevent clipping inside extension UI or the chat composer
  if (isSelectionInsideIgnoredUi(selection)) return;

  const isCodeBlock = isSelectionInCodeBlock(selection);
  const range = selection.getRangeAt(0);
  const canClip = isWebClipMode()
    || isCodeBlock
    || !!findMessageContainer(range.commonAncestorContainer);

  // Create clip button near selection if it doesn't exist
  if (canClip && !document.getElementById('cairn-clip-button')) {
    createClipButton(selection, isCodeBlock);
  }
}

// Create a clip button near the selected text
function createClipButton(selection, isCodeBlock) {
  // Remove any existing buttons first
  const existingButton = document.getElementById('cairn-clip-button');
  const existingSecondButton = document.getElementById('cairn-second-clip-button');
  if (existingButton) {
    document.body.removeChild(existingButton);
  }
  if (existingSecondButton) {
    document.body.removeChild(existingSecondButton);
  }
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Create container for buttons
  const buttonContainer = document.createElement('div');
  Object.assign(buttonContainer.style, buttonStyles.container);
  buttonContainer.style.left = `${rect.left + window.scrollX}px`;
  buttonContainer.style.top = `${rect.bottom + window.scrollY + 8}px`;
  
  // Primary clip button
  const clipButton = document.createElement('button');
  clipButton.id = 'cairn-clip-button';
  clipButton.textContent = isCodeBlock ? 'Clip Code' : 'Clip';
  applyButtonStyles(clipButton, 'primary');
  
  // Secondary clip button
  const secondClipButton = document.createElement('button');
  secondClipButton.id = 'cairn-second-clip-button';
  secondClipButton.textContent = 'Add to Topic';
  applyButtonStyles(secondClipButton, 'secondary');

  // Comment button (Claude only — web mode has no highlights/comments)
  let commentButton = null;
  if (!isWebClipMode()) {
    commentButton = document.createElement('button');
    commentButton.id = 'cairn-comment-button';
    commentButton.textContent = 'Comment';
    applyButtonStyles(commentButton, 'secondary');
  }

  clipButton.addEventListener('click', () => {
    saveClip(selection, isCodeBlock, false);
    clipButton.textContent = 'Saved!';
    clipButton.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        // Find the container to remove
        const buttonContainer = clipButton.closest('div[style*="position: absolute"]');
        if (buttonContainer && document.body.contains(buttonContainer)) {
            document.body.removeChild(buttonContainer);
        }
    }, 1000);
  });

  secondClipButton.addEventListener('click', () => {
    openAnnotationModal(selection, isCodeBlock);
    // Remove the button container immediately after opening the modal
    const buttonContainer = secondClipButton.closest('div[style*="position: absolute"]'); // Find the container using a more specific selector if needed
    if (buttonContainer && document.body.contains(buttonContainer)) {
        document.body.removeChild(buttonContainer);
    }
  });

  const capturedText = selection.toString().trim();
  const capturedRange = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
  if (commentButton) {
    commentButton.addEventListener('click', () => {
      openCommentPopover(capturedText, rect, capturedRange);
      const buttonContainer = commentButton.closest('div[style*="position: absolute"]');
      if (buttonContainer && document.body.contains(buttonContainer)) {
        document.body.removeChild(buttonContainer);
      }
    });
  }

  buttonContainer.appendChild(clipButton);
  buttonContainer.appendChild(secondClipButton);
  if (commentButton) {
    buttonContainer.appendChild(commentButton);
  }
  document.body.appendChild(buttonContainer);

  // Remove clip buttons when clicking elsewhere or after a timeout
  const removeClipButtons = (e) => {
    if (e && (e.target === clipButton || e.target === secondClipButton || e.target === commentButton)) return;

    if (document.body.contains(buttonContainer)) {
      document.body.removeChild(buttonContainer);
    }
    document.removeEventListener('mousedown', removeClipButtons);
  };
  
  document.addEventListener('mousedown', removeClipButtons);
  setTimeout(() => removeClipButtons(), 5000);
}

// Add this new function to recalculate clip IDs
function recalculateClipIds() {
    clips.sort((a, b) => a.id - b.id);
    clips.forEach((clip, index) => {
        const oldId = clip.id;
        clip.id = index;
        document.querySelectorAll(`.cairn-clip-highlight[data-clip-id="${oldId}"]`)
            .forEach(span => { span.dataset.clipId = index; });
    });
    currentClipId = clips.length;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function clipToRichHtml(clip) {
    if (clip.isCode) {
        return `<pre><code>${escapeHtml(clip.text)}</code></pre>`;
    }

    // Multi-element clips: render each stored block element
    if (clip.range?.isMultiElement && clip.range.elements?.length) {
        const parts = [];
        const els = clip.range.elements;
        let i = 0;
        while (i < els.length) {
            const el = els[i];
            if (el.type === 'li') {
                const tag = el.listType === 'ol' ? 'ol' : 'ul';
                const items = [];
                while (i < els.length && els[i].type === 'li') {
                    items.push(`<li>${escapeHtml(els[i].elementText)}</li>`);
                    i++;
                }
                parts.push(`<${tag}>${items.join('')}</${tag}>`);
                continue;
            }
            if (/^h[1-6]$/.test(el.type)) {
                parts.push(`<p><strong>${escapeHtml(el.elementText)}</strong></p>`);
            } else if (el.type === 'blockquote') {
                parts.push(`<p><em>${escapeHtml(el.elementText)}</em></p>`);
            } else {
                parts.push(`<p>${escapeHtml(el.elementText)}</p>`);
            }
            i++;
        }
        return parts.join('');
    }

    // Single-element clips: style selected text by element type
    if (clip.range?.elementContext) {
        const ctx = clip.range.elementContext;
        const text = clip.text;
        if (/^h[1-6]$/.test(ctx.type)) {
            return `<p><strong>${escapeHtml(text)}</strong></p>`;
        } else if (ctx.type === 'blockquote') {
            return `<p><em>${escapeHtml(text)}</em></p>`;
        } else if (ctx.type === 'li') {
            const tag = ctx.listType === 'ol' ? 'ol' : 'ul';
            return `<${tag}><li>${escapeHtml(text)}</li></${tag}>`;
        } else {
            return `<p>${escapeHtml(text)}</p>`;
        }
    }

    // Legacy clips (no range data)
    return `<p>${escapeHtml(clip.text)}</p>`;
}

function deleteComment(commentId) {
  // Remove the highlight span from the page
  const span = document.querySelector(`.cairn-comment-highlight[data-comment-id="${commentId}"]`);
  if (span) {
    const parent = span.parentNode;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  }

  comments = comments.filter(c => c.id !== commentId);
  allClips[currentConversationId].comments = comments;
  allClips[currentConversationId].lastUpdated = new Date().toISOString();
  chrome.storage.local.set({ 'cairnNotesV2': allClips });
  updateModalContent();
}

function deleteClip(clipId) {
    document.querySelectorAll(`.cairn-clip-highlight[data-clip-id="${clipId}"]`).forEach(span => {
        const parent = span.parentNode;
        if (!parent) return;
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
    });

    // Remove from clips array
    clips = clips.filter(clip => clip.id !== clipId);
    
    // Recalculate IDs
    recalculateClipIds();
    
    // Update the master object
    allClips[currentConversationId].clips = clips;
    allClips[currentConversationId].lastUpdated = new Date().toISOString();
    
    // Update storage
    chrome.storage.local.set({ 'cairnNotesV2': allClips });
    
    // Update modal
    updateModalContent();
}

// Modify the saveClip function
// Block elements we potentially split multi-paragraph selections into.
const SPLITTABLE_BLOCK_ELEMENTS = ['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'];

// If `range` spans more than one splittable block element, returns the deduped
// list of intersecting blocks (outermost only, e.g. a <blockquote> wins over its
// child <p>). Returns an empty array for single-block/inline selections.
// Shared by saveClip and openAnnotationModal so both persist multi-element
// clips the same way (see createMultiElementClip / applyHighlights).
function findIntersectingBlocks(range) {
    let startBlock = range.startContainer;
    while (startBlock && startBlock.nodeType !== Node.ELEMENT_NODE) { startBlock = startBlock.parentNode; }
    while (startBlock && !SPLITTABLE_BLOCK_ELEMENTS.includes(startBlock.nodeName) && startBlock !== document.body) {
        startBlock = startBlock.parentNode;
    }
    if (startBlock === document.body) startBlock = null;

    let endBlock = range.endContainer;
    while (endBlock && endBlock.nodeType !== Node.ELEMENT_NODE) { endBlock = endBlock.parentNode; }
    while (endBlock && !SPLITTABLE_BLOCK_ELEMENTS.includes(endBlock.nodeName) && endBlock !== document.body) {
        endBlock = endBlock.parentNode;
    }
    if (endBlock === document.body) endBlock = null;

    const spansMultipleBlocks = startBlock && endBlock && startBlock !== endBlock;
    if (!spansMultipleBlocks) return [];

    let searchRoot = range.commonAncestorContainer;
    while (searchRoot && searchRoot.nodeType !== Node.ELEMENT_NODE) { searchRoot = searchRoot.parentNode; }
    if (!searchRoot) searchRoot = document.body;

    const potentialBlocks = Array.from(searchRoot.querySelectorAll(SPLITTABLE_BLOCK_ELEMENTS.join(', ')));
    const intersectingBlocks = potentialBlocks.filter(block =>
        range.intersectsNode(block) &&
        SPLITTABLE_BLOCK_ELEMENTS.includes(block.nodeName)
    );
    return intersectingBlocks.filter(
        block => !intersectingBlocks.some(other => other !== block && other.contains(block))
    );
}

function saveClip(selection, isCodeBlock, isSecondary) {
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const originalRange = selection.getRangeAt(0);
    const dedupedBlocks = findIntersectingBlocks(originalRange);

    if (dedupedBlocks.length > 0) {
        // Create one clip that represents the entire multi-element selection.
        // All blocks are tagged with the same clip ID so they are managed as a unit.
        const clip = createMultiElementClip(dedupedBlocks, selectedText, isCodeBlock, isSecondary, currentClipId);
        if (!supportsElementHighlights()) {
          clip.range = null;
        }
        clips.push(clip);
        if (supportsElementHighlights()) {
          dedupedBlocks.forEach(block => {
            const r = document.createRange();
            r.selectNodeContents(block);
            highlightClipText(r, clip.id, isSecondary);
          });
        }
        currentClipId++;
        updateStorageAndUI();
    } else {
        // Handle non-list/non-multi-paragraph selections (single block)
        handleSingleBlockSave(originalRange, selectedText, isCodeBlock, isSecondary);
    }
}

// Helper function to create a clip object (refactored)
function createClipObject(range, text, isCodeBlock, isSecondary, id) {
    return {
        id: id,
        text: text,
        timestamp: new Date().toISOString(),
        range: supportsElementHighlights() ? getRangeInfo(range) : null,
        url: window.location.href,
        isCode: isCodeBlock,
        isSecondary: isSecondary
    };
}

// Builds a single clip object for a multi-element selection.
// All block elements share one clip ID so the note and its highlights are
// managed as a unit.
function createMultiElementClip(blocks, text, isCodeBlock, isSecondary, id) {
    return {
        id,
        text,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        isCode: isCodeBlock,
        isSecondary,
        range: {
            isMultiElement: true,
            elements: blocks.map(el => ({
                type: el.tagName.toLowerCase(),
                elementText: el.textContent.trim(),
                occurrenceIndex: getElementOccurrenceIndex(el),
                listType: el.tagName === 'LI' ? (el.closest('ol') ? 'ol' : 'ul') : undefined
            }))
        }
    };
}

// Helper function to handle saving a single block/non-list clip (refactored)
function handleSingleBlockSave(range, text, isCodeBlock, isSecondary) {
    const clip = createClipObject(range, text, isCodeBlock, isSecondary, currentClipId);
    clips.push(clip);
    currentClipId++;
    if (supportsElementHighlights()) {
      highlightText(range, clip.id, clip.isCode, clip.isSecondary);
    }
    // Update storage and UI after saving
    updateStorageAndUI();
}

// Refactored update logic
function updateStorageAndUI() {
    ensureBucket();
    allClips[currentConversationId].clips = clips;
    allClips[currentConversationId].title = conversationTitle;
    allClips[currentConversationId].lastUpdated = new Date().toISOString();
    
    chrome.storage.local.set({ 'cairnNotesV2': allClips });

    updateModalContent();
    if (noteModal) {
        noteModal.style.display = 'flex';
    }
}

// Get information about a range that can be stored
function getRangeInfo(range) {
  // Claude gates on being inside a recognized message container; ChatGPT/Grok
  // have no such wrapper to detect, so any selection on the page qualifies.
  const container = isClaudeSite()
    ? findMessageContainer(range.commonAncestorContainer)
    : range.commonAncestorContainer;
  if (!container) return null;
  
  // Get the actual element containing the START of the selection range
  let element = range.startContainer; 
  while (element && element.nodeType !== Node.ELEMENT_NODE) {
    element = element.parentNode;
  }
  
  // If the determined element isn't an LI itself, try finding the closest LI ancestor 
  // that still contains the start of the range. This is crucial for ranges starting in nested elements within an LI.
  if (element && element.tagName !== 'LI') {
      const closestLi = element.closest('li');
      // Ensure the found LI actually contains the start of the range we're analyzing
      if (closestLi && closestLi.contains(range.startContainer)) { 
          element = closestLi;
      } else {
          // Fallback if we can't reliably find the LI for this range part.
          // Try the commonAncestorContainer's parent element.
          console.warn("getRangeInfo: Could not reliably find LI element for range start, context might be less accurate.", range);
          element = range.commonAncestorContainer;
           while (element && element.nodeType !== Node.ELEMENT_NODE) {
               element = element.parentNode;
           }
      }
  }
  
  // If element is still null or not identifiable, return null
  if (!element || !element.tagName) {
       console.error("getRangeInfo: Could not determine element for range.", range);
       return null; 
  }

  // Restore matches by tag + elementText + occurrenceIndex (see applyHighlights)
  const elementContext = {
    type: element.tagName.toLowerCase(),
    elementText: element.textContent.trim(),
    occurrenceIndex: getElementOccurrenceIndex(element),
    listType: element.closest('ul, ol')?.tagName.toLowerCase() || null
  };

  return {
    text: range.toString(), // Text content of the specific range (intersection)
    startOffset: range.startOffset, // Relative to startContainer of the passed range
    endOffset: range.endOffset,     // Relative to endContainer of the passed range
    elementContext: elementContext
  };
}

// Returns the nth-occurrence index of an element among all elements of the same
// tag with identical text content. Used to disambiguate duplicate paragraphs.
function getElementOccurrenceIndex(element) {
  const tag = element.tagName.toLowerCase();
  const text = element.textContent.trim();
  const all = Array.from(document.querySelectorAll(tag))
    .filter(el => el.textContent.trim() === text);
  const idx = all.indexOf(element);
  return idx >= 0 ? idx : 0;
}

// Handle heading element highlighting

function highlightText(range, clipId, isCodeBlock, isSecondary) {
    try {
        const modal = document.getElementById('cairn-modal');
        if (modal && modal.contains(range.commonAncestorContainer)) return false;
        return highlightClipText(range, clipId, isSecondary);
    } catch (e) {
        console.error('Error in highlightText:', e);
        return false;
    }
}


// Apply highlights for all saved clips
function applyHighlights(retryCount = 0, maxRetries = 5) {
  if (isApplyingHighlights) {
    return;
  }
  
  isApplyingHighlights = true;
  
  clearAllHighlights();
  
  if (!clips || clips.length === 0) {
    isApplyingHighlights = false;
    return;
  }
  
  let highlightedCount = 0;
  
  clips.forEach(clip => {
    if (!clip.range) return;

    // Multi-element path: wrap each block element's full content as a span.
    if (clip.range.isMultiElement) {
      let taggedCount = 0;
      for (const locator of clip.range.elements) {
        const matches = Array.from(document.querySelectorAll(locator.type))
          .filter(el => el.textContent.trim() === locator.elementText);
        const target = matches[locator.occurrenceIndex ?? 0] ?? matches[0];
        if (target) {
          const r = document.createRange();
          r.selectNodeContents(target);
          if (highlightClipText(r, clip.id, clip.isSecondary)) taggedCount++;
        }
      }
      if (taggedCount) highlightedCount++;
      return;
    }

    if (!clip.range.elementContext) return;

    const elementContext = clip.range.elementContext;
    let found = false;

    // New path: clips stored with elementText use direct text-content matching.
    // This avoids building CSS selectors from Tailwind classes (which contain
    // bracket characters that are invalid in querySelectorAll).
    if (elementContext.elementText !== undefined) {
      const tag = elementContext.type;
      const text = elementContext.elementText;
      const idx = elementContext.occurrenceIndex ?? 0;
      const matches = Array.from(document.querySelectorAll(tag))
        .filter(el => el.textContent.trim() === text);
      const target = matches[idx] ?? matches[0];
      if (target) {
        const r = findTextInContainer(target, clip.text);
        if (r && highlightClipText(r, clip.id, clip.isSecondary)) highlightedCount++;
      }
      return;
    }

    // Legacy path: old clips without elementText use the class-based selector.
    // Wrapped in try-catch because Tailwind arbitrary-value classes like
    // leading-[1.7] produce invalid CSS selector syntax.
    try {
      const elementSelector = `${elementContext.type}${elementContext.classes ? '.' + elementContext.classes.split(' ').join('.') : ''}`;
      const elements = document.querySelectorAll(elementSelector);

      for (const element of elements) {
        try {
          if (element.textContent.includes(clip.text)) {
            const range = findTextInContainer(element, clip.text);
            if (range) {
              highlightText(range, clip.id, clip.isCode, clip.isSecondary);
              found = true;
              highlightedCount++;
              break;
            }
          }
        } catch (e) {
          console.error('Error highlighting element:', e);
        }
      }
    } catch (selectorError) {
      console.warn('Legacy highlight selector failed (Tailwind bracket classes), falling back to tag-only search:', selectorError.message);
    }

    // Fuzzy fallback for legacy clips: search by tag only
    if (!found) {
      const potentialContainers = document.querySelectorAll(elementContext.type);
      for (const container of potentialContainers) {
        try {
          if (container.textContent.includes(clip.text)) {
            const range = findTextInContainer(container, clip.text);
            if (range) {
              highlightText(range, clip.id, clip.isCode, clip.isSecondary);
              found = true;
              highlightedCount++;
              break;
            }
          }
        } catch (e) {
          console.error('Error in fuzzy search:', e);
        }
      }
    }
  });
  
  
  // If no clips were highlighted but we have clips and haven't exceeded retries, try again
  if (highlightedCount === 0 && clips.length > 0 && retryCount < maxRetries) {
    setTimeout(() => {
      applyHighlights(retryCount + 1, maxRetries);
    }, 1000 * (retryCount + 1));
  }
  
  isApplyingHighlights = false;
}

// Clear all existing highlights from the page
function clearAllHighlights() {
  document.querySelectorAll('.cairn-clip-highlight').forEach(span => {
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  });
  clearCommentHighlights();
}

// Find text in a container and create a range for it
function findTextInContainer(container, searchText) {
  try {
    // First try exact match within the text content
    if (container.textContent.includes(searchText)) {
      const textNodes = getTextNodes(container);
      const searchTextLower = searchText.toLowerCase();
      
      // Try exact match in individual text nodes
      for (const node of textNodes) {
        if (node.textContent.includes(searchText)) {
          const startPos = node.textContent.indexOf(searchText);
          const range = document.createRange();
          range.setStart(node, startPos);
          range.setEnd(node, startPos + searchText.length);
          return range;
        }
      }
      
      // Try case-insensitive match in individual nodes
      for (const node of textNodes) {
        const lowerContent = node.textContent.toLowerCase();
        if (lowerContent.includes(searchTextLower)) {
          const startPos = lowerContent.indexOf(searchTextLower);
          const range = document.createRange();
          range.setStart(node, startPos);
          range.setEnd(node, startPos + searchText.length);
          return range;
        }
      }
      
      // Try checking across multiple text nodes
      if (textNodes.length > 1) {
        // Build a concatenated string of text content with node indices
        let fullText = '';
        const nodeIndices = [];
        
        for (let i = 0; i < textNodes.length; i++) {
          const nodeText = textNodes[i].textContent;
          nodeIndices.push({
            node: i,
            start: fullText.length,
            end: fullText.length + nodeText.length
          });
          fullText += nodeText;
        }
        
        // Try exact match first
        let pos = fullText.indexOf(searchText);
        if (pos < 0) {
          // Fall back to case-insensitive match
          pos = fullText.toLowerCase().indexOf(searchTextLower);
        }
        
        if (pos >= 0) {
          // Find which nodes this spans
          const startNodeInfo = nodeIndices.find(info => 
            pos >= info.start && pos < info.end);
          
          const endPos = pos + searchText.length;
          const endNodeInfo = nodeIndices.find(info => 
            endPos > info.start && endPos <= info.end);
          
          if (startNodeInfo && endNodeInfo) {
            const range = document.createRange();
            
            // Set start position
            const startNode = textNodes[startNodeInfo.node];
            const startOffset = pos - startNodeInfo.start;
            range.setStart(startNode, startOffset);
            
            // Set end position
            const endNode = textNodes[endNodeInfo.node];
            const endOffset = endPos - endNodeInfo.start;
            range.setEnd(endNode, endOffset);
            
            return range;
          }
        }
      }
      
      // If we couldn't create a precise range but we know the text is in there,
      // create a range for the first portion of the container as a fallback
      if (textNodes.length > 0) {
        const firstNode = textNodes[0];
        const range = document.createRange();
        range.setStart(firstNode, 0);
        range.setEnd(firstNode, Math.min(firstNode.length || 0, searchText.length));
        return range;
      }
    }
    
    // Final fallback - if we know the text should be in this container but couldn't find it normally
    // Look for smaller chunks of the text
    if (searchText.length > 20) {
      // Try to find a significant chunk of the search text
      const chunk = searchText.slice(0, Math.min(20, searchText.length / 2));
      return findTextInContainer(container, chunk);
    }
    
    return null;
  } catch (e) {
    console.error('Error finding text in container:', e);
    return null;
  }
}

// Get all text nodes within an element
function getTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  return textNodes;
}

// Normalize a URL to origin+pathname so re-renders of the same page still match
// (drops query/hash, which some AI chat sites vary per-load).
function conversationKeyForUrl(url) {
  try {
    const u = new URL(url);
    return u.origin + u.pathname;
  } catch (e) {
    return url;
  }
}

// Identifies "this specific conversation/page" for Clips-tab scoping. On Claude the
// bucket is already per-conversation; on web-clip sites the bucket is per-hostname
// (shared across every conversation on that host), so we additionally filter by URL.
function getConversationKey() {
  if (isClaudeSite()) {
    return currentConversationId;
  }
  return conversationKeyForUrl(window.location.href);
}

// Scans every bucket for topicId values actually used by an annotation clip,
// so the Topics filter dropdown never lists orphaned/unused topics.
function getUsedTopicIdsAcrossAllBuckets() {
  const used = new Set();
  Object.values(allClips).forEach(bucket => {
    (bucket.clips || []).forEach(clip => {
      if (clip.isSecondary && clip.topicId) used.add(clip.topicId);
    });
  });
  return used;
}

// Pools annotation clips sharing a topic id across every bucket (every conversation,
// every site) so the Topics tab can show a true cross-surface view.
function getTopicClipsAcrossAllBuckets(topicId) {
  const pooled = [];
  Object.entries(allClips).forEach(([bucketId, bucket]) => {
    (bucket.clips || []).forEach(clip => {
      if (clip.isSecondary && clip.topicId === topicId) {
        pooled.push({ clip, bucketId, bucketTitle: bucket.title || bucketId });
      }
    });
  });
  return pooled;
}

function buildEmptyState(container, title, desc) {
  const wrap = document.createElement('div');
  applyStyles(wrap, {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    textAlign: 'center',
    padding: '24px'
  });
  const emptyImg = document.createElement('img');
  emptyImg.src = chrome.runtime.getURL('images/cairn-stack.png');
  emptyImg.alt = '';
  applyStyles(emptyImg, { width: '44px', height: '44px', objectFit: 'contain', mixBlendMode: 'multiply' });
  wrap.appendChild(emptyImg);

  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  applyStyles(titleEl, { fontSize: '15px', fontWeight: '600' });

  const descEl = document.createElement('div');
  descEl.textContent = desc;
  applyStyles(descEl, { fontSize: '13px', color: panel.colors.subtext, maxWidth: '220px', lineHeight: '1.45', textWrap: 'pretty' });

  wrap.appendChild(titleEl);
  wrap.appendChild(descEl);
  container.appendChild(wrap);
}

// Builds a single clip card matching the panel design. `sourceLabel` (Claude/ChatGPT/…)
// only appears in cross-bucket Topics views; `foreignUrl` marks a read-only card whose
// click opens the saved source URL instead of scrolling to the highlight in this page.
const AI_CHAT_SOURCE_LABELS = new Set(['Claude', 'ChatGPT', 'Gemini', 'Grok', 'Kimi']);

function createClipCard(clip, opts = {}) {
  const { sourceLabel, onClick, onDelete, foreignUrl } = opts;
  const resolvedSourceLabel = sourceLabel || getBucketSourceLabel(currentConversationId);
  const linkText = AI_CHAT_SOURCE_LABELS.has(resolvedSourceLabel)
    ? `Open in ${resolvedSourceLabel}`
    : 'View page';

  const card = document.createElement('article');
  card.className = 'cairn-card';
  applyStyles(card, {
    background: panel.colors.card,
    border: `1px solid ${panel.colors.border}`,
    borderRadius: '12px',
    padding: '12px 10px 12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    cursor: 'pointer',
    boxSizing: 'border-box'
  });
  card.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (foreignUrl) {
      window.open(foreignUrl, '_blank');
    } else if (onClick) {
      onClick();
    }
  });

  const row = document.createElement('div');
  applyStyles(row, { display: 'flex', alignItems: 'center', gap: '7px' });

  if (sourceLabel) {
    const dot = document.createElement('span');
    applyStyles(dot, {
      width: '7px', height: '7px', borderRadius: '50%',
      background: panel.sourceColors[sourceLabel] || panel.colors.muted, flexShrink: '0'
    });
    const srcText = document.createElement('span');
    srcText.textContent = sourceLabel;
    applyStyles(srcText, { fontSize: '12px', fontWeight: '600', color: panel.colors.subtext2 });
    row.appendChild(dot);
    row.appendChild(srcText);
  }

  const timeEl = document.createElement('span');
  timeEl.textContent = formatRelativeClipTime(clip.timestamp);
  applyStyles(timeEl, { fontSize: '12px', color: panel.colors.subtext });
  row.appendChild(timeEl);

  const spacer = document.createElement('div');
  applyStyles(spacer, { flexGrow: '1' });
  row.appendChild(spacer);

  const copiedLabel = document.createElement('span');
  copiedLabel.textContent = 'Copied';
  applyStyles(copiedLabel, {
    fontSize: '12px', fontWeight: '500', color: panel.colors.accent, padding: '0 6px', display: 'none'
  });
  row.appendChild(copiedLabel);

  const copyBtn = document.createElement('button');
  copyBtn.className = 'cairn-ib';
  copyBtn.setAttribute('aria-label', 'Copy clip');
  applyStyles(copyBtn, panelIconButtonStyle('30px'));
  copyBtn.appendChild(CairnIcons.createIcon('copy', 15, panel.colors.subtext2));
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(clip.text).catch(() => {});
    copiedLabel.style.display = 'inline';
    clearTimeout(copyBtn._copyTimeout);
    copyBtn._copyTimeout = setTimeout(() => { copiedLabel.style.display = 'none'; }, 1400);
  });
  row.appendChild(copyBtn);

  if (onDelete) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'cairn-ib';
    deleteButton.setAttribute('aria-label', 'Remove clip');
    applyStyles(deleteButton, panelIconButtonStyle('30px'));
    deleteButton.appendChild(CairnIcons.createIcon('x', 15, panel.colors.subtext2));
    deleteButton.addEventListener('click', onDelete);
    row.appendChild(deleteButton);
  }

  card.appendChild(row);

  const textEl = document.createElement('div');
  textEl.className = 'cairn-richtext';
  textEl.innerHTML = clipToRichHtml(clip);
  applyStyles(textEl, clip.isCode ? {
    margin: '0',
    fontFamily: '"Fira Code", "Menlo", "Monaco", "Courier New", monospace',
    fontSize: '12.5px',
    lineHeight: '1.4',
    color: '#d4d4d4',
    background: '#1e1e1e',
    borderRadius: '8px',
    padding: '10px',
    whiteSpace: 'pre',
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '150px'
  } : {
    margin: '0',
    paddingRight: '6px',
    fontFamily: panel.font.serif,
    fontSize: '16px',
    lineHeight: '1.5',
    color: panel.colors.text
  });
  card.appendChild(textEl);

  const footerRow = document.createElement('div');
  applyStyles(footerRow, { display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '4px' });

  if (clip.topicId) {
    const topic = topicsCache.find(t => t.id === clip.topicId);
    if (topic) {
      const pill = document.createElement('span');
      pill.textContent = topic.name;
      applyStyles(pill, {
        fontSize: '11.5px', fontWeight: '500', color: panel.colors.subtext2,
        background: panel.colors.topicPillBg, borderRadius: '6px', padding: '3px 8px'
      });
      footerRow.appendChild(pill);
    }
  }

  const footerSpacer = document.createElement('div');
  applyStyles(footerSpacer, { flexGrow: '1' });
  footerRow.appendChild(footerSpacer);

  const link = document.createElement('a');
  link.className = 'cairn-lnk';
  link.href = clip.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  applyStyles(link, {
    fontSize: '12.5px', fontWeight: '500', color: panel.colors.accent,
    display: 'flex', alignItems: 'center', gap: '4px'
  });
  link.innerHTML = `${linkText}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"></path></svg>`;
  footerRow.appendChild(link);

  card.appendChild(footerRow);

  return card;
}

function createCommentCard(item) {
  const card = document.createElement('article');
  card.className = 'cairn-card';
  applyStyles(card, {
    background: panel.colors.card,
    border: `1px solid ${panel.colors.border}`,
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer',
    boxSizing: 'border-box'
  });
  card.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (item.artifactName) {
      openArtifactAndScrollToComment(item);
    } else {
      scrollToComment(item.id);
    }
  });

  const row = document.createElement('div');
  applyStyles(row, { display: 'flex', alignItems: 'center', gap: '7px' });

  const timeEl = document.createElement('span');
  timeEl.textContent = formatRelativeClipTime(item.timestamp);
  applyStyles(timeEl, { fontSize: '12px', color: panel.colors.subtext });
  row.appendChild(timeEl);

  const spacer = document.createElement('div');
  applyStyles(spacer, { flexGrow: '1' });
  row.appendChild(spacer);

  const copiedLabel = document.createElement('span');
  copiedLabel.textContent = 'Copied';
  applyStyles(copiedLabel, {
    fontSize: '12px', fontWeight: '500', color: panel.colors.accent, padding: '0 6px', display: 'none'
  });
  row.appendChild(copiedLabel);

  const copyBtn = document.createElement('button');
  copyBtn.className = 'cairn-ib';
  copyBtn.setAttribute('aria-label', 'Copy comment');
  applyStyles(copyBtn, panelIconButtonStyle('30px'));
  copyBtn.appendChild(CairnIcons.createIcon('copy', 14, panel.colors.subtext2));
  copyBtn.addEventListener('click', () => {
    const text = `> "${item.selectedText}"\n\nComment: ${item.comment}`;
    navigator.clipboard.writeText(text).catch(() => {});
    copiedLabel.style.display = 'inline';
    clearTimeout(copyBtn._copyTimeout);
    copyBtn._copyTimeout = setTimeout(() => { copiedLabel.style.display = 'none'; }, 1400);
  });
  row.appendChild(copyBtn);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'cairn-ib';
  deleteButton.setAttribute('aria-label', 'Remove comment');
  applyStyles(deleteButton, panelIconButtonStyle('30px'));
  deleteButton.appendChild(CairnIcons.createIcon('x', 14, panel.colors.subtext2));
  deleteButton.addEventListener('click', () => deleteComment(item.id));
  row.appendChild(deleteButton);

  card.appendChild(row);

  if (item.artifactName) {
    const artifactPill = document.createElement('div');
    artifactPill.textContent = `📄 ${item.artifactName}`;
    applyStyles(artifactPill, {
      fontSize: '11px', color: panel.colors.subtext, opacity: '0.8',
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
    });
    card.appendChild(artifactPill);
  }

  const quote = document.createElement('p');
  quote.textContent = item.selectedText;
  applyStyles(quote, {
    margin: '0', fontFamily: panel.font.serif, fontStyle: 'italic',
    fontSize: '14.5px', lineHeight: '1.45', color: panel.colors.subtext, wordBreak: 'break-word'
  });
  card.appendChild(quote);

  const replyBox = document.createElement('div');
  applyStyles(replyBox, {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    background: panel.colors.replyBg, borderRadius: '9px', padding: '10px 12px'
  });
  replyBox.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${panel.colors.subtext}" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;margin-top:2px"><path d="M5 5h14v10H10l-4 4v-4H5z"></path></svg>`;
  const replyText = document.createElement('div');
  replyText.textContent = item.comment;
  applyStyles(replyText, { fontSize: '13.5px', lineHeight: '1.45', color: panel.colors.text, wordBreak: 'break-word' });
  replyBox.appendChild(replyText);
  card.appendChild(replyBox);

  return card;
}

// Renders a pooled cross-bucket Topics-tab view. Cards from the current bucket keep
// the normal scroll-to/delete behavior; cards from other conversations/sites are
// read-only and open their saved source URL instead.
function renderTopicClips(modalContent, pooled) {
  if (pooled.length === 0) {
    buildEmptyState(modalContent, 'No clips here yet', 'Nothing has been added to this topic.');
    return;
  }

  const sorted = [...pooled].reverse();
  sorted.forEach(({ clip, bucketId }) => {
    const isCurrentBucket = bucketId === currentConversationId;
    modalContent.appendChild(createClipCard(clip, {
      sourceLabel: getBucketSourceLabel(bucketId),
      onClick: isCurrentBucket ? () => scrollToClip(clip.id) : null,
      onDelete: isCurrentBucket ? () => deleteClip(clip.id) : null,
      foreignUrl: isCurrentBucket ? null : clip.url
    }));
  });
}

function renderClipsList(container, list, emptyTitle, emptyDesc) {
  if (list.length === 0) {
    buildEmptyState(container, emptyTitle, emptyDesc);
    return;
  }
  const sorted = [...list].reverse();
  sorted.forEach(clip => container.appendChild(createClipCard(clip, {
    onClick: () => scrollToClip(clip.id),
    onDelete: () => deleteClip(clip.id)
  })));
}

function renderChipsRow(container, availableTopics) {
  if (availableTopics.length === 0) return;

  const row = document.createElement('div');
  applyStyles(row, { display: 'flex', flexWrap: 'wrap', gap: '6px', paddingBottom: '4px' });

  const makeChip = (label, value) => {
    const active = (currentAnnotationFilter || '') === value;
    const chip = document.createElement('button');
    chip.className = 'cairn-chip';
    chip.textContent = label;
    applyStyles(chip, {
      height: '30px', padding: '0 12px', borderRadius: '15px',
      font: `500 12.5px ${panel.font.sans}`, cursor: 'pointer', boxSizing: 'border-box',
      background: active ? panel.colors.accent : panel.colors.card,
      color: active ? '#FFFFFF' : panel.colors.subtext2,
      border: `1px solid ${active ? panel.colors.accent : panel.colors.borderStrong}`
    });
    chip.addEventListener('click', () => {
      currentAnnotationFilter = value || null;
      updateModalContent();
    });
    return chip;
  };

  availableTopics.forEach(topic => row.appendChild(makeChip(topic.name, topic.id)));
  container.appendChild(row);
}

function renderCommentsTab(container) {
  const toggleRow = document.createElement('div');
  applyStyles(toggleRow, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 2px 8px' });

  const toggleLabel = document.createElement('span');
  toggleLabel.textContent = 'Send to input on save';
  applyStyles(toggleLabel, { fontSize: '12px', color: panel.colors.subtext });

  const track = document.createElement('div');
  applyStyles(track, {
    width: '34px', height: '18px', borderRadius: '9px',
    background: sendCommentToInput ? panel.colors.accent : panel.colors.borderStrong,
    position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s', flexShrink: '0'
  });
  const thumb = document.createElement('div');
  applyStyles(thumb, {
    width: '14px', height: '14px', borderRadius: '50%', background: '#fff',
    position: 'absolute', top: '2px', left: sendCommentToInput ? '18px' : '2px',
    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  });
  track.appendChild(thumb);
  track.addEventListener('click', () => {
    sendCommentToInput = !sendCommentToInput;
    localStorage.setItem('cairn-send-on-comment', sendCommentToInput ? 'true' : 'false');
    updateModalContent();
  });

  toggleRow.appendChild(toggleLabel);
  toggleRow.appendChild(track);
  container.appendChild(toggleRow);

  if (comments.length === 0) {
    buildEmptyState(
      container,
      currentConversationId === 'default' ? 'No conversation open' : 'No comments yet',
      currentConversationId === 'default'
        ? 'Use Open notebook below to browse saved conversations.'
        : 'Select text and click Comment to add one.'
    );
    return;
  }

  [...comments].reverse().forEach(item => container.appendChild(createCommentCard(item)));
}

// Update the content of the modal with clips from current conversation
function updateModalContent() {
  const modalContent = document.getElementById('cairn-content');
  if (!modalContent) return;
  modalContent.innerHTML = ''; // Clear previous content

  // Clips tab on web-clip sites is scoped to the current conversation/page, since the
  // bucket itself is shared per-hostname across every conversation on that site.
  const conversationKey = getConversationKey();
  const scopedClips = isWebClipMode()
    ? clips.filter(clip => conversationKeyForUrl(clip.url) === conversationKey)
    : clips;
  const clipsTabClips = scopedClips.filter(clip => !clip.isSecondary);
  const annotationClips = scopedClips.filter(clip => clip.isSecondary);

  // Topics are cross-bucket by design, so the chip list shows every topic in use
  // anywhere (not just the current conversation/site).
  const usedTopicIds = getUsedTopicIdsAcrossAllBuckets();
  const availableTopics = topicsCache
    .filter(topic => usedTopicIds.has(topic.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (currentAnnotationFilter && !availableTopics.some(topic => topic.id === currentAnnotationFilter)) {
    currentAnnotationFilter = null;
  }

  renderTabsRow({ clips: clipsTabClips.length, topics: availableTopics.length, comments: comments.length });

  // --- Comments tab — completely separate from clips/annotations ---
  if (activeTab === 'comments') {
    renderCommentsTab(modalContent);
    return;
  }

  const isDefaultConversation = currentConversationId === 'default';
  const openNotebookHint = 'Use Open notebook below to browse saved conversations.';

  if (activeTab === 'annotations') {
    renderChipsRow(modalContent, availableTopics);

    // Topics tab with an active filter: pool matching clips across every bucket/site,
    // so annotations sharing a topic are visible regardless of where they were made.
    if (currentAnnotationFilter) {
      renderTopicClips(modalContent, getTopicClipsAcrossAllBuckets(currentAnnotationFilter));
    } else {
      renderClipsList(
        modalContent,
        annotationClips,
        isDefaultConversation ? 'No conversation open' : 'No topics yet',
        isDefaultConversation ? openNotebookHint : 'Select text and click Add to Topic to save one.'
      );
    }
    return;
  }

  // Clips tab
  renderClipsList(
    modalContent,
    clipsTabClips,
    isDefaultConversation ? 'No conversation open' : 'No clips yet',
    isDefaultConversation ? openNotebookHint : 'Select text and click Clip to save it here.'
  );
}

// Clear all clips from current conversation
function clearAllClips() {
  if (confirm('Are you sure you want to clear all notes from this conversation?')) {
    // 1. Remove all highlights from the current page DOM
    clearAllHighlights(); // Call the existing function to clear styles

    // 2. Clear clips and comments arrays for the current conversation
    clips = [];
    comments = [];
    currentClipId = 0;
    currentCommentId = 0;

    // 3. Update the master storage object
    if (allClips[currentConversationId]) {
        allClips[currentConversationId].clips = [];
        allClips[currentConversationId].comments = [];
        allClips[currentConversationId].lastUpdated = new Date().toISOString();
    } else {
        allClips[currentConversationId] = {
          id: currentConversationId,
          title: conversationTitle,
          lastUpdated: new Date().toISOString(),
          clips: [],
          comments: []
        };
    }

    // 4. Save updated storage
    chrome.storage.local.set({ 'cairnNotesV2': allClips });

    // 5. Update the modal UI
    updateModalContent();
  }
}

// Load clips from storage
function loadClips() {
  migrateLabelsToTopics(() => {
    getTopics().then((topics) => {
      topicsCache = topics;
      loadClipsAfterMigration();
    });
  });
}

function loadClipsAfterMigration() {
  chrome.storage.local.get(['claudeNotesV2', 'cairnNotesV2'], (result) => {
    const v2data = result.cairnNotesV2 || result.claudeNotesV2;
    if (v2data) {
      allClips = v2data;
      if (!result.cairnNotesV2) {
        chrome.storage.local.set({ 'cairnNotesV2': allClips });
      }
      
      // Check each conversation title and fix if needed
      let needsUpdate = false;
      Object.values(allClips).forEach(conversation => {
        if (conversation.title && conversation.title.endsWith(' - Claude')) {
          conversation.title = conversation.title.replace(' - Claude', '').trim();
          conversation.lastUpdated = new Date().toISOString();
          needsUpdate = true;
        }
      });
      
      // Save updates if any titles were corrected
      if (needsUpdate) {
        chrome.storage.local.set({ 'cairnNotesV2': allClips });
      }
      
      // If we have clips for the current conversation, use them
      if (allClips[currentConversationId]) {
        clips = allClips[currentConversationId].clips;
        comments = allClips[currentConversationId].comments || [];
        // Set the next clip ID based on the highest existing ID
        currentClipId = clips.length > 0 ? Math.max(...clips.map(clip => clip.id)) + 1 : 0;
        currentCommentId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 0;
        
        // Update the conversation title if it's out of date
        if (allClips[currentConversationId].title !== conversationTitle) {
          allClips[currentConversationId].title = conversationTitle;
          allClips[currentConversationId].lastUpdated = new Date().toISOString();
          
          // Save the updated title
          chrome.storage.local.set({ 'cairnNotesV2': allClips });
        }

        // Show modal if we have clips and are in a conversation (Claude only)
        if (!isWebClipMode() && clips.length > 0 && currentConversationId !== 'default') {
          if (!noteModal) {
            createModal();
          }
          noteModal.style.display = 'flex';
          updateModalContent();
        }
      } else {
        // Initialize this conversation
        clips = [];
        comments = [];
        currentClipId = 0;
        currentCommentId = 0;
        allClips[currentConversationId] = {
          id: currentConversationId,
          title: conversationTitle,
          lastUpdated: new Date().toISOString(),
          clips: [],
          comments: []
        };
      }
    } else {
      // No existing data
      clips = [];
      comments = [];
      currentClipId = 0;
      currentCommentId = 0;
      allClips = {};
      allClips[currentConversationId] = {
        id: currentConversationId,
        title: conversationTitle,
        lastUpdated: new Date().toISOString(),
        clips: [],
        comments: []
      };
    }
    
    // Claude waits for its own DOM before showing the modal; other sites can show
    // immediately since there's no client-rendered chat history to wait for.
    if (!isWebClipMode()) {
      updateModalContent();
      if (clips.length > 0 || comments.length > 0) {
        waitForClaudeContent();
      }
    } else {
      if (supportsElementHighlights() && clips.length > 0) {
        applyHighlights();
      }
      if (!noteModal) {
        createModal();
      }
      updateModalContent();
      if (clips.length > 0) {
        noteModal.style.display = 'flex';
        applyModalPosition();
      }
    }
  });
}

// Listen for messages from background or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action === 'toggleModal') {
    // Non-Claude sites: toolbar toggles the same Notes modal as Claude (no per-conversation
    // reload needed here since the storage bucket is shared per-hostname, not per-chat).
    if (isWebClipMode()) {
      if (!noteModal) init();
      if (noteModal) {
        if (noteModal.style.display === 'none') {
          noteModal.style.display = 'flex';
          updateModalContent();
          applyModalPosition();
        } else {
          noteModal.style.display = 'none';
        }
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Modal not initialized' });
      }
      return true;
    }

    const currentConvId = extractConversationId();

    // Initialize if needed (works for new chats with id === 'default')
    if (!noteModal) {
      init();
    } else if (currentConvId !== 'default' && currentConvId !== currentConversationId) {
      currentConversationId = currentConvId;
      lastUrl = window.location.href;
      conversationTitle = document.title.replace(' - Claude', '').trim();
      clearAllHighlights();
      loadClips();
      setTimeout(() => {
        applyHighlights();
      }, 100);
    } else {
      currentConversationId = currentConvId;
      conversationTitle = getBucketTitle();
      updateModalContent();
    }

    if (noteModal) {
      if (noteModal.style.display === 'none') {
        noteModal.style.display = 'flex';
        updateModalContent();
        applyModalPosition();
      } else {
        noteModal.style.display = 'none';
      }
      sendResponse({ success: true });
    } else {
      console.error('Could not toggle modal, not initialized');
      sendResponse({ success: false, error: 'Modal not initialized' });
    }
    return true;
  }
});

// Apply saved position, or fall back to default top-right offset
function applyModalPosition() {
  chrome.storage.local.get('cairnModalPosition', (result) => {
    if (result.cairnModalPosition) {
      const { top, left } = result.cairnModalPosition;
      noteModal.style.top = top;
      noteModal.style.left = left;
      noteModal.style.right = '';
    } else {
      noteModal.style.top = '100px';
      noteModal.style.right = '24px';
      noteModal.style.left = '';
    }
    ensureModalWithinBounds();
  });
}

// Ensure modal stays within bounds when window resizes
function ensureModalWithinBounds() {
  if (!noteModal) return;
  

  const minDistanceFromEdge = 50;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const modalWidth = noteModal.offsetWidth;
  const modalHeight = noteModal.offsetHeight;

  // Get current position more reliably using getBoundingClientRect
  const rect = noteModal.getBoundingClientRect();
  let currentTop = rect.top;
  let currentLeft = rect.left;
  

  // Check if modal is too close to any edge
  let needsRepositioning = false;

  // Top constraint
  if (currentTop < minDistanceFromEdge) {
    noteModal.style.top = `${minDistanceFromEdge}px`;
    needsRepositioning = true;
  } 
  // Bottom constraint
  else if (currentTop + modalHeight > windowHeight - minDistanceFromEdge) {
    const newTop = Math.max(minDistanceFromEdge, windowHeight - modalHeight - minDistanceFromEdge); // Ensure it doesn't go above top edge
    noteModal.style.top = `${newTop}px`;
    needsRepositioning = true;
  }
  
  // --- Check RIGHT edge FIRST if right style is set ---
  if (noteModal.style.right && noteModal.style.right !== 'auto') {
      const currentRight = windowWidth - currentLeft - modalWidth;
      if (currentRight < minDistanceFromEdge) {
          const newRight = minDistanceFromEdge;
          noteModal.style.right = `${newRight}px`;
          noteModal.style.left = ''; // Clear left if setting right
          needsRepositioning = true;
      }
      // If right is okay, we might not need to check left unless it's also out of bounds
      else if (currentLeft < minDistanceFromEdge) {
          noteModal.style.left = `${minDistanceFromEdge}px`;
          noteModal.style.right = ''; // Clear right if setting left
          needsRepositioning = true;
      }
  } else {
      // --- Original Left/Right check if right style wasn't the priority ---
      // Left constraint
      if (currentLeft < minDistanceFromEdge) {
        noteModal.style.left = `${minDistanceFromEdge}px`;
        noteModal.style.right = ''; // Clear right if setting left
        needsRepositioning = true;
      } 
      // Right constraint (based on left + width)
      else if (currentLeft + modalWidth > windowWidth - minDistanceFromEdge) {
        const newLeft = Math.max(minDistanceFromEdge, windowWidth - modalWidth - minDistanceFromEdge); // Ensure it doesn't go past left edge
        noteModal.style.left = `${newLeft}px`;
        noteModal.style.right = ''; // Clear right if setting left
        needsRepositioning = true;
      }
  }

  if (needsRepositioning) {
      // Persist corrected position if we're in left-based mode (i.e. user has dragged)
      if (noteModal.style.left) {
        chrome.storage.local.set({
          cairnModalPosition: {
            top: noteModal.style.top,
            left: noteModal.style.left
          }
        });
      }
  }
}

// Add this new function to handle scrolling to a clip
function scrollToClip(clipId) {
  const highlight = document.querySelector(`.cairn-clip-highlight[data-clip-id="${clipId}"]`);

  if (!highlight) {
    return;
  }

  // Scroll the highlight into view with some padding
  highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function scrollToComment(commentId) {
  const span = document.querySelector(`.cairn-comment-highlight[data-comment-id="${commentId}"]`);
  if (!span) {
    return;
  }
  span.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function highlightClipText(range, clipId, isSecondary) {
  if (!range) return false;
  try {
    const span = document.createElement('span');
    span.className = 'cairn-clip-highlight';
    span.dataset.clipId = clipId;
    if (isSecondary) span.dataset.secondary = '';
    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    return true;
  } catch (e) {
    console.error('Error in highlightClipText:', e);
    return false;
  }
}

function highlightCommentText(range, commentId) {
  if (!range) return false;
  try {
    const span = document.createElement('span');
    span.className = 'cairn-comment-highlight';
    span.dataset.commentId = commentId;
    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    return true;
  } catch (e) {
    console.error('Error in highlightCommentText:', e);
    return false;
  }
}

function clearCommentHighlights() {
  document.querySelectorAll('.cairn-comment-highlight').forEach(span => {
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  });
}

/** Remove a single comment highlight span so we can re-apply (e.g. after artifact panel opens). */
function removeCommentHighlightFromDom(commentId) {
  const span = document.querySelector(`.cairn-comment-highlight[data-comment-id="${commentId}"]`);
  if (!span) return;
  const parent = span.parentNode;
  if (!parent) return;
  while (span.firstChild) parent.insertBefore(span.firstChild, span);
  parent.removeChild(span);
}

function isInsideModal(el) {
  const modal = document.getElementById('cairn-modal');
  return !!(modal && el && modal.contains(el));
}

/**
 * Find the control that opens an artifact from the chat transcript.
 * Claude's label format has changed; avoid relying on a single exact aria-label string.
 */
function findArtifactViewControl(artifactName) {
  if (!artifactName || typeof artifactName !== 'string') return null;
  const name = artifactName.trim();
  if (!name) return null;

  const esc = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape : (s) => String(s).replace(/["\\]/g, '\\$&');
  const exactLabel = `View ${name}`;
  const exact = document.querySelector(
    `button[aria-label="${esc(exactLabel)}"], a[aria-label="${esc(exactLabel)}"], [role="button"][aria-label="${esc(exactLabel)}"]`
  );
  if (exact && !isInsideModal(exact)) return exact;

  const normalize = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const nTarget = normalize(name);

  const viewCandidates = document.querySelectorAll(
    'button[aria-label^="View "], a[aria-label^="View "], [role="button"][aria-label^="View "]'
  );
  for (const btn of viewCandidates) {
    if (isInsideModal(btn)) continue;
    const label = btn.getAttribute('aria-label') || '';
    const suffix = label.replace(/^View\s+/i, '').trim();
    if (!suffix) continue;
    if (suffix === name || normalize(suffix) === nTarget) return btn;
    if (suffix.includes(name) || name.includes(suffix)) return btn;
  }

  const openCandidates = document.querySelectorAll(
    'button[aria-label^="Open "], a[aria-label^="Open "], [role="button"][aria-label^="Open "]'
  );
  for (const btn of openCandidates) {
    if (isInsideModal(btn)) continue;
    const suffix = (btn.getAttribute('aria-label') || '').replace(/^Open\s+/i, '').trim();
    if (suffix && (suffix === name || normalize(suffix) === nTarget)) return btn;
  }

  // Broader: any primary control whose aria-label / title references the artifact title
  const broad = document.querySelectorAll(
    'button[aria-label], a[aria-label], [role="button"][aria-label], [role="link"][aria-label]'
  );
  for (const el of broad) {
    if (isInsideModal(el)) continue;
    const label = (el.getAttribute('aria-label') || el.getAttribute('title') || '').trim();
    if (!label) continue;
    const nl = normalize(label);
    if (nl === nTarget) return el;
    if (name.length >= 3 && (nl.includes(nTarget) || nTarget.includes(nl))) return el;
  }

  return null;
}

/**
 * Best-effort root for prose inside the opened artifact viewer (side panel / dialog).
 * Scoped matching avoids grabbing the wrong duplicate block in the main chat.
 */
function getArtifactContentPanelRoot() {
  const trySelect = (sel) => {
    try {
      return document.querySelector(sel);
    } catch (_) {
      return null;
    }
  };

  const scorePanel = (el) => {
    if (!el || !el.getBoundingClientRect) return 0;
    const r = el.getBoundingClientRect();
    if (r.width < 80 || r.height < 80) return 0;
    let score = r.width * r.height;
    if (el.querySelector('iframe')) score *= 1.15;
    if (el.querySelector('.prose, article, [class*="prose"], pre')) score *= 1.1;
    return score;
  };

  const candidates = Array.from(
    document.querySelectorAll('[role="dialog"], [aria-modal="true"]')
  ).filter((d) => {
    if (isInsideModal(d)) return false;
    if (d.getAttribute('aria-hidden') === 'true') return false;
    if (!d.querySelector('.prose, article, [class*="prose"], pre, code, iframe')) return false;
    return scorePanel(d) > 0;
  });

  if (candidates.length > 0) {
    candidates.sort((a, b) => scorePanel(b) - scorePanel(a));
    return candidates[0];
  }

  const dialogSelectors = [
    '[role="dialog"]:not([aria-hidden="true"])',
    '[role="dialog"][open]',
    '[data-state="open"][role="dialog"]',
    '[role="dialog"][data-state="open"]'
  ];
  for (const sel of dialogSelectors) {
    const d = trySelect(sel);
    if (d && isInsideModal(d)) continue;
    if (d && d.querySelector('.prose, article, [class*="prose"], pre')) return d;
  }

  const proseHint = trySelect('[role="dialog"] .prose, [role="dialog"] article');
  if (proseHint) return proseHint.closest('[role="dialog"]') || proseHint;

  const aside = trySelect('aside');
  if (
    aside &&
    !isInsideModal(aside) &&
    aside.offsetParent !== null &&
    aside.querySelector('.prose, article, pre')
  ) {
    return aside;
  }

  return null;
}

/**
 * Collect elements by tag across shadow roots (artifact / preview content often lives in shadow DOM).
 */
function queryElementsWithTagDeep(root, tagName) {
  const tag = String(tagName || '').toLowerCase();
  if (!tag) return [];
  const results = [];

  function visit(node) {
    if (!node) return;
    if (node.nodeType === 1) {
      const el = node;
      if (el.tagName && el.tagName.toLowerCase() === tag) {
        if (!isInsideModal(el)) results.push(el);
      }
      if (el.shadowRoot) visit(el.shadowRoot);
      const kids = el.children;
      if (kids) {
        for (let i = 0; i < kids.length; i++) visit(kids[i]);
      }
    } else if (node.nodeType === 11) {
      const fragKids = node.children;
      if (fragKids) {
        for (let i = 0; i < fragKids.length; i++) visit(fragKids[i]);
      }
    }
  }

  if (root === document) {
    if (document.documentElement) visit(document.documentElement);
  } else if (root && root.nodeType === 9 && root.documentElement) {
    visit(root.documentElement);
  } else if (root) {
    visit(root);
  }

  return results;
}

function applyOneCommentHighlight(comment, searchRoot = document) {
  if (!comment.range || !comment.range.elementContext) return false;
  removeCommentHighlightFromDom(comment.id);

  const ctx = comment.range.elementContext;
  const tag = ctx.type;
  const text = ctx.elementText;
  const idx = ctx.occurrenceIndex ?? 0;
  const rootsToTry = [];
  if (searchRoot && searchRoot !== document) rootsToTry.push(searchRoot);
  rootsToTry.push(document);

  for (const root of rootsToTry) {
    if (!root) continue;
    let matches = queryElementsWithTagDeep(root, tag).filter(el => el.textContent.trim() === text);

    if (matches.length > 1 && comment.selectedText) {
      const narrowed = matches.filter(el => findTextInContainer(el, comment.selectedText));
      if (narrowed.length === 1) matches = narrowed;
    }

    let target = matches[idx] ?? matches[0];
    if (!target) continue;

    const range = findTextInContainer(target, comment.selectedText);
    if (range && highlightCommentText(range, comment.id)) return true;
  }

  return false;
}

function applyCommentHighlights() {
  if (!comments || comments.length === 0) return;
  comments.forEach(comment => applyOneCommentHighlight(comment, document));
}

/**
 * Open the artifact (if control exists), re-apply highlight after DOM settles, then scroll.
 */
function openArtifactAndScrollToComment(comment) {
  const viewBtn = findArtifactViewControl(comment.artifactName);
  if (viewBtn) {
    try {
      viewBtn.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    } catch (_) {
      /* ignore */
    }
    viewBtn.click();
  }

  let attempts = 0;
  const maxAttempts = 24;
  const delayMs = 100;

  const tick = () => {
    attempts++;
    const panelRoot = getArtifactContentPanelRoot();
    const searchRoot = panelRoot || document;
    applyOneCommentHighlight(comment, viewBtn ? searchRoot : document);

    const span = document.querySelector(`.cairn-comment-highlight[data-comment-id="${comment.id}"]`);
    if (span) {
      span.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (attempts < maxAttempts) {
      setTimeout(tick, delayMs);
    } else {
      applyOneCommentHighlight(comment, document);
      scrollToComment(comment.id);
    }
  };

  setTimeout(tick, viewBtn ? 90 : 0);
}

// --- Topic Storage Functions ---
async function getTopics() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['cairnTopics'], (result) => {
            resolve(result.cairnTopics || []);
        });
    });
}

// Get-or-create by exact name match; returns the topic object so callers get its id.
async function addTopic(name) {
    const existingTopics = await getTopics();
    const existing = existingTopics.find((t) => t.name === name);
    if (existing) return existing;
    const topic = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    const updated = [...existingTopics, topic].sort((a, b) => a.name.localeCompare(b.name));
    return new Promise((resolve) => {
        chrome.storage.local.set({ 'cairnTopics': updated }, () => resolve(topic));
    });
}

// One-time migration from the legacy flat cairnLabels string array + clip.label
// to real cairnTopics entities + clip.topicId. Idempotent: no-ops once cairnTopics exists.
function migrateLabelsToTopics(callback) {
    chrome.storage.local.get(['cairnTopics', 'cairnLabels', 'cairnNotesV2'], (result) => {
        if (result.cairnTopics) {
            callback();
            return;
        }

        const notes = result.cairnNotesV2 || {};
        const labelNames = new Set(result.cairnLabels || []);
        Object.values(notes).forEach((bucket) => {
            (bucket.clips || []).forEach((clip) => {
                if (clip.label) labelNames.add(clip.label);
            });
        });

        const topics = [...labelNames].sort().map((name) => ({
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString()
        }));
        const nameToId = new Map(topics.map((t) => [t.name, t.id]));

        Object.values(notes).forEach((bucket) => {
            (bucket.clips || []).forEach((clip) => {
                if (clip.label) {
                    clip.topicId = nameToId.get(clip.label);
                    delete clip.label;
                }
            });
        });

        chrome.storage.local.set({ cairnTopics: topics, cairnNotesV2: notes }, () => {
            chrome.storage.local.remove('cairnLabels', callback);
        });
    });
}

// Open a lightweight comment popover anchored below the selection
function openCommentPopover(selectedText, selectionRect, range) {
  // Remove any existing comment popover
  const existing = document.getElementById('cairn-comment-popover');
  if (existing) existing.remove();

  const popover = document.createElement('div');
  popover.id = 'cairn-comment-popover';
  applyStyles(popover, {
    position: 'absolute',
    left: `${selectionRect.left + window.scrollX}px`,
    top: `${selectionRect.bottom + window.scrollY + 16}px`,
    width: '320px',
    backgroundColor: styles.colors.background.white,
    border: `1px solid ${styles.colors.border}`,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10002',
    fontFamily: "'Lato', Arial, sans-serif",
    fontSize: '14px',
    color: styles.colors.text.dark,
    display: 'flex',
    flexDirection: 'column',
    gap: styles.spacing.sm,
    padding: styles.spacing.md
  });

  // Selected text preview styled like the existing highlight
  const preview = document.createElement('div');
  preview.textContent = selectedText;
  applyStyles(preview, {
    padding: `${styles.spacing.sm} ${styles.spacing.sm} ${styles.spacing.sm} 10px`,
    borderLeft: `3px solid ${styles.colors.primary}`,
    backgroundColor: 'rgba(201, 100, 66, 0.04)',
    borderRadius: '0 2px 2px 0',
    fontSize: '0.875rem',
    lineHeight: '1.4',
    maxHeight: '80px',
    overflowY: 'auto',
    wordBreak: 'break-word'
  });

  // Textarea for the comment
  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Write a comment...';
  applyStyles(textarea, {
    width: '100%',
    minHeight: '80px',
    padding: styles.spacing.sm,
    border: `1px solid ${styles.colors.border}`,
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none'
  });
  textarea.addEventListener('focus', () => {
    textarea.style.borderColor = styles.colors.primary;
  });
  textarea.addEventListener('blur', () => {
    textarea.style.borderColor = styles.colors.border;
  });

  // Action row
  const actions = document.createElement('div');
  applyStyles(actions, {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: styles.spacing.sm
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  applyStyles(cancelBtn, createStyleObject(baseStyles.actionButton, {
    backgroundColor: styles.colors.text.normal,
    fontSize: '13px',
    padding: `${styles.spacing.xs} ${styles.spacing.sm}`
  }));

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  applyStyles(saveBtn, createStyleObject(baseStyles.actionButton, {
    backgroundColor: styles.colors.primary,
    fontSize: '13px',
    padding: `${styles.spacing.xs} ${styles.spacing.sm}`
  }));

  cancelBtn.addEventListener('click', () => {
    popover.remove();
    document.removeEventListener('mousedown', onOutsideClick);
  });

  saveBtn.addEventListener('click', () => {
    const commentText = textarea.value.trim();
    if (!commentText) {
      textarea.style.borderColor = '#f44336';
      textarea.focus();
      return;
    }
    saveComment(selectedText, commentText, range);
    popover.remove();
    document.removeEventListener('mousedown', onOutsideClick);
    if (sendCommentToInput) {
      setTimeout(() => sendToClaudeInput(`> "${selectedText}"\n\n${commentText}`), 50);
    }
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(saveBtn);

  const commentHint = document.createElement('div');
  commentHint.textContent = '⌘ Return to save';
  applyStyles(commentHint, {
    fontSize: '0.7rem',
    color: styles.colors.text.normal,
    textAlign: 'right',
    marginTop: '4px',
    opacity: '0.7'
  });

  popover.appendChild(preview);
  popover.appendChild(textarea);
  popover.appendChild(actions);
  popover.appendChild(commentHint);
  document.body.appendChild(popover);
  textarea.focus();

  popover.addEventListener('keydown', (e) => {
    if (e.metaKey && e.key === 'Enter') {
      e.preventDefault();
      saveBtn.click();
    }
  });

  // Close when clicking outside
  const onOutsideClick = (e) => {
    if (!popover.contains(e.target)) {
      popover.remove();
      document.removeEventListener('mousedown', onOutsideClick);
    }
  };
  // Use setTimeout so the current mousedown event doesn't immediately close it
  setTimeout(() => document.addEventListener('mousedown', onOutsideClick), 0);
}

function saveComment(selectedText, commentText, range) {
  const rangeInfo = range ? getRangeInfo(range) : null;
  const comment = {
    id: currentCommentId,
    selectedText,
    comment: commentText,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    range: rangeInfo,
    artifactName: activeArtifactName || null
  };
  comments.push(comment);
  highlightCommentText(range, comment.id);
  currentCommentId++;

  allClips[currentConversationId].comments = comments;
  allClips[currentConversationId].lastUpdated = new Date().toISOString();
  chrome.storage.local.set({ 'cairnNotesV2': allClips });

  // Switch to comments tab and show modal
  activeTab = 'comments';
  if (noteModal) {
    noteModal.style.display = 'flex';
  }
  updateModalContent();
}

// New function
async function openAnnotationModal(selection, isCodeBlock) {
    // Store selection info immediately
    const selectedText = selection.toString().trim();
    if (!selectedText) return; // Don't open if selection disappeared
    const range = selection.getRangeAt(0).cloneRange(); // Clone range for later use

    // --- Create Modal Elements ---
    const annotationModal = document.createElement('div');
    annotationModal.id = 'cairn-annotation-modal';
    applyStyles(annotationModal, createStyleObject(baseStyles.modal, {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center the modal
        width: '400px',
        maxHeight: '80vh', // Limit height
        zIndex: '10002', // Ensure it's above the main modal
        display: 'flex' // Make sure it's visible
    }));

    // Header
    const modalHeader = document.createElement('div');
    applyStyles(modalHeader, baseStyles.header);
    const modalTitle = document.createElement('span');
    modalTitle.textContent = 'Add to Topic';
    applyStyles(modalTitle, { fontWeight: 'bold' });
    const closeButton = document.createElement('button');
    applyStyles(closeButton, baseStyles.button);
    closeButton.appendChild(CairnIcons.createIcon('x', 20, styles.colors.text.normal));
    closeButton.onclick = () => document.body.removeChild(annotationModal);
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Content Area
    const modalContent = document.createElement('div');
    applyStyles(modalContent, createStyleObject(baseStyles.content, { display: 'flex', flexDirection: 'column', gap: styles.spacing.md }));

    // Preview Section
    const previewLabel = document.createElement('div');
    previewLabel.textContent = 'Selected text:';
    applyStyles(previewLabel, { fontWeight: 'bold' });
    const preview = document.createElement('div');
    preview.textContent = selectedText;
    applyStyles(preview, {
        padding: styles.spacing.sm,
        backgroundColor: styles.colors.background.light,
        borderRadius: '4px',
        fontSize: '0.875rem',
        maxHeight: '150px', // Limit preview height
        overflowY: 'auto'
    });

    // Labeling Section
    const labelingSection = document.createElement('div');
    applyStyles(labelingSection, { display: 'flex', flexDirection: 'column', gap: styles.spacing.sm });
    
    const existingTopics = await getTopics(); // Fetch existing topics (async)
    let labelSelect;

    if (existingTopics.length > 0) {
        const selectLabelText = document.createElement('label');
        selectLabelText.textContent = 'Select existing topic:';
        applyStyles(selectLabelText, { fontSize: '0.9rem', color: styles.colors.text.normal });

        labelSelect = document.createElement('select');
        applyStyles(labelSelect, { padding: styles.spacing.sm, border: `1px solid ${styles.colors.border}`, borderRadius: '4px' });

        // Add a default "Select..." option
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Select existing --";
        labelSelect.appendChild(defaultOption);

        // Add existing topics
        existingTopics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic.id;
            option.textContent = topic.name;
            labelSelect.appendChild(option);
        });
        labelingSection.appendChild(selectLabelText);
        labelingSection.appendChild(labelSelect);
    }

    const newLabelLabel = document.createElement('label');
    newLabelLabel.textContent = existingTopics.length > 0 ? 'Or add new topic:' : 'Add topic:';
     applyStyles(newLabelLabel, { fontSize: '0.9rem', color: styles.colors.text.normal, marginTop: existingTopics.length > 0 ? styles.spacing.sm : '0' });

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Enter new topic...';
    applyStyles(labelInput, { padding: styles.spacing.sm, border: `1px solid ${styles.colors.border}`, borderRadius: '4px' });
    labelingSection.appendChild(newLabelLabel);
    labelingSection.appendChild(labelInput);

    // Action Buttons
    const modalActions = document.createElement('div');
    applyStyles(modalActions, createStyleObject(baseStyles.actions, { borderTop: 'none', paddingTop: '0' })); // No border needed here
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    applyStyles(cancelButton, createStyleObject(baseStyles.actionButton, { backgroundColor: styles.colors.text.normal }));
    cancelButton.onclick = () => document.body.removeChild(annotationModal);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    applyStyles(saveButton, createStyleObject(baseStyles.actionButton, { backgroundColor: styles.colors.primary }));
    saveButton.onclick = async () => {
        let topicId = "";
        // Prioritize dropdown selection if it exists and has a value
        if (labelSelect && labelSelect.value) {
            topicId = labelSelect.value;
        } else {
            const newTopicName = labelInput.value.trim();
            if (!newTopicName) {
                alert("Please select or enter a topic.");
                return;
            }
            const topic = await addTopic(newTopicName);
            topicId = topic.id;
            topicsCache = await getTopics();
        }

        if (!topicId) {
            alert("Please select or enter a topic.");
            return;
        }

        // --- Save the clip with the topic ---
        // Multi-paragraph selections need to be split into a multi-element clip
        // (like saveClip does) so applyHighlights can restore them on reload —
        // a single elementContext locator can't match text spanning several blocks.
        const dedupedBlocks = findIntersectingBlocks(range);
        let clip;

        if (dedupedBlocks.length > 0) {
            clip = createMultiElementClip(dedupedBlocks, selectedText, isCodeBlock, true, currentClipId);
            if (!supportsElementHighlights()) {
              clip.range = null;
            }
        } else {
            const clipRangeInfo = supportsElementHighlights() ? getRangeInfo(range) : null;
            if (supportsElementHighlights() && !clipRangeInfo) {
                 console.error("Could not get range info for annotation.");
                 alert("Error saving annotation context. Please try again.");
                 document.body.removeChild(annotationModal);
                 return;
            }

            clip = createClipObject(
                range,
                selectedText,
                isCodeBlock,
                true, // Mark as secondary/annotation
                currentClipId // Use the current global ID
            );
        }
        clip.topicId = topicId; // Add the topic reference

        clips.push(clip);
        currentClipId++; // Increment AFTER assigning

        if (supportsElementHighlights()) {
          if (dedupedBlocks.length > 0) {
            dedupedBlocks.forEach(block => {
              const r = document.createRange();
              r.selectNodeContents(block);
              highlightClipText(r, clip.id, clip.isSecondary);
            });
          } else {
            highlightText(range, clip.id, clip.isCode, clip.isSecondary);
          }
        }
        updateStorageAndUI(); // Save to storage and update main modal

        document.body.removeChild(annotationModal); // Close this modal
    };

    modalActions.appendChild(cancelButton);
    modalActions.appendChild(saveButton);

    const annotationHint = document.createElement('div');
    annotationHint.textContent = '⌘ Return to save';
    applyStyles(annotationHint, {
      fontSize: '0.7rem',
      color: styles.colors.text.normal,
      textAlign: 'right',
      marginTop: '4px',
      opacity: '0.7'
    });

    // --- Assemble Modal ---
    modalContent.appendChild(previewLabel);
    modalContent.appendChild(preview);
    modalContent.appendChild(labelingSection);
    annotationModal.appendChild(modalHeader);
    annotationModal.appendChild(modalContent);
    annotationModal.appendChild(modalActions);
    annotationModal.appendChild(annotationHint);

    // Add to document
    document.body.appendChild(annotationModal);
    labelInput.focus(); // Focus the input field

    annotationModal.addEventListener('keydown', (e) => {
      if (e.metaKey && e.key === 'Enter') {
        e.preventDefault();
        saveButton.click();
      }
    });
} 