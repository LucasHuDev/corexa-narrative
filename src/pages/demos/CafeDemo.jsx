import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CafeDemo.css';

const MENU = {
  coffee: [
    { name: 'Espresso', desc: 'Bold, short, essential.', price: 2.5 },
    { name: 'Flat White', desc: 'Velvety microfoam, double shot.', price: 3.5 },
    { name: 'Cold Brew', desc: '18-hour slow extraction.', price: 4.0 },
    { name: 'Oat Latte', desc: 'Creamy oat milk, house blend.', price: 4.5 },
  ],
  tea: [
    { name: 'Matcha Latte', desc: 'Ceremonial grade, oat milk.', price: 4.0 },
    { name: 'Chai', desc: 'Spiced masala, steamed milk.', price: 3.5 },
    { name: 'Green Tea', desc: 'Sencha, clean and bright.', price: 3.0 },
    { name: 'Herbal', desc: 'Chamomile, mint, or rooibos.', price: 3.0 },
  ],
  food: [
    { name: 'Avocado Toast', desc: 'Sourdough, chili flakes, lime.', price: 8.0 },
    { name: 'Granola Bowl', desc: 'House granola, yogurt, berries.', price: 7.0 },
    { name: 'Egg Sandwich', desc: 'Scrambled, cheddar, brioche.', price: 6.5 },
  ],
  pastries: [
    { name: 'Croissant', desc: 'Butter, flaky, baked daily.', price: 3.5 },
    { name: 'Banana Bread', desc: 'Walnut, brown butter, warm.', price: 4.0 },
    { name: 'Cookie', desc: 'Chocolate chunk, sea salt.', price: 2.5 },
  ],
};

const CATEGORIES = [
  { id: 'coffee', label: '☕ Coffee' },
  { id: 'tea', label: '🍵 Tea' },
  { id: 'food', label: '🥐 Food' },
  { id: 'pastries', label: '🧁 Pastries' },
];

