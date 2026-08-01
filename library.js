// Library script for Cairn Notes

// Global DOM element variables
let clipsTabButton, annotationsTabButton, commentsTabButton;
let searchInput, exportButton, clearAllButton;
let searchContainer, mainContentArea, clipsContainer, commentsMountEl, emptyState;
let activeLibraryTab = 'clips';

/** Notes-style exact label filter for Annotations tab only */
let currentLibraryAnnotationLabelFilter = null;
let labelFilterRow;
let labelFilterSelect;
let clearLabelFilterButton;

// Global data variables
let allClipsV2 = {};

document.addEventListener('DOMContentLoaded', function () {
  console.log('Library page loaded');

  searchInput = document.getElementById('search');
  exportButton = document.getElementById('export-notes');
  clearAllButton = document.getElementById('clear-all');

  mainContentArea = document.getElementById('library-main-content');
  if (!mainContentArea) {
    console.error('#library-main-content not found');
    return;
  }

  clipsTabButton = document.getElementById('library-tab-clips');
  annotationsTabButton = document.getElementById('library-tab-annotations');
  commentsTabButton = document.getElementById('library-tab-comments');

  if (!clipsTabButton || !annotationsTabButton || !commentsTabButton) {
    console.error('Library tab buttons not found');
    return;
  }

  clipsTabButton.addEventListener('click', () => switchLibraryTab('clips'));
  annotationsTabButton.addEventListener('click', () => switchLibraryTab('annotations'));
  commentsTabButton.addEventListener('click', () => switchLibraryTab('comments'));

  searchContainer = mainContentArea.querySelector('.search-container');
  clipsContainer = document.getElementById('clips-container');
  emptyState = document.getElementById('empty-state');

  if (searchContainer && searchContainer.parentNode) {
    searchContainer.parentNode.removeChild(searchContainer);
  }
  if (clipsContainer && clipsContainer.parentNode) {
    clipsContainer.parentNode.removeChild(clipsContainer);
  }
  if (emptyState && emptyState.parentNode) {
    emptyState.parentNode.removeChild(emptyState);
  }

  ensureAnnotationFilterControls();

  commentsMountEl = document.createElement('div');
  commentsMountEl.id = 'library-comments-mount';

  const container = document.querySelector('.container');
  if (container) {
    let header = container.querySelector('header');
    if (!header) {
      header = document.createElement('header');
      const title = document.createElement('h1');
      title.textContent = 'Cairn Notes Library';
      header.appendChild(title);
      container.prepend(header);
    }

    let headerActions = header.querySelector('.actions');
    if (!headerActions) {
      headerActions = document.createElement('div');
      headerActions.className = 'actions';
      header.appendChild(headerActions);
    }

    if (exportButton && exportButton.parentNode !== headerActions) {
      if (exportButton.parentNode) exportButton.parentNode.removeChild(exportButton);
      headerActions.appendChild(exportButton);
    }
    if (clearAllButton && clearAllButton.parentNode !== headerActions) {
      if (clearAllButton.parentNode) clearAllButton.parentNode.removeChild(clearAllButton);
      headerActions.appendChild(clearAllButton);
    }
  }

  chrome.storage.local.get(['cairnNotesV2'], function (result) {
    if (result.cairnNotesV2) {
      allClipsV2 = result.cairnNotesV2;
    }
    switchLibraryTab(activeLibraryTab);
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyLibrarySearch);
  } else {
    console.warn('Search input element not found during setup.');
  }
  if (exportButton) {
    exportButton.addEventListener('click', exportNotes);
  }
  if (clearAllButton) {
    clearAllButton.addEventListener('click', confirmClearAll);
  }
});

