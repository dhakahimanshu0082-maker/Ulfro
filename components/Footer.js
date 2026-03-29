'use client';

import Link from 'next/link';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

  return (
    <>
      <footer>
        <div className="footer-logo">ULFRO</div>
        <div className="footer-tagline">Any Task, Anytime, Anywhere — Now Live in Delhi! 🚀</div>
        <ul className="footer-links">
          <li><Link href="/#how-it-works">How It Works</Link></li>
          <li><Link href="/#categories">Categories</Link></li>
          <li><Link href="/#safety">Safety</Link></li>
          <li><Link href="/post-task/">Post a Task</Link></li>
          <li><Link href="/signup/">Become a Tasker</Link></li>
        </ul>
        <div className="footer-copy">© {new Date().getFullYear()} Ulfro. All rights reserved. | Made with ❤️ in Delhi, India</div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Hi%20Ulfro!%20I%20need%20help`}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp Support"
      >
        💬
      </a>
    </>
  );
}
