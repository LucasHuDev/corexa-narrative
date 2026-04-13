import Builds from '../components/Builds.jsx';
import useH2Reveal from '../utils/useH2Reveal.js';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';

export default function Services() {
  useH2Reveal();
  const T = useT();

  return (
    <>
      <header className="page-intro" aria-label="Services">
        <div className="container page-intro__inner">
          <h1 className="page-intro__title">{T(t.services.pageTitle)}</h1>
        </div>
      </header>

      <Builds />
    </>
  );
}
