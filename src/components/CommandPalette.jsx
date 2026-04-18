import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT, useLang } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';
import './CommandPalette.css';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const T = useT();
  const { lang } = useLang();

  // Pages to search
  const allItems = [
    { title: T(t.nav.home), path: '/', description: lang === 'en' ? 'Return to homepage' : 'Volver al inicio' },
    { title: T(t.nav.services), path: '/services', description: lang === 'en' ? 'View our services and builds' : 'Ver nuestros servicios y desarrollos' },
    { title: T(t.nav.studio), path: '/studio', description: lang === 'en' ? 'Learn about our philosophy' : 'Conocé nuestra filosofía' },
    { title: T(t.nav.contact), path: '/contact', description: lang === 'en' ? 'Get in touch' : 'Ponete en contacto' },
    { title: T(t.nav.freeAudit), path: '/analyze', description: lang === 'en' ? 'Get a free technical audit' : 'Solicitá una auditoría técnica gratuita' },
  ];

  const filteredItems = query 
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      // Let Navbar handle overflow
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems.length > 0) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-header">
          <div className="cmd-icon-wrapper">
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder={T(t.nav.search)}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button className="cmd-close" onClick={onClose} aria-label="Close">
            ESC
          </button>
        </div>
        
        <div className="cmd-body">
          {filteredItems.length === 0 ? (
            <div className="cmd-empty">
              {lang === 'en' ? 'No results found.' : 'No se encontraron resultados.'}
            </div>
          ) : (
            <div className="cmd-list">
              <div className="cmd-list-heading">
                {lang === 'en' ? 'Pages' : 'Páginas'}
              </div>
              {filteredItems.map((item, idx) => (
                <div
                  key={item.path}
                  className={`cmd-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="cmd-item-icon">
                    <FileIcon />
                  </div>
                  <div className="cmd-item-content">
                    <span className="cmd-item-title">{item.title}</span>
                    <span className="cmd-item-desc">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="cmd-footer">
          <div className="cmd-hint">
            <span className="cmd-key">↑</span> <span className="cmd-key">↓</span> to navigate
          </div>
          <div className="cmd-hint">
            <span className="cmd-key">↵</span> to select
          </div>
        </div>
      </div>
    </div>
  );
}
