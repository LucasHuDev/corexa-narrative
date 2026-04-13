import { Link } from 'react-router-dom';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';

export default function Privacy() {
  const T = useT();
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <h1 className="legal-page__title">{T(t.legal.privacy)}</h1>
        <p className="legal-page__updated">Last updated: April 2026</p>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">1. Who We Are</h2>
          <p className="legal-page__text">
            CorexaStudio is a web design and development studio based in Dublin, Ireland.
            You can reach us at <a href="mailto:corexastudio@gmail.com" className="legal-page__link">corexastudio@gmail.com</a>.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">2. What Data We Collect</h2>
          <p className="legal-page__text">
            When you use our contact form, we collect your name, email address, and company name.
            We also collect usage data through analytics tools, including pages visited and time spent on the site.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">3. How We Use Your Data</h2>
          <p className="legal-page__text">
            We use your data to respond to inquiries, improve the website experience, and send project
            updates only if you have contacted us first. We will never send unsolicited marketing emails.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">4. Cookies</h2>
          <p className="legal-page__text">
            We use essential cookies required for the site to function and optional analytics cookies
            to understand how visitors interact with the site. You can decline analytics cookies via
            our cookie consent banner displayed on your first visit.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">5. Third Parties</h2>
          <p className="legal-page__text">
            We do not sell your data to any third party. We may use Vercel for hosting and third-party
            email services to process contact form submissions. All data processors we work with are
            GDPR compliant.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">6. Your Rights</h2>
          <p className="legal-page__text">
            Under GDPR, you have the right to access, rectify, or delete your personal data at any time.
            To exercise these rights, contact us at{' '}
            <a href="mailto:corexastudio@gmail.com" className="legal-page__link">corexastudio@gmail.com</a>.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">7. Data Retention</h2>
          <p className="legal-page__text">
            Contact form submissions are retained for 12 months. After this period, data is permanently deleted
            unless an ongoing business relationship requires otherwise.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">8. Contact</h2>
          <p className="legal-page__text">
            For any privacy-related questions, reach us at{' '}
            <a href="mailto:corexastudio@gmail.com" className="legal-page__link">corexastudio@gmail.com</a>{' '}
            or visit <a href="https://corexastudio.com" className="legal-page__link">corexastudio.com</a>.
          </p>
        </section>

        <div className="legal-page__back">
          <Link to="/" className="legal-page__back-link">{T(t.legal.back)}</Link>
        </div>
      </div>
    </main>
  );
}
