/* Browser-wide appearance preference. Loaded before styles to avoid a light flash. */
const SiteSettings = (() => {
  const key = 'studyspot_theme_v1';
  let theme = 'light';
  try { if (localStorage.getItem(key) === 'dark') theme = 'dark'; } catch (_) { /* Storage may be blocked. */ }
  let dialog;
  function apply(value, persist = false) {
    theme = value === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0f1115' : '#fbf7f0';
    let message = 'Applies across Study Spot on this browser. Not synced between devices.';
    if (persist) {
      try { localStorage.setItem(key, theme); message = 'Appearance saved in this browser.'; }
      catch (_) { message = 'Applied for this visit. Browser storage is unavailable, so this choice could not be saved.'; }
    }
    if (dialog) {
      dialog.querySelectorAll('input[name="site-theme"]').forEach(input => { input.checked = input.value === theme; });
      dialog.querySelector('#siteSettingsStatus').textContent = message;
    }
  }
  apply(theme);
  function buttonHTML() {
    return '<button type="button" class="site-settings-button" data-open-settings aria-label="Settings" aria-haspopup="dialog" aria-controls="siteSettings"><span aria-hidden="true">⚙</span></button>';
  }
  document.addEventListener('DOMContentLoaded', () => {
    dialog = document.createElement('dialog');
    dialog.id = 'siteSettings';
    dialog.className = 'site-settings-dialog';
    dialog.setAttribute('aria-labelledby', 'siteSettingsTitle');
    dialog.innerHTML = `<div class="site-settings-heading"><h2 id="siteSettingsTitle">Settings</h2><button type="button" class="site-settings-close" aria-label="Close settings">×</button></div><p class="site-settings-description">Make your study space comfortable.</p><fieldset><legend>Appearance</legend><div class="site-theme-options"><label><input type="radio" name="site-theme" value="light"><span class="site-theme-preview light" aria-hidden="true"></span><span>Light</span></label><label><input type="radio" name="site-theme" value="dark"><span class="site-theme-preview dark" aria-hidden="true"></span><span>Dark</span></label></div></fieldset><p id="siteSettingsStatus" role="status"></p>`;
    document.body.appendChild(dialog);
    apply(theme);
    dialog.querySelector('.site-settings-close').onclick = () => dialog.close();
    dialog.addEventListener('change', event => {
      if (event.target.matches('input[name="site-theme"]')) apply(event.target.value, true);
    });
    document.addEventListener('click', event => {
      if (event.target.closest('[data-open-settings]') && !dialog.open) dialog.showModal();
    });
    // Native dialog handles Tab, Shift+Tab and Escape. Suppress legacy page shortcuts.
    document.addEventListener('keydown', event => { if (dialog.open) event.stopImmediatePropagation(); }, true);
    window.addEventListener('hashchange', () => { if (dialog.open) dialog.close(); });
  });
  return { buttonHTML };
})();
