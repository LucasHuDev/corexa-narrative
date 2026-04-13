import { Link } from 'react-router-dom';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';

export default function Terms() {
  const T = useT();
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <h1 className="legal-page__title">{T(t.legal.terms)}</h1>
        <p className="legal-page__updated">Last updated: April 2026</p>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">1. Services</h2>
          <p className="legal-page__text">
            CorexaStudio provides web design, development, and digital strategy services
            for businesses of all sizes. The scope of each engagement is defined in the project proposal.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">2. Project Agreements</h2>
          <p className="legal-page__text">
            All projects begin with a written proposal and require a deposit before work commences.
            Work starts only upon receipt of a signed agreement from the client.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">3. Intellectual Property</h2>
          <p className="legal-page__text">
            Upon full payment, the client owns the final deliverable, including all source code and assets
            produced for the project. CorexaStudio retains the right to showcase the work in its portfolio
            and marketing materials unless otherwise agreed in writing.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">4. Payments</h2>
          <p className="legal-page__text">
            A 50% deposit is required to begin any project. The remaining balance is due upon project
            completion and final delivery. Late payments may incur additional fees as outlined in the proposal.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">5. Revisions</h2>
          <p className="legal-page__text">
            Each project includes a defined number of revision rounds as specified in the proposal.
            Additional revisions beyond the agreed scope will be billed at our standard hourly rate.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">6. Confidentiality</h2>
          <p className="legal-page__text">
            We treat all client information, including business data, strategies, and materials shared
            during a project, as strictly confidential. We will not disclose this information to third
            parties without prior written consent.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">7. Limitation of Liability</h2>
          <p className="legal-page__text">
            CorexaStudio shall not be held liable for any indirect, incidental, or consequential damages
            arising from the use of delivered work. Our total liability is limited to the amount paid
            by the client for the specific project in question.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">8. Governing Law</h2>
          <p className="legal-page__text">
            These terms are governed by and construed in accordance with the laws of Ireland.
            Any disputes arising under these terms shall be subject to the exclusive jurisdiction
            of the Irish courts.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__heading">9. Contact</h2>
          <p className="legal-page__text">
            For questions about these terms, contact us at{' '}
            <a href="mailto:corexastudio@gmail.com" className="legal-page__link">corexastudio@gmail.com</a>.
          </p>
        </section>

        <div className="legal-page__back">
          <Link to="/" className="legal-page__back-link">{T(t.legal.back)}</Link>
        </div>
      </div>
    </main>
  );
}