function ensureAnnotationFilterControls() {
  if (labelFilterRow) return;

  labelFilterRow = document.createElement('div');
  labelFilterRow.className = 'annotations-label-filter-row';

  labelFilterSelect = document.createElement('select');
  labelFilterSelect.id = 'library-label-filter-select';
  labelFilterSelect.setAttribute('aria-label', 'Filter by label');

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '-- Filter by label --';
  labelFilterSelect.appendChild(defaultOpt);

  labelFilterSelect.addEventListener('change', () => {
    currentLibraryAnnotationLabelFilter = labelFilterSelect.value || null;
    if (clearLabelFilterButton) {
      clearLabelFilterButton.disabled = !currentLibraryAnnotationLabelFilter;
    }
    applyLibrarySearch();
  });

  clearLabelFilterButton = document.createElement('button');
  clearLabelFilterButton.type = 'button';
  clearLabelFilterButton.id = 'library-clear-label-filter';
  clearLabelFilterButton.className = 'library-clear-label-filter';
  clearLabelFilterButton.textContent = 'Clear filter';
  clearLabelFilterButton.disabled = true;
  clearLabelFilterButton.addEventListener('click', () => {
    currentLibraryAnnotationLabelFilter = null;
    labelFilterSelect.value = '';
    clearLabelFilterButton.disabled = true;
    applyLibrarySearch();
  });

  labelFilterRow.appendChild(labelFilterSelect);
  labelFilterRow.appendChild(clearLabelFilterButton);
}

function getUniqueAnnotationLabels() {
  const set = new Set();
  Object.values(allClipsV2).forEach((conv) => {
    (conv.clips || []).forEach((c) => {
      if (c.isSecondary && c.label) set.add(c.label);
    });
  });
  return [...set].sort();
}

function refreshAnnotationLabelFilterOptions() {
  if (!labelFilterSelect) return;
  const unique = getUniqueAnnotationLabels();
  const preserved = currentLibraryAnnotationLabelFilter;

  labelFilterSelect.innerHTML = '';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '-- Filter by label --';
  labelFilterSelect.appendChild(defaultOpt);

  unique.forEach((l) => {
    const opt = document.createElement('option');
    opt.value = l;
    opt.textContent = l;
    labelFilterSelect.appendChild(opt);
  });

  if (preserved && unique.includes(preserved)) {
    labelFilterSelect.value = preserved;
    currentLibraryAnnotationLabelFilter = preserved;
  } else {
    currentLibraryAnnotationLabelFilter = null;
    labelFilterSelect.value = '';
  }
  if (clearLabelFilterButton) {
    clearLabelFilterButton.disabled = !currentLibraryAnnotationLabelFilter;
  }
}

function filterConversationsByExactLabel(conversationsObj, label) {
  const filtered = {};
  Object.entries(conversationsObj).forEach(([id, conv]) => {
    if (!conv.clips) return;
    const clips = conv.clips.filter((c) => c.isSecondary && c.label === label);
    if (clips.length > 0) {
      filtered[id] = { ...conv, clips };
    }
  });
  return filtered;
}

