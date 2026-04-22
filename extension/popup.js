/**
 * CookieVault Extension - popup.js
 *
 * Features:
 * - Login to backend API (Sanctum token auth)
 * - Save current site's cookies to CookieVault backend
 * - List saved cookies from backend
 * - Load/inject saved cookies into the current tab
 * - Delete saved cookie entries
 * - Open CookieVault dashboard in a new tab
 */

// ============ CONFIG DEFAULTS (set via build placeholders) ============
const BUILD_API_URL = '__API_URL__';
const BUILD_FRONTEND_URL = '__FRONTEND_URL__';

function resolveBuiltUrl(value, fallback) {
  if (!value || value.startsWith('__')) return fallback;
  return value;
}

const DEFAULT_API_URL = resolveBuiltUrl(BUILD_API_URL, 'http://localhost:8000');
const DEFAULT_FRONTEND_URL = resolveBuiltUrl(BUILD_FRONTEND_URL, 'http://localhost:5173');

// ============ STATE ============
const API_URL = DEFAULT_API_URL.replace(/\/+$/, '');
const FRONTEND_URL = DEFAULT_FRONTEND_URL.replace(/\/+$/, '');
let AUTH_TOKEN = '';
let CURRENT_TAB = null;
let CURRENT_DOMAIN = '';

function normalizeApiUrl(rawUrl) {
  return (rawUrl || '').trim().replace(/\/+$/, '');
}

function isLocalApiHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]';
}

function isAllowedApiUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    if (url.protocol === 'https:') return true;

    return url.protocol === 'http:' && isLocalApiHost(url.hostname);
  } catch {
    return false;
  }
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await getCurrentTab();

  if (AUTH_TOKEN) {
    showScreen('main');
    loadCookies();
  } else {
    showScreen('login');
  }

  updateHeaderButtons();
  bindEvents();
});

// ============ SETTINGS ============
async function loadSettings() {
  const localData = await chrome.storage.local.get(['authToken']);
  const sessionData = await chrome.storage.session.get(['authToken']);

  AUTH_TOKEN = sessionData.authToken || '';

  if (!AUTH_TOKEN && localData.authToken) {
    AUTH_TOKEN = localData.authToken;
    await chrome.storage.session.set({ authToken: AUTH_TOKEN });
    await chrome.storage.local.remove('authToken');
  }
}

async function saveAuthToken() {
  if (AUTH_TOKEN) {
    await chrome.storage.session.set({ authToken: AUTH_TOKEN });
  } else {
    await chrome.storage.session.remove('authToken');
  }

  await chrome.storage.local.remove('authToken');
}

// ============ TAB ============
async function getCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      CURRENT_TAB = tab;
      const url = new URL(tab.url);
      CURRENT_DOMAIN = url.hostname.replace(/^www\./, '');
      // Blank tab detection
      if (!CURRENT_DOMAIN || url.protocol === 'chrome:' || url.protocol === 'chrome-extension:') {
        CURRENT_DOMAIN = '';
      }
      document.getElementById('current-site').textContent = CURRENT_DOMAIN || 'all sites';
      document.getElementById('section-domain').textContent = CURRENT_DOMAIN || 'All Cookies';
    }
  } catch (e) {
    console.error('Failed to get current tab:', e);
  }
}

// ============ SCREENS ============
function updateHeaderButtons() {
  const dashboardBtn = document.getElementById('btn-open-dashboard');
  if (dashboardBtn) {
    dashboardBtn.style.display = AUTH_TOKEN ? 'flex' : 'none';
  }
}

function showScreen(name) {
  document.getElementById('login-screen').classList.toggle('hidden', name !== 'login');
  document.getElementById('main-screen').classList.toggle('hidden', name !== 'main');
  updateHeaderButtons();
}

// ============ API HELPER ============
async function apiCall(path, options = {}) {
  const safeApiUrl = normalizeApiUrl(API_URL);

  if (!isAllowedApiUrl(safeApiUrl)) {
    throw new Error('Invalid API URL. Use HTTPS, or HTTP only for localhost.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
    ...options.headers,
  };

  const res = await fetch(`${safeApiUrl}${path}`, { ...options, headers });

  if (res.status === 401) {
    AUTH_TOKEN = '';
    await saveAuthToken();
    showScreen('login');
    throw new Error('Session expired, please login again');
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed (${res.status})`);
  }

  return res.json();
}

// ============ ACTIONS ============
async function handleOpenDashboard() {
  const frontendBase = FRONTEND_URL;
  if (!frontendBase) {
    alert('Frontend URL is not configured in build settings.');
    return;
  }

  chrome.tabs.create({ url: `${frontendBase}/dashboard` });
}

// ============ AUTH ============
async function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('btn-login');

  const safeApiUrl = normalizeApiUrl(API_URL);
  if (!isAllowedApiUrl(safeApiUrl)) {
    errorEl.textContent = 'Invalid API URL configured in extension build settings.';
    return;
  }

  if (!username || !password) {
    errorEl.textContent = 'Username and password are required';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Logging in...';
  errorEl.textContent = '';

  try {
    const data = await fetch(`${safeApiUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        login: username,
        password: password
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Login failed');
      }
      return res.json();
    });

    AUTH_TOKEN = data.data?.token || data.data?.access_token || '';
    if (!AUTH_TOKEN) throw new Error('No token received from server');

    await saveAuthToken();
    showScreen('main');
    loadCookies();
  } catch (e) {
    errorEl.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Login';
  }
}

