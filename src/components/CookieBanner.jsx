import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const T = useT();

  useEffect(() => {
    const consent = localStorage.getItem('corexa_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  function setConsent(value) {
    localStorage.setItem('corexa_cookie_consent', value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p className="cookie-banner__text">
        {T(t.cookieBanner.text)}{' '}
        {T(t.cookieBanner.continuing)}{' '}
        <Link to="/privacy" className="cookie-banner__link">{T(t.cookieBanner.privacy)}</Link>.
      </p>
      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--ghost"
          onClick={() => setConsent('declined')}
        >
          {T(t.cookieBanner.decline)}
        </button>
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--fill"
          onClick={() => setConsent('accepted')}
        >
          {T(t.cookieBanner.accept)}
        </button>
      </div>
    </div>
  );
}
