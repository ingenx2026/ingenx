import { API_BASE } from '../apiConfig';
import { useEffect } from 'react';
const API = API_BASE;
export default function CtaAnalytics() {
  useEffect(() => {
    const capture = event => {
      if (event.type === 'auxclick' && event.button !== 1) return;
      const target = event.target instanceof Element ? event.target : null;
      const cta = target?.closest('[data-cta], a[href="/register"]');
      if (!cta || cta.hasAttribute('disabled')) return;
      const section = cta.closest('[data-cta-section]');
      const source = cta.dataset.cta || section?.dataset.ctaSection || 'other';
      const payload = { eventId: crypto.randomUUID(), source, page: window.location.pathname.replace(/\/$/, '') || '/', label: ((target.closest('button, a') || cta).innerText || cta.getAttribute('aria-label') || 'Join').trim().replace(/\s+/g, ' ').slice(0, 120) };
      // No cookies, visitor identifiers, form answers, referrers or query strings.
      // Analytics is best-effort and must never block registration navigation.
      fetch(`${API}/api/cta-events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
    };
    document.addEventListener('click', capture, true);
    document.addEventListener('auxclick', capture, true);
    return () => { document.removeEventListener('click', capture, true); document.removeEventListener('auxclick', capture, true); };
  }, []);
  return null;
}