async function handleLogout() {
  try {
    await apiCall('/api/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  }
  AUTH_TOKEN = '';
  await saveAuthToken();
  showScreen('login');
}

// ============ SAVE COOKIES ============
async function handleSaveCookies() {
  const statusEl = document.getElementById('save-status');
  const btn = document.getElementById('btn-save-cookies');
  const nameInput = document.getElementById('cookie-name-input');

  const cookieName = nameInput.value.trim();
  if (!cookieName) {
    statusEl.className = 'status-msg error';
    statusEl.textContent = 'Please enter a cookie name';
    return;
  }

  if (!CURRENT_DOMAIN) {
    statusEl.className = 'status-msg error';
    statusEl.textContent = 'Cannot detect current site';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Saving...';
  statusEl.textContent = '';

  try {
    // Get all cookies for the current domain
    const cookies = await chrome.cookies.getAll({ domain: CURRENT_DOMAIN });

    if (!cookies || cookies.length === 0) {
      statusEl.className = 'status-msg error';
      statusEl.textContent = 'No cookies found for this site';
      return;
    }

    // Save ALL cookie fields exactly as-is (like Cookie Editor export)
    const cookieValue = cookies.map(c => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      secure: c.secure,
      httpOnly: c.httpOnly,
      sameSite: c.sameSite,
      expirationDate: c.expirationDate || null,
      hostOnly: c.hostOnly || false,
      session: c.session || false,
      storeId: c.storeId || null,
    }));

    // Check if domain already exists
    const existing = await apiCall('/api/cookies');
    const existingForDomain = existing.data?.find(c => c.domain === CURRENT_DOMAIN);

    if (existingForDomain) {
      await apiCall(`/api/cookies/${existingForDomain.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: cookieName, domain: CURRENT_DOMAIN, value: cookieValue }),
      });
    } else {
      await apiCall('/api/cookies', {
        method: 'POST',
        body: JSON.stringify({ name: cookieName, domain: CURRENT_DOMAIN, value: cookieValue }),
      });
    }

    statusEl.className = 'status-msg success';
    statusEl.textContent = `Saved ${cookies.length} cookies for ${CURRENT_DOMAIN}`;
    nameInput.value = '';
    loadCookies();
  } catch (e) {
    statusEl.className = 'status-msg error';
    statusEl.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
      </svg>
      Save Cookies to Vault
    `;
  }
}

// ============ LOAD COOKIES LIST ============
async function loadCookies() {
  const listEl = document.getElementById('cookie-list');
  const searchEl = document.getElementById('cookie-search');
  const searchVal = searchEl ? searchEl.value.toLowerCase() : '';

  listEl.innerHTML = '<div class="loading">Loading...</div>';

  try {
    const data = await apiCall('/api/cookies');
    const allCookies = data.data || [];

    // Show all on blank tab, filter by domain on normal tab
    let filtered;
    if (CURRENT_DOMAIN) {
      filtered = allCookies.filter(c => {
        const d = c.domain.replace(/^\./, '');
        return d === CURRENT_DOMAIN || CURRENT_DOMAIN === d;
      });
    } else {
      filtered = allCookies;
    }

    // Apply search filter
    if (searchVal) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchVal) ||
        c.domain.toLowerCase().includes(searchVal)
      );
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty">No cookies${CURRENT_DOMAIN ? ' for ' + CURRENT_DOMAIN : ''}${searchVal ? ' matching "' + searchVal + '"' : ''}</div>`;
      return;
    }

    listEl.innerHTML = filtered.map(cookie => {
      const initial = (cookie.name || cookie.domain || '?').charAt(0).toUpperCase();
      const faviconUrl = `https://${cookie.domain.replace(/^\./, '')}/favicon.ico`;

      return `
        <div class="cookie-item" data-id="${cookie.id}" data-domain="${cookie.domain}">
          <div class="cookie-favicon-wrapper">
            <img class="cookie-favicon" src="${faviconUrl}" alt="${escapeHtml(cookie.name)} icon" loading="lazy">
            <div class="cookie-favicon-fallback">${escapeHtml(initial)}</div>
          </div>
          <div class="cookie-info">
            <div class="cookie-name">${escapeHtml(cookie.name)}</div>
            <div class="cookie-domain">${escapeHtml(cookie.domain)}</div>
          </div>
          <div class="cookie-actions">
            <button class="btn-load" data-action="load" data-id="${cookie.id}" data-domain="${cookie.domain}" title="Load cookies to this site">Load</button>
            <button class="btn-delete" data-action="delete" data-id="${cookie.id}" title="Delete">X</button>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('[data-action="load"]').forEach(btn => {
      btn.addEventListener('click', () => handleLoadCookie(parseInt(btn.dataset.id)));
    });

    listEl.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteCookie(parseInt(btn.dataset.id)));
    });

    // Inline event handlers are blocked by extension CSP, so favicon fallback is handled here.
    listEl.querySelectorAll('.cookie-favicon-wrapper').forEach(wrapper => {
      const img = wrapper.querySelector('.cookie-favicon');
      if (!img) return;

      const showFallback = () => wrapper.classList.add('show-fallback');

      img.addEventListener('error', showFallback, { once: true });
      if (img.complete && img.naturalWidth === 0) {
        showFallback();
      }
    });

  } catch (e) {
    listEl.innerHTML = `<div class="empty">Error: ${escapeHtml(e.message)}</div>`;
  }
}

// ============ LOAD/INJECT COOKIE ============
async function handleLoadCookie(cookieId) {
  if (!CURRENT_TAB || !CURRENT_TAB.url || !CURRENT_DOMAIN) {
    alert('Open the website tab first, then click Load.');
    return;
  }

  try {
    const data = await apiCall(`/api/cookies/${cookieId}`);
    const cookieEntry = data.data;
    const cookies = Array.isArray(cookieEntry.value) ? cookieEntry.value : [cookieEntry];
    const tabUrl = CURRENT_TAB.url;

    const stores = await chrome.cookies.getAllCookieStores();
    const store = stores.find(s => s.tabIds.includes(CURRENT_TAB.id));
    const storeId = store?.id || null;

    let injected = 0;

    for (const cookie of cookies) {
      if (cookie.expirationDate && cookie.expirationDate < Date.now() / 1000) continue;

      const toSet = {
        url: tabUrl,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain || '',
        path: cookie.path || '/',
        secure: cookie.secure || false,
        httpOnly: cookie.httpOnly || false,
      };

      if (storeId) toSet.storeId = storeId;
      if (cookie.expirationDate) toSet.expirationDate = cookie.expirationDate;
      if (cookie.hostOnly) toSet.domain = null;

      const ss = cookie.sameSite;
      if (ss && ss !== 'unspecified') {
        toSet.sameSite = ss;
        if (ss === 'no_restriction') toSet.secure = true;
      }

      try {
        const result = await chrome.cookies.set(toSet);
        if (result) injected++;
      } catch (e) { /* skip */ }
    }

    alert(`Injected ${injected}/${cookies.length} cookies.
Reloading page...`);
    await new Promise(r => setTimeout(r, 300));
    await chrome.tabs.update(CURRENT_TAB.id, { url: tabUrl });

  } catch (e) {
    alert('Error: ' + e.message);
  }
}

// ============ DELETE COOKIE ============
async function handleDeleteCookie(cookieId) {
  if (!confirm('Delete this cookie entry?')) return;

  try {
    await apiCall(`/api/cookies/${cookieId}`, { method: 'DELETE' });
    loadCookies();
  } catch (e) {
    alert('Error: ' + e.message);
  }
}

// ============ HELPERS ============
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ============ EVENT BINDINGS ============
function bindEvents() {
  document.getElementById('btn-login').addEventListener('click', handleLogin);
  document.getElementById('btn-open-dashboard').addEventListener('click', handleOpenDashboard);
  document.getElementById('btn-logout').addEventListener('click', handleLogout);
  document.getElementById('btn-save-cookies').addEventListener('click', handleSaveCookies);
  document.getElementById('btn-refresh').addEventListener('click', loadCookies);

  document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Search cookies (debounced)
  let searchTimeout;
  document.getElementById('cookie-search').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadCookies, 200);
  });

  // Password toggle
  document.getElementById('toggle-password').addEventListener('click', () => {
    const input = document.getElementById('login-password');
    const eyeOff = document.getElementById('eye-off');
    const eyeOn = document.getElementById('eye-on');
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    eyeOff.style.display = isPassword ? 'none' : 'block';
    eyeOn.style.display = isPassword ? 'block' : 'none';
  });
}
