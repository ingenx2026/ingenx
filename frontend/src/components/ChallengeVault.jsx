import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { VAULT_TEASERS } from '../data/vaultPreviews';
import './ChallengeVault.css';

export default function ChallengeVault({ categoryColors }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const rail = useRef(null);
  const stage = useRef(null);
  const expandingImage = useRef(null);
  const busy = useRef(false);
  const [transition, setTransition] = useState(null);
  const active = VAULT_TEASERS[activeIndex];
  const orderedChallenges = Array.from({ length: VAULT_TEASERS.length }, (_, offset) => {
    const index = (activeIndex + offset + 1) % VAULT_TEASERS.length;
    return { challenge: VAULT_TEASERS[index], index };
  });
  useEffect(() => { rail.current?.scrollTo({ left: 0, behavior: 'instant' }); }, [activeIndex]);
  useLayoutEffect(() => {
    if (!transition || !expandingImage.current) return;
    const { x, y, width, height, index } = transition;
    const animation = expandingImage.current.animate([
      { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`, borderRadius: '12px' },
      { left: '0px', top: '0px', width: '100%', height: '100%', borderRadius: '0px' }
    ], { duration: 950, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'both' });
    const finish = () => {
      setActiveIndex(index);
      setTransition(null);
      busy.current = false;
    };
    animation.onfinish = finish;
    const onResize = () => animation.finish();
    window.addEventListener('resize', onResize);
    return () => {
      animation.onfinish = null;
      animation.cancel();
      window.removeEventListener('resize', onResize);
    };
  }, [transition]);
  const select = index => {
    const nextIndex = (index + VAULT_TEASERS.length) % VAULT_TEASERS.length;
    if (busy.current || nextIndex === activeIndex) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveIndex(nextIndex);
      return;
    }
    const card = rail.current?.querySelector(`[data-challenge-index="${nextIndex}"]`);
    const frame = stage.current?.getBoundingClientRect();
    if (!card || !frame) { setActiveIndex(nextIndex); return; }
    const bounds = card.getBoundingClientRect();
    const railBounds = rail.current.getBoundingClientRect();
    // Previous/wrapped cards may be outside the rail viewport: bring their
    // transition origin to the leading card position without scrolling the page.
    const visible = bounds.left >= railBounds.left && bounds.right <= railBounds.right;
    busy.current = true;
    setTransition({ index: nextIndex, x: (visible ? bounds.left : railBounds.left + 5) - frame.left,
      y: bounds.top - frame.top, width: bounds.width, height: bounds.height });
  };
  const failImage = id => setFailedImages(previous => ({ ...previous, [id]: true }));
  return <section id="opportunities" data-cta-section="opportunities" className="challenge-vault" aria-labelledby="vault-heading">
    <div className="vault-container">
      <div ref={stage} className={`vault-cinema${transition ? ' is-transitioning' : ''}`} style={{ '--vault-accent': categoryColors[active.category] }}>
        <div className="vault-scene" key={active.id} aria-hidden="true">
          {!failedImages[active.id] && <img src={active.bgImage} alt="" style={{ objectPosition: active.imagePosition }} onError={() => failImage(active.id)} />}
        </div>
        {transition && <div ref={expandingImage} className="vault-expanding-image" aria-hidden="true">
          {!failedImages[VAULT_TEASERS[transition.index].id] && <img src={VAULT_TEASERS[transition.index].bgImage} alt="" style={{ objectPosition: VAULT_TEASERS[transition.index].imagePosition }} onError={() => failImage(VAULT_TEASERS[transition.index].id)} />}
        </div>}
        <div className="vault-cinema-shade" aria-hidden="true" />
        <header className="vault-header">
          <div className="vault-masthead">
            <h2 id="vault-heading"><span>The Challenge</span> <strong>Vault</strong></h2>
          </div>
          <div className="vault-introduction">
            <p className="vault-subtitle">Big questions. Brands under wraps. See one you’d love to take on?</p>
            <p className="vault-status">First drop / Preview · Full brief coming soon</p>
            <div className="vault-preview-count"><span>06</span><p>challenges.<br />Find your starting point.</p></div>
          </div>
        </header>
        <div className="vault-cinema-layout">
          <article className="vault-feature" aria-labelledby="vault-feature-title">
            <div className="vault-feature-copy" key={active.id}>
              <span className="vault-category"><span aria-hidden="true" />{active.category}</span>
              <p className="vault-industry">{active.company}</p>
              <h3 id="vault-feature-title">{active.title}</h3>
              <p className="vault-description">{active.description}</p>
            </div>
            <Link to="/register" state={{ selectedChallengeId: active.id }} data-cta={`vault-${active.id}`} className="vault-cta" aria-label={`Count me in — ${active.title}`}>Count me in <ArrowUpRight size={20} aria-hidden="true" /></Link>
            <p className="vault-helper">Pre-register · Full brief coming soon</p>
          </article>
          <div className="vault-selector">
            <div ref={rail} className="vault-card-rail" aria-label="Choose a challenge">
              {orderedChallenges.map(({ challenge, index }) => <button type="button" key={challenge.id} className="vault-preview" data-challenge-index={index} aria-pressed={index === activeIndex} aria-label={`Show challenge: ${challenge.title}`} onClick={() => select(index)} style={{ '--preview-accent': categoryColors[challenge.category] }}>
                {!failedImages[challenge.id] && <img src={challenge.bgImage} alt="" loading="lazy" style={{ objectPosition: challenge.imagePosition }} onError={() => failImage(challenge.id)} />}
                <span className="vault-preview-shade" aria-hidden="true" />
                <span className="vault-preview-copy"><span className="vault-preview-category">{challenge.category}</span><span className="vault-preview-title">{challenge.title}</span></span>
                <span className="vault-preview-marker" aria-hidden="true">{index === activeIndex ? '●' : '↗'}</span>
              </button>)}
            </div>
            <div className="vault-controls">
              <button type="button" onClick={() => select(activeIndex - 1)} aria-label="Previous challenge"><ArrowLeft size={22} aria-hidden="true" /></button>
              <button type="button" onClick={() => select(activeIndex + 1)} aria-label="Next challenge"><ArrowRight size={22} aria-hidden="true" /></button>
              <div className="vault-progress" aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / VAULT_TEASERS.length) * 100}%` }} /></div>
              <span className="vault-position" aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')}<small> / 06</small></span>
            </div>
            <p className="vault-sr-only" role="status" aria-live="polite">Challenge {activeIndex + 1} of {VAULT_TEASERS.length}: {active.title}</p>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
