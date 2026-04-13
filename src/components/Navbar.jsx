import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang, useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';
import './Navbar.css';

export default function Navbar() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [commandKey, setCommandKey] = useState('⌘ K');
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang } = useLang();
  const T = useT();

  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent;
    const isMac = platform.toLowerCase().indexOf('mac') !== -1 || platform.toLowerCase().indexOf('iphone') !== -1 || platform.toLowerCase().indexOf('ipad') !== -1;
    setCommandKey(isMac ? '⌘ K' : 'Ctrl K');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleCommandClick = () => {
    setIsCommandOpen(!isCommandOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <nav className={`global-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">

        {/* Left: Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            COREXA<span className="navbar-logo__mark">STUDIO</span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="navbar-center" role="navigation" aria-label="Main navigation">
          <Link to="/" className="nav-link">{T(t.nav.home)}</Link>
          <Link to="/services" className="nav-link">{T(t.nav.services)}</Link>
          <Link to="/studio" className="nav-link">{T(t.nav.studio)}</Link>
          <Link to="/contact" className="nav-link">{T(t.nav.contact)}</Link>
          <Link to="/analyze" className="nav-link nav-link--accent">{T(t.nav.freeAudit)}</Link>
        </div>

        {/* Right: Actions */}
        <div className="navbar-right">

          <button
            type="button"
            onClick={toggleLang}
            className="nav-lang-toggle desktop-only"
            aria-label={`Switch language to ${lang === 'en' ? 'Spanish' : 'English'}`}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>

          <div className="nav-social-desktop">
            <a href="https://contra.com/corexastudio" target="_blank" rel="noopener noreferrer" className="nav-social-icon desktop-only" aria-label="Contra">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 14,10 12,9 10,10" />
                <polygon points="22,12 14,14 13,12 14,10" />
                <polygon points="12,22 10,14 12,15 14,14" />
                <polygon points="2,12 10,10 11,12 10,14" />
              </svg>
            </a>

            <a href="https://www.linkedin.com/in/lucas-huenul-4328853ab/" target="_blank" rel="noopener noreferrer" className="nav-social-icon desktop-only" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            
            <a href="https://www.instagram.com/corexa.studio/" target="_blank" rel="noopener noreferrer" className="nav-social-icon desktop-only" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a href="https://wa.me/353834101709" target="_blank" rel="noopener noreferrer" className="nav-social-icon desktop-only" aria-label="WhatsApp">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          <div className="nav-command-separator desktop-only" aria-hidden="true"></div>

          <button className="nav-command-btn" onClick={handleCommandClick} aria-label="Search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="nav-command-text desktop-only">{T(t.nav.search)}</span>
            <span className="nav-command-key desktop-only">{commandKey}</span>
          </button>

          {/* Hamburger (Mobile Only) */}
          <button className={`nav-hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Navigation">
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>
      </div>
      
    </nav>

    {/* Mobile overlay — rendered outside <nav> to avoid stacking context
        issues caused by backdrop-filter on the fixed navbar */}
    <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
      <div className="mobile-nav-links">
        <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>{T(t.nav.home)}</Link>
        <Link to="/services" className="mobile-nav-link" onClick={closeMobileMenu}>{T(t.nav.services)}</Link>
        <Link to="/studio" className="mobile-nav-link" onClick={closeMobileMenu}>{T(t.nav.studio)}</Link>
        <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>{T(t.nav.contact)}</Link>
        <Link to="/analyze" className="mobile-nav-link mobile-nav-link--accent" onClick={closeMobileMenu}>{T(t.nav.freeAudit)}</Link>

        <button
          type="button"
          onClick={toggleLang}
          className="mobile-lang-toggle"
          aria-label={`Switch language to ${lang === 'en' ? 'Spanish' : 'English'}`}
          style={{
            marginTop: '24px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            alignSelf: 'center',
          }}
        >
          {lang === 'en' ? 'ESPAÑOL' : 'ENGLISH'}
        </button>
      </div>

      <div className="mobile-socials">
        <a href="https://contra.com/corexastudio" target="_blank" rel="noopener noreferrer" className="mobile-social-icon" aria-label="Contra">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 14,10 12,9 10,10" />
            <polygon points="22,12 14,14 13,12 14,10" />
            <polygon points="12,22 10,14 12,15 14,14" />
            <polygon points="2,12 10,10 11,12 10,14" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/lucas-huenul-4328853ab/" target="_blank" rel="noopener noreferrer" className="mobile-social-icon" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a href="https://www.instagram.com/corexa.studio/" target="_blank" rel="noopener noreferrer" className="mobile-social-icon" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a href="https://wa.me/353834101709" target="_blank" rel="noopener noreferrer" className="mobile-social-icon" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  </>
  );
}
