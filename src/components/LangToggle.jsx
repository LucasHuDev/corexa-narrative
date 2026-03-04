import { useI18n } from "../i18n/I18nProvider";

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  const next = lang === "en" ? "es" : "en";

  return (
    <button
      type="button"
      className="sidenav__toggle langtoggle"
      onClick={() => setLang(next)}
      aria-label={`Switch language to ${next.toUpperCase()}`}
      data-cursor="hover"
    >
      {lang.toUpperCase()}
    </button>
  );
}