function updateTabAria(tabName) {
  const map = {
    clips: clipsTabButton,
    annotations: annotationsTabButton,
    comments: commentsTabButton,
  };
  Object.entries(map).forEach(([name, btn]) => {
    if (!btn) return;
    const active = name === tabName;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function updateSearchPlaceholder() {
  if (!searchInput) return;
  const placeholders = {
    clips: 'Search clips…',
    annotations: 'Search annotations…',
    comments: 'Search comments…',
  };
  searchInput.placeholder = placeholders[activeLibraryTab] || 'Search…';
}

// --- Tab switching ---
function switchLibraryTab(tabName) {
  const previousTab = activeLibraryTab;
  activeLibraryTab = tabName;

  if (previousTab === 'annotations' && tabName !== 'annotations') {
    currentLibraryAnnotationLabelFilter = null;
    if (labelFilterSelect) labelFilterSelect.value = '';
    if (clearLabelFilterButton) clearLabelFilterButton.disabled = true;
  }

  mainContentArea.innerHTML = '';

  updateTabAria(tabName);
  updateSearchPlaceholder();

  if (tabName === 'clips') {
    if (searchContainer) mainContentArea.appendChild(searchContainer);
    if (clipsContainer) mainContentArea.appendChild(clipsContainer);
    if (emptyState && !document.getElementById('empty-state')) {
      mainContentArea.appendChild(emptyState);
    }
    applyLibrarySearch();
  } else if (tabName === 'annotations') {
    ensureAnnotationFilterControls();
    refreshAnnotationLabelFilterOptions();

    const root = document.createElement('div');
    root.className = 'library-annotations-view';

    const toolbar = document.createElement('div');
    toolbar.className = 'library-annotations-toolbar';
    if (searchContainer) toolbar.appendChild(searchContainer);
    toolbar.appendChild(labelFilterRow);

    const layout = document.createElement('div');
    layout.className = 'annotations-layout';

    const mainCol = document.createElement('div');
    mainCol.className = 'annotations-main';
    if (clipsContainer) mainCol.appendChild(clipsContainer);

    const sidebar = document.createElement('aside');
    sidebar.className = 'annotations-labels-sidebar';

    layout.appendChild(mainCol);
    layout.appendChild(sidebar);

    root.appendChild(toolbar);
    root.appendChild(layout);
    mainContentArea.appendChild(root);

    renderAnnotationsLabelsSidebar(sidebar);
    applyLibrarySearch();
  } else if (tabName === 'comments') {
    if (searchContainer) mainContentArea.appendChild(searchContainer);
    mainContentArea.appendChild(commentsMountEl);
    applyLibrarySearch();
  }
}

async function renderAnnotationsLabelsSidebar(sidebarEl) {
  sidebarEl.innerHTML = '';
  const title = document.createElement('h3');
  title.className = 'annotations-sidebar-title';
  title.textContent = 'Labels';
  sidebarEl.appendChild(title);

  const labels = await getLabels();
  const list = document.createElement('div');
  list.className = 'annotations-labels-list';

  if (labels.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'annotations-labels-empty';
    empty.textContent = 'No labels yet.';
    sidebarEl.appendChild(empty);
    return;
  }

  labels.forEach((label) => {
    const row = document.createElement('div');
    row.className = 'annotations-label-row';

    const labelText = document.createElement('span');
    labelText.className = 'annotations-label-name';
    labelText.textContent = label;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'annotations-label-trash';
    del.title = `Delete label "${label}"`;
    del.appendChild(createSvgIcon('trash', 18, '#666'));
    del.addEventListener('click', () => deleteLabel(label));

    row.appendChild(labelText);
    row.appendChild(del);
    list.appendChild(row);
  });

  sidebarEl.appendChild(list);
}

// --- Comments Tab ---
function renderCommentsTab() {
  if (!commentsMountEl) return;
  commentsMountEl.innerHTML = '';

  const term = searchInput && searchInput.value ? searchInput.value.toLowerCase().trim() : '';

  let conversations = Object.entries(allClipsV2)
    .filter(([, conv]) => conv.comments && conv.comments.length > 0)
    .map(([convId, conv]) => {
      if (!term) return [convId, conv];
      const matching = conv.comments.filter(
        (c) =>
          (c.selectedText && c.selectedText.toLowerCase().includes(term)) ||
          (c.comment && c.comment.toLowerCase().includes(term))
      );
      if (matching.length === 0) return null;
      return [convId, { ...conv, comments: matching }];
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated));

  if (conversations.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-message';
    emptyDiv.textContent = term
      ? 'No comments match your search.'
      : 'No comments yet. Select text in Claude.ai and click "Comment" to add one.';
    commentsMountEl.appendChild(emptyDiv);
    return;
  }

  const container = document.createElement('div');
  container.className = 'conversations-container';

  conversations.forEach(([convId, conversation]) => {
    const section = document.createElement('div');
    section.className = 'conversation-section';

    const header = document.createElement('div');
    header.className = 'conversation-header';

    const title = document.createElement('h2');
    title.className = 'conversation-title';
    title.textContent = conversation.title || 'Untitled Conversation';
    title.style.margin = '0';

    header.appendChild(title);

    const commentsList = document.createElement('div');
    commentsList.className = 'conversation-clips';

    [...conversation.comments].reverse().forEach((comment) => {
      commentsList.appendChild(createCommentCard(comment, convId));
    });

    section.appendChild(header);
    section.appendChild(commentsList);
    container.appendChild(section);
  });

  commentsMountEl.appendChild(container);
}

function createCopyIconButton(getText, title = 'Copy') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'library-icon-button';
  btn.title = title;
  btn.appendChild(createSvgIcon('copy', 16, '#666'));
  btn.addEventListener('click', () => {
    const text = typeof getText === 'function' ? getText() : getText;
    copyToClipboard(text);
    btn.innerHTML = '';
    btn.appendChild(createSvgIcon('check', 16, '#22c55e'));
    setTimeout(() => {
      btn.innerHTML = '';
      btn.appendChild(createSvgIcon('copy', 16, '#666'));
    }, 1500);
  });
  return btn;
}

function createCommentCard(comment, conversationId) {
  const card = document.createElement('div');
  card.className = 'comment-card';

  const quote = document.createElement('div');
  quote.className = 'comment-quote';
  quote.textContent = comment.selectedText;

  const commentText = document.createElement('div');
  commentText.className = 'comment-text';
  commentText.textContent = comment.comment;

  const meta = document.createElement('div');
  meta.className = 'clip-meta';
  const dateSpan = document.createElement('span');
  dateSpan.textContent = new Date(comment.timestamp).toLocaleString();
  meta.appendChild(dateSpan);

  const actions = document.createElement('div');
  actions.className = 'clip-actions';

  const copyButton = createCopyIconButton(
    () => `> "${comment.selectedText}"\n\nComment: ${comment.comment}`,
    'Copy comment'
  );

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'danger';
  deleteButton.addEventListener('click', () => deleteCommentFromLibrary(comment.id, conversationId));

  actions.appendChild(copyButton);
  actions.appendChild(deleteButton);

  card.appendChild(quote);
  card.appendChild(commentText);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

function deleteCommentFromLibrary(commentId, conversationId) {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  const conversation = allClipsV2[conversationId];
  if (!conversation || !conversation.comments) return;

  conversation.comments = conversation.comments.filter((c) => c.id !== commentId);
  conversation.lastUpdated = new Date().toISOString();

  chrome.storage.local.set({ cairnNotesV2: allClipsV2 }, () => {
    switchLibraryTab('comments');
  });
}

async function deleteLabel(labelToDelete) {
  if (
    !confirm(
      `Are you sure you want to delete the label "${labelToDelete}"? This will remove the label from all associated annotations.`
    )
  ) {
    return;
  }

  try {
    const result = await new Promise((resolve) => chrome.storage.local.get(['cairnNotesV2'], resolve));
    let currentAllClips = result.cairnNotesV2 || {};
    let updated = false;

    Object.values(currentAllClips).forEach((conversation) => {
      if (conversation.clips && conversation.clips.length > 0) {
        conversation.clips.forEach((clip) => {
          if (clip.label === labelToDelete) {
            delete clip.label;
            updated = true;
          }
        });
      }
    });

    const currentLabels = await getLabels();
    const updatedLabels = currentLabels.filter((label) => label !== labelToDelete);

    if (updated) {
      await new Promise((resolve) => chrome.storage.local.set({ cairnNotesV2: currentAllClips }, resolve));
      allClipsV2 = currentAllClips;
      console.log(`Label "${labelToDelete}" removed from associated clips.`);
    }

    await new Promise((resolve) => chrome.storage.local.set({ cairnLabels: updatedLabels }, resolve));
    console.log(`Label "${labelToDelete}" deleted from global list.`);

    if (currentLibraryAnnotationLabelFilter === labelToDelete) {
      currentLibraryAnnotationLabelFilter = null;
      if (labelFilterSelect) labelFilterSelect.value = '';
      if (clearLabelFilterButton) clearLabelFilterButton.disabled = true;
    }

    switchLibraryTab('annotations');
  } catch (error) {
    console.error('Error deleting label:', error);
    alert('An error occurred while deleting the label.');
  }
}

async function getLabels() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['cairnLabels'], (result) => {
      resolve(result.cairnLabels || []);
    });
  });
}

