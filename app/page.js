'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Now Live in Delhi!</div>
          <h1>Any Task,<br /><span className="highlight">Done on Ulfro</span></h1>
          <p>Get any task done or earn money by helping others — no professional skills required. Delhi&apos;s easiest task marketplace.</p>
          <div className="hero-btns">
            <Link href="/post-task/" className="btn-primary">📋 Post a Task</Link>
            <Link href="/signup/?role=tasker" className="btn-secondary">💰 Start Earning</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">₹50</div><div className="stat-label">Starting From</div></div>
            <div className="stat"><div className="stat-num">50+</div><div className="stat-label">Task Categories</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Payment Safe</div></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="section-label">Process</div>
        <h2 className="section-title">How Does It Work?</h2>
        <p className="section-sub">3 simple steps — get any task done effortlessly!</p>
        <div className="steps animate-on-scroll">
          <div className="step-card">
            <div className="step-num">01</div><span className="step-icon">📋</span>
            <div className="step-title">Post Your Task</div>
            <div className="step-desc">Describe your task — any work, any budget, any time. Fill a simple form in under 2 minutes.</div>
          </div>
          <div className="step-card">
            <div className="step-num">02</div><span className="step-icon">🤝</span>
            <div className="step-title">Get Matched</div>
            <div className="step-desc">Nearby verified taskers will see your task and apply. You pick the best match for your needs.</div>
          </div>
          <div className="step-card">
            <div className="step-num">03</div><span className="step-icon">✅</span>
            <div className="step-title">Done &amp; Paid</div>
            <div className="step-desc">Once the task is complete, confirm it and payment is automatically released. 100% safe!</div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section" id="categories">
        <div className="section-label">Categories</div>
        <h2 className="section-title">Any Task. No Limits.</h2>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>No professional skill needed — anyone can do these tasks!</p>
        <div className="categories-grid animate-on-scroll">
          {CATEGORIES_DATA.map((cat, i) => (
            <div className="category-card" key={i}>
              <span className="cat-icon">{cat.icon}</span>
              <div className="cat-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY ULFRO */}
      <section className="section why-section">
        <div className="section-label">Why Ulfro</div>
        <h2 className="section-title">Why Choose Ulfro?</h2>
        <p className="section-sub">Your task and your money — both are completely safe with us!</p>
        <div className="features-grid animate-on-scroll">
          {FEATURES_DATA.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* POST A TASK */}
      <section className="form-section" id="post-task">
        <div className="form-container">
          <div className="form-info">
            <div className="section-label">Post a Task</div>
            <h2>Post Your Task Now</h2>
            <p>Any task — big or small — post it on Ulfro and someone nearby will get it done for you!</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['Fill the form — takes just 2 minutes', 'We match you with the best tasker', 'Pay only after task is completed', '100% payment protected'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start', fontSize: '0.9rem', color: '#6B7280' }}>
                  <span style={{ color: '#FF6B00', fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="form-card">
            <h3>📋 Ready to Post Your Task?</h3>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Click below — fill a simple form and we will match you with the best tasker!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {['Takes less than 2 minutes', 'We contact you on WhatsApp', 'Pay only after task is done', '100% payment protected'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.88rem', color: '#6B7280' }}>
                  <span style={{ color: '#FF6B00', fontWeight: 700 }}>✓</span> {item}
                </div>
              ))}
            </div>
            <Link href="/post-task/" className="form-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              🚀 Post My Task Now
            </Link>
          </div>
        </div>
      </section>

      {/* BECOME A TASKER */}
      <section className="tasker-section" id="become-tasker">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-label">Join as Tasker</div>
          <h2 className="section-title">Become a Tasker &amp; Start Earning!</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>No degree needed — just the willingness to work!</p>
        </div>
        <div className="tasker-form-container">
          <div className="tasker-form-card">
            <h3>🙋 Register as a Tasker</h3>
            <p>Register for free — no charges whatsoever!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', margin: '1.5rem 0' }}>
              {['Free registration — no charges', 'No professional skills required', 'Work at your own time & place', 'Payment guaranteed after completion', 'We will contact you on WhatsApp within 24 hours'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.88rem', color: '#6B7280' }}>
                  <span style={{ color: '#1A237E', fontWeight: 700 }}>✓</span> {item}
                </div>
              ))}
            </div>
            <Link href="/signup/?role=tasker" className="form-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: '#1A237E' }}>
              ✅ Register as a Tasker
            </Link>
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      <section className="payment-section" id="payment">
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <div className="section-label">Payment</div>
          <h2 className="section-title">100% Safe Payment System</h2>
          <p className="section-sub" style={{ margin: '0 auto 2.5rem' }}>Your money is always protected — released only after task completion!</p>
          <div className="payment-steps animate-on-scroll">
            {PAYMENT_STEPS.map((s, i) => (
              <div className="payment-step" key={i}>
                <div className="payment-step-icon">{s.icon}</div>
                <div className="payment-step-text"><strong>{s.title}</strong><span>{s.desc}</span></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <span className="commission-badge">✅ 100% Refund if task incomplete</span>
            <span className="commission-badge" style={{ background: 'var(--blue)' }}>🔒 UPI Payment Only</span>
          </div>
        </div>
      </section>

      {/* EARN */}
      <section className="earn-section" id="earn">
        <div className="section-label">Earn Money</div>
        <h2 className="section-title">Earn Money — No Skills Needed! 💰</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>No degree, no experience — just willingness to work. You set your own price!</p>
        <div className="earn-cards">
          {EARN_DATA.map((e, i) => (
            <div className="earn-card" key={i}>
              <span className="earn-amount">{e.icon}</span>
              <div className="earn-task">{e.name}</div>
            </div>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '2rem', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>You choose the tasks you want to do — earn as much as you want, whenever you want!</p>
      </section>

      {/* SAFETY */}
      <section className="safety-section" id="safety">
        <div className="section-label">Safety</div>
        <h2 className="section-title">Your Safety is Our Priority</h2>
        <p className="section-sub">Both clients and taskers are fully protected on Ulfro!</p>
        <div className="safety-grid animate-on-scroll">
          <div className="safety-card client">
            <h3>🛡️ For Clients</h3>
            {['All taskers are Aadhar verified', 'Real photos and identity on record', 'Star rating and review system', 'Report any suspicious behaviour', '100% payment protection always', '24 hour dispute resolution'].map((item, i) => (
              <div className="safety-item" key={i}>{item}</div>
            ))}
          </div>
          <div className="safety-card tasker">
            <h3>💼 For Taskers</h3>
            {['Payment guaranteed after completion', 'Safe escrow system protects you', 'Client identity is also verified', 'Rate your client after every task', 'Report unfair treatment anytime', 'Ulfro team available 24/7'].map((item, i) => (
              <div className="safety-item" key={i}>{item}</div>
            ))}
          </div>
          <div className="safety-card legal">
            <h3>⚠️ Our Safety Promise</h3>
            {['Complete records of all users maintained', 'Any fraud results in permanent ban', 'Legal action taken in serious cases', 'Keeping the community safe is our duty'].map((item, i) => (
              <div className="safety-item" key={i}>{item}</div>
            ))}
            <div className="legal-warning">🤝 Ulfro is an honest community. Everyone here helps each other — there is no place for cheating or fraud!</div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Data arrays to keep JSX clean
const CATEGORIES_DATA = [
  { icon: '📦', name: 'Delivery & Pickup' }, { icon: '🛒', name: 'Shopping & Errands' }, { icon: '🚗', name: 'Ride & Drop' },
  { icon: '📮', name: 'Courier & Post' }, { icon: '🧳', name: 'Luggage Help' }, { icon: '🏪', name: 'Store Pickup' },
  { icon: '📝', name: 'Assignment Help' }, { icon: '🎓', name: 'Tutoring & Coaching' }, { icon: '📚', name: 'Notes Making' },
  { icon: '🖥️', name: 'Online Class Help' }, { icon: '✏️', name: 'Proofreading' }, { icon: '🔬', name: 'Lab File Work' },
  { icon: '🧹', name: 'Cleaning & Sweeping' }, { icon: '🧺', name: 'Laundry & Ironing' }, { icon: '🍳', name: 'Cooking Help' },
  { icon: '🧴', name: 'Dishes & Kitchen' }, { icon: '🪴', name: 'Gardening & Plants' }, { icon: '🪣', name: 'Water & Supplies' },
  { icon: '💻', name: 'Tech Help & Setup' }, { icon: '📱', name: 'Phone & App Help' }, { icon: '🖨️', name: 'Printing & Scanning' },
  { icon: '📋', name: 'Data Entry & Typing' }, { icon: '🔍', name: 'Research & Info' }, { icon: '📊', name: 'Excel & Spreadsheets' },
  { icon: '🎨', name: 'Basic Design' }, { icon: '📸', name: 'Photography' }, { icon: '🎬', name: 'Video Recording' },
  { icon: '✂️', name: 'Basic Video Editing' }, { icon: '🖼️', name: 'Poster Making' }, { icon: '📣', name: 'Social Media Help' },
  { icon: '🔧', name: 'Minor Repairs' }, { icon: '💡', name: 'Electrical Fixes' }, { icon: '🚰', name: 'Plumbing Help' },
  { icon: '🪑', name: 'Furniture Assembly' }, { icon: '🎨', name: 'Wall Painting' }, { icon: '🔑', name: 'Locksmith Help' },
  { icon: '🐾', name: 'Pet Care & Walking' }, { icon: '👶', name: 'Babysitting' }, { icon: '👴', name: 'Elder Care Help' },
  { icon: '💊', name: 'Medicine Pickup' }, { icon: '🏥', name: 'Hospital Companion' }, { icon: '💇', name: 'Personal Styling' },
  { icon: '🎉', name: 'Event Help' }, { icon: '🎂', name: 'Party Planning' }, { icon: '🤝', name: 'Standing in Line' },
  { icon: '📜', name: 'Form Filling Help' }, { icon: '🏛️', name: 'Govt Office Help' }, { icon: '📰', name: 'Newspaper Delivery' },
  { icon: '🍱', name: 'Food & Tiffin' }, { icon: '🥗', name: 'Meal Prep Help' }, { icon: '☕', name: 'Tea & Snacks' },
  { icon: '📦', name: 'Packing & Moving' }, { icon: '🏠', name: 'Home Shifting Help' }, { icon: '🪜', name: 'Heavy Lifting' },
  { icon: '⚙️', name: 'Any Other Task' },
];

const FEATURES_DATA = [
  { icon: '🔒', title: '100% Payment Protection', desc: 'Your money stays with Ulfro until the task is complete. Payment is released only after your confirmation.' },
  { icon: '✅', title: 'Aadhar Verified Taskers', desc: 'Every tasker is verified with Aadhar — no fake identities, complete safety guaranteed for every task.' },
  { icon: '⭐', title: 'Rating & Review System', desc: 'Rate your tasker after every task. Top rated taskers appear first — quality is always guaranteed!' },
  { icon: '💰', title: 'Starting from just ₹50', desc: 'Even the smallest task can be posted — no minimum limit. Any budget, any task, anytime!' },
  { icon: '📍', title: 'Hyperlocal Matching', desc: 'Get matched with nearby taskers — faster delivery, local trust, and quick task completion every time.' },
  { icon: '🚨', title: '24hr Dispute Resolution', desc: 'Any problem? Our team resolves it within 24 hours. Your money is never at risk — ever.' },
];

const PAYMENT_STEPS = [
  { icon: '🔒', title: 'Client Pays Ulfro First', desc: 'Money goes to Ulfro securely — not directly to the tasker' },
  { icon: '💪', title: 'Tasker Completes the Work', desc: 'Your verified tasker gets the job done' },
  { icon: '👍', title: 'Client Confirms Completion', desc: 'Happy with the work? Click "Done" to confirm' },
  { icon: '💰', title: 'Tasker Receives Payment', desc: 'Minus 15% Ulfro platform fee — rest goes directly to tasker!' },
];

const EARN_DATA = [
  { icon: '📦', name: 'Delivery & Pickup' }, { icon: '📝', name: 'Assignment Help' }, { icon: '🛒', name: 'Shopping & Errands' },
  { icon: '📸', name: 'Photography' }, { icon: '🎓', name: 'Tutoring' }, { icon: '🔧', name: 'Repairs & Fixing' },
];
