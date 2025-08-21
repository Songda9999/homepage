// adapter.js - Bridge HBS-like markup to existing JS logic
document.addEventListener('DOMContentLoaded', function () {
    // Ensure globals exist from translation.js
    if (!window.translations) window.translations = {};
    if (!window.languages) window.languages = [
        { code: 'zh-CN', name: '简体中文' },
        { code: 'en-US', name: 'English' }
    ];

    // Initialize language and trigger initial loads (reusing main.js behavior)
    const saved = localStorage.getItem('language') || 'zh-CN';
    if (typeof window.dispatchEvent === 'function') {
        // set document lang and search placeholder via main.js setLanguage
        try {
            const setLanguageEvt = new CustomEvent('languageChanged', { detail: { lang: saved } });
            document.documentElement.lang = saved;
            window.currentLanguage = saved;
            window.dispatchEvent(setLanguageEvt);
        } catch (e) {
            console.warn('languageChanged dispatch failed, will rely on main.js boot', e);
        }
    }
});