function showEmptyState(target = clipsContainer, message) {
  if (!target) target = mainContentArea;
  target.innerHTML = '';
  const emptyDiv = document.createElement('div');
  emptyDiv.id = 'empty-state';
  emptyDiv.className = 'empty-message';
  emptyDiv.textContent =
    message || 'No notes found. Select text in Claude.ai and click "Clip" to save notes.';
  target.appendChild(emptyDiv);
}

function renderConversations(conversationsObj, options = {}) {
  const clipFilter = options.clipFilter || 'clips';
  const emptyMessage = options.emptyMessage;
  const showLabelOnCard = options.showLabelOnCard !== false;

  const clipPredicate =
    clipFilter === 'annotations' ? (c) => c.isSecondary : (c) => !c.isSecondary;

  const targetContainer = document.getElementById('clips-container') || mainContentArea;
  targetContainer.innerHTML = '';

  const entries = Object.entries(conversationsObj)
    .map(([id, conv]) => {
      if (!conv.clips || conv.clips.length === 0) return null;
      const clips = conv.clips.filter(clipPredicate);
      if (clips.length === 0) return null;
      return [id, { ...conv, clips }];
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated));

  if (entries.length === 0) {
    showEmptyState(targetContainer, emptyMessage);
    return;
  }

  const conversationsContainer = document.createElement('div');
  conversationsContainer.className = 'conversations-container';

  entries.forEach(([conversationId, conversation]) => {
    const conversationSection = document.createElement('div');
    conversationSection.className = 'conversation-section';

    const conversationHeader = document.createElement('div');
    conversationHeader.className = 'conversation-header';

    const conversationTitle = document.createElement('h2');
    conversationTitle.className = 'conversation-title';
    conversationTitle.textContent = conversation.title || 'Untitled Conversation';
    conversationTitle.style.margin = '0';

    const headerActions = document.createElement('div');
    headerActions.className = 'header-actions';

    const downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.textContent = 'Download';
    downloadButton.className = 'download-btn';
    downloadButton.addEventListener('click', () => downloadConversation(conversation));

    headerActions.appendChild(downloadButton);

    conversationHeader.appendChild(conversationTitle);
    conversationHeader.appendChild(headerActions);

    const conversationClips = document.createElement('div');
    conversationClips.className = 'conversation-clips';

    conversation.clips.forEach((clip) => {
      conversationClips.appendChild(createClipCard(clip, conversationId, { showLabelOnCard }));
    });

    conversationSection.appendChild(conversationHeader);
    conversationSection.appendChild(conversationClips);

    conversationsContainer.appendChild(conversationSection);
  });

  targetContainer.appendChild(conversationsContainer);
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
    }
    return `<p>${escapeHtml(text)}</p>`;
  }

  return `<p>${escapeHtml(clip.text)}</p>`;
}

