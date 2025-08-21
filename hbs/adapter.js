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

    // Mirror Zendesk lists into HBS containers
    function mirrorLists() {
        try {
            const srcPopularDesktop = document.getElementById('zendesk-popular-list-desktop');
            const srcPopularMobile  = document.getElementById('zendesk-popular-list-mobile');
            const srcLatestDesktop  = document.getElementById('zendesk-latest-list-desktop');
            const srcLatestMobileCt = document.getElementById('zendesk-latest-list-mobile-container');
            const srcLatestMobile   = srcLatestMobileCt ? srcLatestMobileCt.querySelector('ul') : null;

            const hbsPopular = document.getElementById('faq-pop-list');
            const hbsLatest  = document.getElementById('faq-latest-list');

            if (srcPopularDesktop && hbsPopular) {
                hbsPopular.innerHTML = srcPopularDesktop.innerHTML || '';
            } else if (srcPopularMobile && hbsPopular) {
                hbsPopular.innerHTML = srcPopularMobile.innerHTML || '';
            }

            if (srcLatestDesktop && hbsLatest) {
                hbsLatest.innerHTML = srcLatestDesktop.innerHTML || '';
            } else if (srcLatestMobile && hbsLatest) {
                hbsLatest.innerHTML = srcLatestMobile.innerHTML || '';
            }
        } catch (e) {
            console.warn('mirrorLists failed', e);
        }
    }

    // Observe changes to source lists and mirror into HBS containers
    const observer = new MutationObserver(mirrorLists);
    ['zendesk-popular-list-desktop','zendesk-popular-list-mobile','zendesk-latest-list-desktop','zendesk-latest-list-mobile-container']
        .map(id => document.getElementById(id))
        .forEach(el => { if (el) observer.observe(el, { childList: true, subtree: true }); });

    // Also mirror after initial API loads
    setTimeout(mirrorLists, 300);

    // Bridge refresh buttons
    const btnPop = document.getElementById('faq-refresh-pop');
    const btnLat = document.getElementById('faq-refresh-latest');
    if (btnPop) btnPop.addEventListener('click', () => { try { window.loadPopularArticles && window.loadPopularArticles(); } catch(_){} });
    if (btnLat) btnLat.addEventListener('click', () => { try { window.loadLatestArticles && window.loadLatestArticles(); } catch(_){} });
});

