import InternshipDetails from './InternshipDetails';
import { Link } from 'react-router-dom';
import firstDropImage from '../imports/first-drop-reference.png';
import cityStoryImage from '../imports/city-story-reference.png';

function Join({ source, children = 'I’m in' }) {
  return <Link className="room-card-cta" to="/register" data-cta={source}>{children}<span aria-hidden="true">↗</span></Link>;
}
export default function RoomFirstDrop() {
  return <section className="room-first-drop" aria-labelledby="first-drop-title">
    <header className="first-drop-heading"><div><p className="drop-kicker"><span aria-hidden="true">✳</span> INGENUITYX / OPPORTUNITY EDIT</p><h1 id="first-drop-title">THE FIRST <span>DROP.</span></h1><p className="drop-intro">A fresh brief. A different take. Your next move.</p></div><span>NOV ’26</span></header>
    <div className="drop-index" aria-hidden="true"><span>01 — THE BRIEFS</span><span>SCROLL TO FIND YOUR NEXT MOVE ↓</span></div>
    <div className="first-drop-grid">
      <article className="room-card first-drop-card">
        <span className="drop-card-number" aria-hidden="true">01 <i> / BEAUTY</i></span><div className="first-drop-visual first-drop-beauty" role="img" aria-label="White sunscreen texture against a bright yellow background" style={{ backgroundImage: `url(${firstDropImage})` }} />
        <div className="room-card-body"><p className="room-card-top">BEAUTY / THE DAILY HABIT</p><h2>SPF needs a personality transplant.</h2><p className="room-description">Make sunscreen an everyday obsession. Not a beach-day afterthought.</p><InternshipDetails /><p className="first-drop-reveal">BRIEF DROPS IN NOVEMBER</p><Join source="rooms-first-drop-beauty" /></div>
      </article>
      <article className="room-card first-drop-card">
        <span className="drop-card-number" aria-hidden="true">02 <i> / AUTO</i></span><div className="first-drop-visual first-drop-auto" role="img" aria-label="An electric SUV in a dramatically lit blue studio" style={{ backgroundImage: `url(${firstDropImage})` }} />
        <div className="room-card-body"><p className="room-card-top">AUTO / BEYOND THE BATTERY</p><h2>Nobody falls in love with a charging port.</h2><p className="room-description">Can you make India desire an EV without talking about range?</p><p className="first-drop-reveal">BRIEF DROPS IN NOVEMBER</p><Join source="rooms-first-drop-ev" /></div>
      </article>
    </div>
    <article className="room-card first-drop-story">
      <div className="first-drop-people" role="img" aria-label="Three young people walking together on a city street" style={{ backgroundImage: `url(${cityStoryImage})` }} />
      <div className="room-card-body"><p className="room-card-top">AUTO / A THOUSAND DIFFERENT DREAMS</p><h2>Dear brands, India isn’t one big group chat.</h2><p className="room-description">Different cities. Different dreams. Can you build a story that gets them?</p><p className="first-drop-reveal">NOVEMBER REVEAL</p><Join source="rooms-first-drop-cities">Count me in</Join></div>
    </article>
    <div className="first-drop-angles" aria-label="A few angles to get you thinking">
      <article className="room-card"><p className="room-card-top">01 / BEYOND THE SPECS</p><h3>Dear EV brands, enough with the battery talk.</h3><p>Range. Charging. Kilometres. We’ve heard it all. Can you make India fall in love with an electric car for reasons that have nothing to do with the battery?</p><span>Build the story that makes people want the car, not just the technology.</span></article>
      <article className="room-card"><p className="room-card-top">02 / READ THE ROOM</p><h3>Not every dream has a Mumbai PIN code.</h3><p>India’s next generation of car buyers is rewriting the aspiration playbook. Can you read the room?</p></article>
      <article className="room-card"><p className="room-card-top">03 / A DIFFERENT KIND OF DESIRE</p><h3>One car. A thousand different flexes.</h3><p>Status in Surat. Freedom in Pune. Ambition in Patna. What makes the same car desirable in completely different worlds?</p></article>
    </div>
  </section>;
}