function createClipCard(clip, conversationId, cardOptions = {}) {
  const showLabelOnCard = cardOptions.showLabelOnCard !== false;

  const clipCard = document.createElement('div');
  clipCard.className = 'clip-card';
  clipCard.dataset.clipId = clip.id;
  clipCard.dataset.conversationId = conversationId;

  const clipContent = document.createElement('div');
  clipContent.className = 'clip-content';

  const richDiv = document.createElement('div');
  richDiv.className = 'clip-richtext';
  richDiv.innerHTML = clipToRichHtml(clip);
  clipContent.appendChild(richDiv);
  if (showLabelOnCard && clip.label) {
    const clipLabel = document.createElement('div');
    clipLabel.textContent = clip.label;
    clipLabel.style.fontSize = '0.75rem';
    clipLabel.style.color = '#666';
    clipLabel.style.marginTop = '4px';
    clipLabel.style.fontStyle = 'italic';
    clipContent.appendChild(clipLabel);
  }

  const clipMeta = document.createElement('div');
  clipMeta.className = 'clip-meta';

  const clipDate = document.createElement('span');
  clipDate.textContent = new Date(clip.timestamp).toLocaleString();

  const clipNumber = document.createElement('span');
  clipNumber.textContent = `#${clip.id + 1}`;
  if (clip.isSecondary) {
    clipNumber.style.color = '#444';
  }

  clipMeta.appendChild(clipDate);
  clipMeta.appendChild(clipNumber);

  const clipActions = document.createElement('div');
  clipActions.className = 'clip-actions';

  const copyButton = createCopyIconButton(() => clip.text, 'Copy clip');

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'danger';
  deleteButton.addEventListener('click', () => {
    deleteClip(clip.id, conversationId);
  });

  clipActions.appendChild(copyButton);
  clipActions.appendChild(deleteButton);

  clipCard.appendChild(clipContent);
  clipCard.appendChild(clipMeta);
  clipCard.appendChild(clipActions);

  return clipCard;
}

function filterClipsDataBySearch(conversationsObj, searchTerm, clipPredicate) {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return conversationsObj;

  const filtered = {};
  Object.entries(conversationsObj).forEach(([id, conversation]) => {
    if (!conversation.clips) return;
    const matching = conversation.clips.filter((clip) => {
      if (!clipPredicate(clip)) return false;
      const inText = clip.text && clip.text.toLowerCase().includes(term);
      const inLabel = clip.label && clip.label.toLowerCase().includes(term);
      return inText || inLabel;
    });
    if (matching.length > 0) {
      filtered[id] = { ...conversation, clips: matching };
    }
  });
  return filtered;
}