const EVENTS = [
  { name: 'Coffee Tasting', date: 'Sat, Apr 12', desc: 'Explore single-origin beans from Ethiopia and Colombia.', img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80' },
  { name: 'Live Jazz Night', date: 'Fri, Apr 18', desc: 'Acoustic session with local Dublin musicians.', img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&q=80' },
  { name: 'Barista Workshop', date: 'Sun, Apr 26', desc: 'Learn latte art and extraction basics.', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
];

const STATS = [
  { num: '2019', label: 'Serving since' },
  { num: '14', label: 'Single-origin beans' },
  { num: '120K+', label: 'Cups served' },
  { num: '4.9', label: 'Google rating' },
];

export default function CafeDemo() {
  const [activeCat, setActiveCat] = useState('coffee');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const items = MENU[activeCat] || [];
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll('.cafe__reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name);
      if (existing) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
    setCartOpen(true);
  }

  function removeFromCart(name) {
    setCart(prev => prev.filter(c => c.name !== name));
  }

  return (
    <div className="cafe">
      <Link to="/" className="demo-badge">⚡ Demo by CorexaStudio</Link>

      {/* ── Navbar ── */}
      <nav className="cafe__nav">
        <div className="cafe__nav-inner">
          <span className="cafe__logo">AROMA CAFÉ</span>
          <div className="cafe__links">
            <a href="#c-menu">Menu</a>
            <a href="#c-story">Story</a>
            <a href="#c-events">Events</a>
            <button className="cafe__nav-btn" onClick={() => setCartOpen(true)}>
              Order {cart.length > 0 && <span className="cafe__cart-count">{cart.reduce((s,c) => s+c.qty, 0)}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero — split screen with image ── */}
      <section className="cafe__hero">
        <div className="cafe__hero-left">
          <span className="cafe__hero-tag cafe__reveal">Specialty Coffee · Dublin</span>
          <h1 className="cafe__hero-title cafe__reveal">Coffee, crafted with intention.</h1>
          <p className="cafe__hero-sub cafe__reveal">Single-origin beans, baked-fresh pastries, and a space designed for slow mornings.</p>
          <div className="cafe__hero-actions cafe__reveal">
            <a href="#c-menu" className="cafe__btn cafe__btn--primary">Explore Menu →</a>
            <a href="#c-story" className="cafe__btn cafe__btn--ghost">Our Story</a>
          </div>
        </div>
        <div className="cafe__hero-right" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80)' }} />
      </section>

      {/* ── Stats bar ── */}
      <section className="cafe__stats">
        <div className="cafe__container">
          <div className="cafe__stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="cafe__stat cafe__reveal">
                <span className="cafe__stat-num">{s.num}</span>
                <span className="cafe__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu ── */}
      <section id="c-menu" className="cafe__menu">
        <div className="cafe__container">
          <h2 className="cafe__section-title cafe__reveal">Our Menu</h2>
          <div className="cafe__tabs cafe__reveal">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id} type="button"
                className={`cafe__tab ${cat.id === activeCat ? 'is-active' : ''}`}
                onClick={() => setActiveCat(cat.id)}
              >{cat.label}</button>
            ))}
          </div>
          <div className="cafe__items" key={activeCat}>
            {items.map(item => (
              <div key={item.name} className="cafe__item">
                <div className="cafe__item-info">
                  <h3 className="cafe__item-name">{item.name}</h3>
                  <p className="cafe__item-desc">{item.desc}</p>
                </div>
                <span className="cafe__item-price">€{item.price.toFixed(2)}</span>
                <button className="cafe__btn cafe__btn--sm" onClick={() => addToCart(item)}>Add to Order</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cart overlay ── */}
      <div className={`cafe__cart-overlay ${cartOpen ? 'is-open' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cafe__cart ${cartOpen ? 'is-open' : ''}`}>
        <div className="cafe__cart-head">
          <h3 className="cafe__cart-title">Your Order</h3>
          <button className="cafe__cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        {cart.length === 0 ? (
          <p className="cafe__cart-empty">Nothing here yet.</p>
        ) : (
          <div className="cafe__cart-list">
            {cart.map(c => (
              <div key={c.name} className="cafe__cart-item">
                <span>{c.name} × {c.qty}</span>
                <span>€{(c.price * c.qty).toFixed(2)}</span>
                <button className="cafe__cart-rm" onClick={() => removeFromCart(c.name)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="cafe__cart-footer">
          <span className="cafe__cart-total">Total: €{total.toFixed(2)}</span>
          <button className="cafe__btn cafe__btn--primary cafe__btn--full">Checkout</button>
        </div>
      </aside>

      {/* ── Story ── */}
      <section id="c-story" className="cafe__story">
        <div className="cafe__container cafe__story-inner">
          <div className="cafe__story-text cafe__reveal">
            <h2 className="cafe__section-title">Our Story</h2>
            <p>We've been serving Dublin since 2019. Every cup is a conversation. We source single-origin beans directly from farms in Colombia, Ethiopia, and Guatemala — roasted weekly in small batches.</p>
            <p>Our pastries are baked fresh every morning, and our space is designed for the kind of slow mornings that make cities worth living in.</p>
          </div>
          <div className="cafe__story-visual cafe__reveal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80)' }} />
        </div>
      </section>

      {/* ── Events ── */}
      <section id="c-events" className="cafe__events">
        <div className="cafe__container">
          <h2 className="cafe__section-title cafe__reveal">Upcoming Events</h2>
          <div className="cafe__events-grid">
            {EVENTS.map(ev => (
              <div key={ev.name} className="cafe__event-card cafe__reveal">
                <div className="cafe__event-img-wrap">
                  <img src={ev.img} alt={ev.name} className="cafe__event-img" loading="lazy" />
                </div>
                <div className="cafe__event-content">
                  <span className="cafe__event-date">{ev.date}</span>
                  <h3 className="cafe__event-name">{ev.name}</h3>
                  <p className="cafe__event-desc">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="cafe__footer">
        <div className="cafe__container cafe__footer-inner">
          <div>
            <span className="cafe__logo">AROMA CAFÉ</span>
            <p className="cafe__footer-text">22 Capel Street, Dublin 1</p>
            <p className="cafe__footer-text">hello@aromacafe.ie</p>
          </div>
          <p className="cafe__footer-credit">Powered by CorexaStudio</p>
        </div>
      </footer>
    </div>
  );
}
