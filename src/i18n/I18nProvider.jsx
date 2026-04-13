import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations } from "./translations";

const I18nContext = createContext(null);

const STORAGE_KEY = "corexa_lang";

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore (private mode / blocked storage)
  }
}

function getBrowserLang() {
  const raw = (navigator.language || "en").toLowerCase();
  return raw.startsWith("es") ? "es" : "en";
}

export function I18nProvider({ children, defaultLang }) {
  const initial = defaultLang || safeGet(STORAGE_KEY) || getBrowserLang();
  const [lang, setLang] = useState(translations[initial] ? initial : "en");

  useEffect(() => {
    document.documentElement.lang = lang;
    safeSet(STORAGE_KEY, lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en;
    return (key) => dict[key] ?? translations.en[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useLang() {
  const { lang, setLang } = useI18n();
  const toggleLang = () => setLang(lang === "en" ? "es" : "en");
  return { lang, setLang, toggleLang };
}

export function useT() {
  const { lang } = useI18n();
  return (node) => {
    if (!node || typeof node !== "object") return node;
    return node[lang] ?? node.en ?? "";
  };
}
