import { useState } from 'react';
import { Link } from 'react-router-dom';
import './BarberDemo.css';

const SERVICES = [
  { name: 'Classic Cut', price: '€25', time: '45min', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80' },
  { name: 'Fade + Beard', price: '€35', time: '60min', img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80' },
  { name: 'Hot Towel Shave', price: '€30', time: '45min', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
];

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
];

const TIME_SLOTS = ['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

export default function BarberDemo() {
  const [selectedTime, setSelectedTime] = useState('10:00');

  return (
    <div className="barber">
      <Link to="/" className="demo-badge">⚡ Demo by CorexaStudio</Link>

      {/* ── Navbar ── */}
      <nav className="barber__nav">
        <div className="barber__nav-inner">
          <span className="barber__logo">BLADE & CO.</span>
          <div className="barber__links">
            <a href="#b-services">Services</a>
            <a href="#b-gallery">Gallery</a>
            <a href="#b-book" className="barber__nav-btn">Book Now</a>
          </div>
        </div>
      </nav>

      {/* ── Hero — simple, template-like ── */}
      <section className="barber__hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80)' }}>
        <div className="barber__hero-overlay" aria-hidden="true" />
        <div className="barber__hero-inner">
          <h1 className="barber__hero-title">BLADE & CO.</h1>
          <p className="barber__hero-sub">Premium Barbershop — Dublin</p>
          <a href="#b-book" className="barber__btn barber__btn--primary">Book a Session</a>
        </div>
      </section>

      {/* ── Services — flat cards, no images ── */}
      <section id="b-services" className="barber__services">
        <div className="barber__container">
          <h2 className="barber__section-title">Our Services</h2>
          <div className="barber__svc-grid">
            {SERVICES.map(s => (
              <div key={s.name} className="barber__svc-card">
                <h3 className="barber__svc-name">{s.name}</h3>
                <div className="barber__svc-meta">
                  <span className="barber__svc-price">{s.price}</span>
                  <span className="barber__svc-time">{s.time}</span>
                </div>
                <a href="#b-book" className="barber__btn barber__btn--primary barber__btn--sm">Book</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking ── */}
      <section id="b-book" className="barber__booking">
        <div className="barber__container">
          <h2 className="barber__section-title">Book Your Session</h2>
          <form className="barber__form" onSubmit={e => e.preventDefault()}>
            <div className="barber__form-row">
              <input type="text" placeholder="Your name" className="barber__input" />
              <input type="tel" placeholder="Phone number" className="barber__input" />
            </div>
            <div className="barber__form-row">
              <select className="barber__input" defaultValue="">
                <option value="" disabled>Select a service</option>
                {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name} — {s.price}</option>)}
              </select>
              <input type="date" className="barber__input" />
            </div>
            <div className="barber__times">
              {TIME_SLOTS.map(t => (
                <button
                  key={t} type="button"
                  className={`barber__time-btn ${t === selectedTime ? 'is-active' : ''}`}
                  onClick={() => setSelectedTime(t)}
                >{t}</button>
              ))}
            </div>
            <button type="submit" className="barber__btn barber__btn--primary barber__btn--full">Confirm Booking</button>
          </form>
        </div>
      </section>

      {/* ── Gallery — simple grid, no hover ── */}
      <section id="b-gallery" className="barber__gallery">
        <div className="barber__container">
          <h2 className="barber__section-title">Gallery</h2>
          <div className="barber__gal-grid">
            {GALLERY_IMGS.map((src, i) => (
              <div key={i} className="barber__gal-item">
                <img src={src} alt={`Barbershop gallery ${i + 1}`} className="barber__gal-img" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="barber__footer">
        <div className="barber__container barber__footer-inner">
          <div>
            <span className="barber__logo">BLADE & CO.</span>
            <p className="barber__footer-addr">14 Camden Street, Dublin 2</p>
            <p className="barber__footer-addr">+353 1 234 5678</p>
          </div>
          <p className="barber__footer-credit">Powered by CorexaStudio</p>
        </div>
      </footer>
    </div>
  );
}
