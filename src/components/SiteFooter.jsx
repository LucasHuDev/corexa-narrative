import { Link } from 'react-router-dom';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';

export default function SiteFooter() {
  const T = useT();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__copy">© {new Date().getFullYear()} CorexaStudio</span>
        <nav className="site-footer__legal" aria-label="Legal">
          <Link to="/privacy" className="site-footer__link">{T(t.footer.privacy)}</Link>
          <span className="site-footer__sep" aria-hidden="true">·</span>
          <Link to="/terms" className="site-footer__link">{T(t.footer.terms)}</Link>
        </nav>
      </div>
    </footer>
  );
}