function applyLibrarySearch() {
  if (!searchInput) return;

  const term = searchInput.value.trim();

  if (activeLibraryTab === 'clips') {
    const data = term
      ? filterClipsDataBySearch(allClipsV2, term, (c) => !c.isSecondary)
      : allClipsV2;
    renderConversations(data, {
      clipFilter: 'clips',
      showLabelOnCard: true,
      emptyMessage: term
        ? 'No clips match your search.'
        : 'No clips yet. Select text in Claude.ai and click "Clip" to save notes.',
    });
  } else if (activeLibraryTab === 'annotations') {
    let data = term
      ? filterClipsDataBySearch(allClipsV2, term, (c) => c.isSecondary)
      : allClipsV2;

    let emptyMessage = term
      ? 'No annotations match your search.'
      : 'No annotations yet. Select text and click "Annotate" to add one.';

    if (currentLibraryAnnotationLabelFilter) {
      data = filterConversationsByExactLabel(data, currentLibraryAnnotationLabelFilter);
      const hasAny = Object.keys(data).length > 0;
      if (!hasAny) {
        emptyMessage = `No annotations found with label: "${currentLibraryAnnotationLabelFilter}"`;
      }
    }

    renderConversations(data, {
      clipFilter: 'annotations',
      showLabelOnCard: false,
      emptyMessage,
    });
  } else if (activeLibraryTab === 'comments') {
    renderCommentsTab();
  }
}

function deleteClip(clipId, conversationId) {
  if (!confirm('Are you sure you want to delete this note?')) return;

  const conversation = allClipsV2[conversationId];
  if (!conversation) {
    console.error(`Conversation ${conversationId} not found for deletion.`);
    return;
  }

  const initialLength = conversation.clips.length;
  conversation.clips = conversation.clips.filter((clip) => clip.id !== clipId);

  if (conversation.clips.length < initialLength) {
    conversation.lastUpdated = new Date().toISOString();

    chrome.storage.local.set({ cairnNotesV2: allClipsV2 }, () => {
      console.log(`Clip ${clipId} deleted from conversation ${conversationId}`);
      switchLibraryTab(activeLibraryTab);
    });
  } else {
    console.warn(`Clip ${clipId} not found in conversation ${conversationId} for deletion.`);
  }
}

function confirmClearAll() {
  if (confirm('Are you sure you want to delete ALL notes from ALL conversations? This cannot be undone.')) {
    allClipsV2 = {};
    chrome.storage.local.set({ cairnNotesV2: allClipsV2, cairnLabels: [] }, () => {
      console.log('Cairn:All data cleared');
      switchLibraryTab(activeLibraryTab);
    });
  }
}

function exportNotes() {
  const hasNotes = Object.values(allClipsV2).some(
    (conversation) => conversation.clips && conversation.clips.length > 0
  );

  if (!hasNotes) {
    alert('No notes to export');
    return;
  }

  const exportData = {
    conversations: allClipsV2,
    exportDate: new Date().toISOString(),
    version: '2.0.0',
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `cairn-${new Date().toISOString().slice(0, 10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error('Failed to copy text:', err);
  });
}

function createSvgIcon(name, size, color) {
  const defs = {
    copy: [
      { type: 'rect', x: '8', y: '8', width: '14', height: '14', rx: '2', ry: '2' },
      { type: 'path', d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' },
    ],
    check: [{ type: 'path', d: 'M20 6L9 17l-5-5' }],
    trash: [
      { type: 'path', d: 'M3 6h18' },
      { type: 'path', d: 'M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2' },
      { type: 'path', d: 'M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6' },
      { type: 'path', d: 'M10 11v6M14 11v6' },
    ],
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', color);
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  (defs[name] || []).forEach((el) => {
    if (el.type === 'path') {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', el.d);
      svg.appendChild(path);
    } else if (el.type === 'rect') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      ['x', 'y', 'width', 'height', 'rx', 'ry'].forEach((attr) => {
        if (el[attr] !== undefined) rect.setAttribute(attr, el[attr]);
      });
      svg.appendChild(rect);
    }
  });
  return svg;
}

function downloadConversation(conversation) {
  let markdownContent = `# ${conversation.title}\n\n`;

  conversation.clips.forEach((clip) => {
    if (clip.isCode) {
      markdownContent += '```\n' + clip.text + '\n```\n\n';
    } else {
      markdownContent += `${clip.text}\n\n`;
      if (clip.label) {
        markdownContent += `_Label: ${clip.label}_\n\n`;
      }
    }
  });

  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  const safeTitle = (conversation.title || 'Untitled').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  downloadLink.download = `${safeTitle}.md`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
