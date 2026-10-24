import { getPortfolioCopy } from "@/data/wordpress";
import { chapters } from "@/data/chapters";

const companies = [
  { name: "Eurofins", logo: "/companies/eurofins.png", className: "company-logo-eurofins" },
  { name: "Tekenlight", logo: "/companies/tekenlight.png", className: "company-logo-tekenlight" },
  { name: "SCMCentral", logo: "/companies/scmcentral.png", className: "company-logo-scmcentral" },
  { name: "Focaloid", logo: "/companies/focaloid.svg", className: "company-logo-focaloid" },
  { name: "Vyturr", logo: null, className: "company-logo-vyturr" },
];
const whatsappHref = "https://wa.me/919164488088?text=Hi%20Vijay%2C%20I%27d%20like%20to%20discuss%20a%20product%20or%20business%20challenge%20with%20you.";
const linkedInHref = "https://www.linkedin.com/in/vijaykumarbs/";

function ProductMap() {
  return (
    <div className="product-map" aria-label="A product journey connecting customer signals to a clear decision and thoughtful delivery">
      <div className="map-topline"><span>PRODUCT STRATEGY</span><span className="live-mark"><i /> IN MOTION</span></div>
      <div className="map-title">From friction<br />to <em>forward.</em></div>
      <div className="map-flow">
        <div className="map-node map-node-signal"><span className="node-index">01</span><span className="node-symbol">◎</span><strong>Customer signal</strong><small>What is getting in the way?</small></div>
        <div className="map-link"><i /><i /><i /></div>
        <div className="map-node map-node-decision"><span className="node-index">02</span><span className="node-symbol">✳</span><strong>Product decision</strong><small>What is worth solving now?</small></div>
        <div className="map-link"><i /><i /><i /></div>
        <div className="map-node map-node-delivery"><span className="node-index">03</span><span className="node-symbol">↗</span><strong>Useful delivery</strong><small>How will we know it helped?</small></div>
      </div>
      <div className="map-footer"><span>PEOPLE FIRST</span><span>OUTCOMES OVER OUTPUT</span><span>BUILT TO LEARN</span></div>
      <div className="map-glow" aria-hidden="true" />
    </div>
  );
}

export default async function Home() {
  const copy = await getPortfolioCopy(chapters);
  const homeTitle = copy.home?.title;
  const homeExcerpt = copy.home?.excerpt;

  return (
    <main className="portfolio">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Vijay Ebhava, home">
          <span className="wordmark-mark">VB</span><span className="wordmark-name">VIJAYEBHAVA</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#approach">Approach</a>
          <a href="#experience">Experience</a>
          <a className="nav-contact" href={whatsappHref} target="_blank" rel="noreferrer">Let’s talk <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Product management <span className="eyebrow-separator">/</span> Business transformation</p>
          <h1 id="hero-title">{homeTitle || <>Make the complex <em>clear.</em><br />Build what matters.</>}</h1>
          <p className="hero-intro">{homeExcerpt || "I connect customer needs, business priorities and engineering realities to help teams make better product decisions and deliver meaningful change."}</p>
          <div className="hero-actions">
            <a className="button-primary" href="#approach">Explore my approach <span aria-hidden="true">↓</span></a>
            <a className="button-text" href={linkedInHref} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-note"><span className="hero-note-star">✳</span><span>Clarity for the work<br />that moves business forward.</span></div>
        </div>
        <div className="hero-art"><ProductMap /></div>
        <div className="hero-bottom"><span>PRODUCT THINKING, MADE PRACTICAL</span><a href="#experience">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="experience" id="experience" aria-labelledby="experience-title">
        <div className="section-kicker"><span>01</span><span className="kicker-line" /><span>TRUST IS BUILT TOGETHER</span></div>
        <div className="experience-heading">
          <h2 id="experience-title">Good work happens<br />in <em>good company.</em></h2>
          <p>Across teams and industries, I’ve worked with people at</p>
        </div>
        <div className="company-logos" aria-label="Companies I have worked with">
          {companies.map((company) => <div className={`company-logo ${company.className}`} key={company.name}>
            {company.logo ? <img src={company.logo} alt={`${company.name} logo`} /> : <><span className="vyturr-mark" aria-hidden="true">V</span><span className="vyturr-name">VYTURR</span></>}
          </div>)}
        </div>
        <p className="experience-footnote">A few of the teams I’ve had the pleasure of working alongside.</p>
      </section>

      <section className="approach" id="approach" aria-labelledby="approach-title">
        <div className="section-kicker section-kicker-light"><span>02</span><span className="kicker-line" /><span>HOW I WORK</span></div>
        <div className="approach-heading">
          <h2 id="approach-title">Less theatre.<br /><em>More forward motion.</em></h2>
          <p>Make the problem visible. Make the decision together. Help the team deliver the right thing, well.</p>
        </div>
        <div className="approach-list">
          {chapters.map((chapter) => (
            <article className="approach-row" key={chapter.id}>
              <span className="approach-number">{chapter.number}</span>
              <h3>{chapter.eyebrow}</h3>
              <p>{chapter.description}</p>
              <span className="approach-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
        <div className="approach-endnote"><span>01—06</span><span>FROM UNDERSTANDING TO OUTCOMES</span><span className="endnote-dot" /></div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-orbit" aria-hidden="true"><span>VB</span><i /><i /><i /></div>
        <div className="section-kicker"><span>03</span><span className="kicker-line" /><span>START A CONVERSATION</span></div>
        <div className="contact-content">
          <p className="eyebrow"><span className="eyebrow-dot" /> The next good thing starts somewhere</p>
          <h2 id="contact-title">Have a challenge<br />worth <em>solving?</em></h2>
          <p>Bring the messy problem, the unanswered question or the idea that needs a clear next step.</p>
          <div className="contact-actions">
            <a className="button-primary" href={whatsappHref} target="_blank" rel="noreferrer">Start a WhatsApp chat <span aria-hidden="true">↗</span></a>
            <a className="button-outline" href={linkedInHref} target="_blank" rel="noreferrer">Connect on LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <footer className="site-footer">
          <a className="footer-brand" href="#top">VB <span>VIJAYEBHAVA</span></a>
          <span>PRODUCT MANAGEMENT · BUSINESS TRANSFORMATION</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </section>
    </main>
  );
}
