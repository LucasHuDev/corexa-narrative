import Philosophy from '../components/Philosophy.jsx';
import ArchitecturePinned from '../components/ArchitecturePinned.jsx';
import useH2Reveal from '../utils/useH2Reveal.js';
import { useT, useI18n } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';

export default function Studio() {
  useH2Reveal();
  const T = useT();
  const { lang } = useI18n();

  return (
    <>
      <header className="page-intro" aria-label="Studio">
        <div className="container page-intro__inner">
          <h1 className="page-intro__title">
            {lang === 'es' ? (
              <>Cómo pensamos.<br />Cómo construimos.</>
            ) : (
              <>How we think.<br />How we build.</>
            )}
          </h1>
        </div>
      </header>

      <Philosophy />
      <ArchitecturePinned />
    </>
  );
}
