import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './RegistrationJourney.css';

function PhotoPage({ step }) {
  return <div className="journal-photo"><img src={step.image} alt={step.alt} loading="lazy" /><span className="journal-photo-caption">InGenuityX / The journey</span></div>;
}
function TextPage({ step }) {
  return <div className="journal-page-copy">
    <div className="journal-page-top"><span>CHAPTER {step.number}</span><span aria-hidden="true">↗</span></div>
    <p className="journal-step-label">{step.label}</p><h3>{step.title}</h3>
    <p className="journal-step-description">{step.description}</p>
    <div className="journal-page-bottom"><span>Dare. Discover. Do.</span><span>{step.number} / 05</span></div>
  </div>;
}

export default function RegistrationJourney({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const touchStart = useRef(null);
  const move = direction => setActiveStep(previous => (previous + direction + steps.length) % steps.length);
  const handleKey = event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  };
  return <section id="registration-journey" data-cta-section="registration-journey" className="journey-journal" aria-labelledby="registration-journey-title">
    <header className="journal-heading">
      <h2 id="registration-journey-title">Dare <span>&gt;&gt;&gt;&gt;</span> Discover <span>&gt;&gt; DO</span></h2>
      <p className="journal-intro">Head to the pre-registration page to create your InGenuityX profile. Start there, then follow the journey from your first brief to the finale.</p>
    </header>
    <div className="journal-deck" id="journey-cards" role="region" aria-label="Five journey steps. Use the left and right arrow keys to explore." tabIndex={0} onKeyDown={handleKey}
      onPointerDown={event => { if (event.pointerType === 'touch') touchStart.current = event.clientX; }}
      onPointerUp={event => { if (event.pointerType !== 'touch' || touchStart.current === null) return; const distance = event.clientX - touchStart.current; touchStart.current = null; if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1); }}
      onPointerCancel={() => { touchStart.current = null; }}>
      {steps.map((step, index) => {
        let offset = (index - activeStep + steps.length) % steps.length;
        if (offset > Math.floor(steps.length / 2)) offset -= steps.length;
        const selected = offset === 0;
        return <article key={step.number} className={`journal-page${selected ? ' is-current' : ''}`} style={{ '--page-offset': offset, '--page-distance': Math.abs(offset), zIndex: steps.length - Math.abs(offset) }} aria-current={selected ? 'step' : undefined}>
          <div className="journal-spread" aria-hidden={!selected}><PhotoPage step={step} /><TextPage step={step} /></div>
          {!selected && <button type="button" className="journal-page-select" onClick={() => setActiveStep(index)} aria-label={`Show step ${step.number}: ${step.title}`} />}
        </article>;
      })}
    </div>
    <div className="journal-controls" onKeyDown={handleKey} aria-label="Journey navigation">
      <button type="button" className="journal-arrow" aria-label="Previous journey step" aria-controls="journey-cards" onClick={() => move(-1)}><ArrowLeft size={20} aria-hidden="true" /></button>
      <div className="journal-dots">{steps.map((step, index) => <button type="button" key={step.number} aria-label={`Go to journey step ${step.number}`} aria-pressed={index === activeStep} onClick={() => setActiveStep(index)}><span aria-hidden="true" /></button>)}</div>
      <button type="button" className="journal-arrow" aria-label="Next journey step" aria-controls="journey-cards" onClick={() => move(1)}><ArrowRight size={20} aria-hidden="true" /></button>
    </div>
    <p className="journal-current sr-only" role="status" aria-live="polite">{steps[activeStep].number} / 05 — {steps[activeStep].label}</p>
    <div className="journal-footer"><p>Ready to get started? Create your profile.</p><Link to="/register" className="journal-register">Pre-register</Link></div>
  </section>;
}
