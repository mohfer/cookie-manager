/**
 * CookieVault Extension - background.js (Service Worker)
 * 
 * Minimal service worker for Manifest V3.
 * Future: can add context menus, badge updates, etc.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('CookieVault extension installed');
});
