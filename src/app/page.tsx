import OfficeScene from "@/components/OfficeScene";
import { chapters } from "@/data/chapters";
import { getPortfolioCopy } from "@/data/wordpress";

function OfficeIllustration() {
  return (
    <svg className="office-illustration" viewBox="0 0 620 420" role="img" aria-label="Illustration of a connected miniature office centered around a customer meeting">
      <defs>
        <linearGradient id="floor" x1="0" x2="0.9" y1="0" y2="1">
          <stop stopColor="#fffdf7" />
          <stop offset="1" stopColor="#ded7c9" />
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#43534b" floodOpacity=".13" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M310 32 582 175 310 318 38 175Z" fill="url(#floor)" stroke="#bfb8aa" strokeWidth="2" />
        <path d="M38 175v63l272 143v-63Z" fill="#34443f" />
        <path d="M582 175v63L310 381v-63Z" fill="#52645b" />
        <path d="M310 48 465 130 310 212 155 130Z" fill="#e7e4d8" />
        <path d="M310 48v48l155 82v-48Z" fill="#fcfaf5" stroke="#c9c1b2" />
        <path d="M465 130v38l-155 82v-38Z" fill="#f7f3ea" stroke="#c9c1b2" />
        <path d="M155 130v38l155 82v-38Z" fill="#eee4d7" stroke="#c9c1b2" />
        <path d="M310 212v38l-155-82v-38Z" fill="#f4eee3" stroke="#c9c1b2" />
        <path d="M70 190 165 240v66l-95-50Z" fill="#e6e3d8" stroke="#bfb8aa" />
        <path d="m455 242 95-50v67l-95 50Z" fill="#e1e7de" stroke="#bfb8aa" />
        <path d="m245 282 65 35 65-35-65-34Z" fill="#faf8f2" stroke="#c9c1b2" />
        <path d="m310 248 65 34v18l-65 35v-18l-65-35v-18Z" fill="#d6bd8f" opacity=".7" />
      </g>
      <g fill="#52756b">
        <circle cx="235" cy="133" r="9" /><circle cx="382" cy="145" r="9" />
        <circle cx="210" cy="232" r="9" /><circle cx="400" cy="218" r="9" />
        <circle cx="307" cy="280" r="9" />
      </g>
      <g fill="#c97a5f"><circle cx="292" cy="166" r="9" /><circle cx="350" cy="173" r="9" /></g>
      <g fill="none" stroke="#faf8f2" strokeLinecap="round" strokeWidth="3" opacity=".72">
        <path d="m196 104 44 23m145 8 38-20M150 214l43 23m224 16 38-22" />
      </g>
    </svg>
  );
}

export default async function Home() {
  const copy = await getPortfolioCopy(chapters);
  const homeTitle = copy.home?.title;
  const homeExcerpt = copy.home?.excerpt;
  return (
    <main className="portfolio">
      <OfficeScene />
      <div className="mobile-office"><OfficeIllustration /></div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Vijay Ebhava, home">VE<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#approach">How I work</a>
          <a href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Business transformation · Product · Delivery</p>
          <h1 id="hero-title">{homeTitle || <>Better business outcomes start with the <em>right problems.</em></>}</h1>
          <p className="hero-intro">{homeExcerpt || "I help businesses understand operational challenges, shape useful solutions, and work with teams to turn ideas into measurable improvements."}</p>
          <a className="text-link" href="#approach">Explore the approach <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-caption" aria-hidden="true"><span>ONE CONNECTED WAY OF WORKING</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <div className="chapter-list" id="approach">
        {chapters.map((chapter, index) => (
          <section className={`chapter chapter-${chapter.id}`} id={chapter.id} key={chapter.id} aria-labelledby={`${chapter.id}-title`}>
            <div className="chapter-copy">
              <div className="chapter-meta"><span>{chapter.number}</span><span className="meta-rule" /><span>{chapter.eyebrow}</span></div>
              <h2 id={`${chapter.id}-title`}>{copy.chapters[chapter.id]?.title || chapter.title}</h2>
              <p className="chapter-description">{copy.chapters[chapter.id]?.excerpt || chapter.description}</p>
              <div className="chapter-output"><span className="output-label">WHAT THIS CAN PRODUCE</span><p>{chapter.deliverable}</p></div>
              <p className="chapter-detail">{chapter.detail}</p>
              <a className="chapter-next" href={`#${chapters[(index + 1) % chapters.length].id}`}>
                {index === chapters.length - 1 ? "Back to discovery" : "Next, see how it connects"}<span aria-hidden="true">↓</span>
              </a>
            </div>
            <span className="chapter-index" aria-hidden="true">{chapter.number}<span> / 06</span></span>
          </section>
        ))}
      </div>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner">
          <p className="eyebrow"><span className="eyebrow-dot" /> A good place to begin</p>
          <h2 id="contact-title">Bring the challenge.<br /><em>We’ll find the useful next step.</em></h2>
          <p>Start with one process, one decision or one outcome that needs to work better. The scope can stay focused.</p>
          <div className="contact-note">Contact details can be added when you’re ready to publish.</div>
          <a className="back-link" href="#top">Back to the beginning <span aria-hidden="true">↑</span></a>
        </div>
        <footer><span>Vijay Ebhava</span><span>Customer-centred transformation</span><span>© {new Date().getFullYear()}</span></footer>
      </section>
      <div className="experience-note" aria-hidden="true">A connected office · Six chapters · One shared outcome</div>
    </main>
  );
}
