import { useId } from "react";
import { getPortfolioCopy } from "@/data/wordpress";
import { chapters } from "@/data/chapters";
import { portfolioContent, type AudienceNeed } from "@/data/portfolio";
import { SiteHeader } from "@/components/site-header";
import { ProductClarityAnimation } from "@/components/product-clarity-animation";

function DimensionalIcon({ kind, label }: { kind: AudienceNeed["icon"]; label: string }) {
  const id = useId().replaceAll(":", "");
  const colors = {
    discover: { light: "#e4efcc", mid: "#a9c769", dark: "#5c7735", shine: "#fff9de" },
    direction: { light: "#e3e8ff", mid: "#8294e5", dark: "#495aa7", shine: "#f7f5ff" },
    workflow: { light: "#ffe5d3", mid: "#d99465", dark: "#9c5846", shine: "#fff5e9" },
  }[kind];

  return (
    <span className={`dimensional-icon dimensional-icon--${kind}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false">
        <defs>
          <radialGradient id={`${id}-sphere`} cx="29%" cy="23%" r="78%">
            <stop offset="0" stopColor={colors.shine} />
            <stop offset=".28" stopColor={colors.light} />
            <stop offset=".7" stopColor={colors.mid} />
            <stop offset="1" stopColor={colors.dark} />
          </radialGradient>
          <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff" stopOpacity=".82" />
            <stop offset="1" stopColor="#fff" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <ellipse cx="32" cy="54" rx="17" ry="4" fill="#23302b" opacity=".13" />
        <circle cx="31" cy="29" r="21" fill={`url(#${id}-sphere)`} />
        <circle cx="31" cy="29" r="20.5" fill="none" stroke={`url(#${id}-edge)`} strokeWidth="1" />
        <ellipse cx="23" cy="17" rx="7" ry="3.3" fill="#fff" opacity=".56" transform="rotate(-38 23 17)" />
        {kind === "discover" && <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
          <circle cx="29" cy="28" r="7.5" opacity=".96" />
          <path d="m34.5 33.5 7 7M29 17v3M18 28h3M37 28h3" opacity=".9" />
        </g>}
        {kind === "direction" && <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="m31 19 11 6-11 6-11-6 11-6Z" fill="#fff" fillOpacity=".18" />
          <path d="m20 31 11 6 11-6M20 37l11 6 11-6" opacity=".9" />
        </g>}
        {kind === "workflow" && <g fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 28h13M31 28v10" fill="none" strokeWidth="2" opacity=".95" />
          <circle cx="22" cy="28" r="4" fillOpacity=".92" />
          <circle cx="41" cy="28" r="4" fillOpacity=".72" />
          <circle cx="31" cy="40" r="4" fillOpacity=".86" />
        </g>}
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default async function Home() {
  const copy = await getPortfolioCopy(chapters);
  const content = portfolioContent;

  return (
    <main className="portfolio">
      <SiteHeader brand={content.brand} whatsappUrl={content.contact.whatsappUrl} />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy" data-reveal="rise">
          <p className="eyebrow"><span className="eyebrow-dot" />{content.hero.eyebrow}</p>
          <h1 id="hero-title">{content.hero.titleLead} <em>{content.hero.titleAccent}</em><br />{content.hero.titleEnd}</h1>
          <p className="hero-intro">{copy.home?.excerpt || content.hero.summary}</p>
          <div className="hero-actions">
            <a className="button-primary" href="#contact">{content.hero.primaryCta} <span aria-hidden="true">↗</span></a>
            <a className="button-text" href="#approach">{content.hero.secondaryCta} <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-note"><span className="hero-note-star">✳</span><span>{content.hero.audienceNote}</span></div>
        </div>
        <div className="hero-art" data-reveal="soft"><ProductClarityAnimation /></div>
        <div className="hero-bottom"><span>PRODUCT THINKING, MADE PRACTICAL</span><a href="#who-i-help">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="audience section-paper" id="who-i-help" aria-labelledby="audience-title">
        <div className="section-kicker"><span>01</span><span className="kicker-line" /><span>{content.audience.eyebrow}</span></div>
        <div className="section-heading" data-reveal="rise">
          <h2 id="audience-title">{content.audience.title}</h2>
          <p>{content.audience.intro}</p>
        </div>
        <div className="audience-grid">
          {content.audience.needs.map((need) => (
            <article className="audience-card" key={need.number} data-reveal="rise">
              <div className="audience-card-top"><DimensionalIcon kind={need.icon} label={`${need.title} icon`} /><span className="card-index">{need.number}</span></div>
              <h3>{need.title}</h3>
              <p className="card-audience">{need.audience}</p>
              <div className="card-copy"><span>The challenge</span><p>{need.problem}</p></div>
              <div className="card-copy"><span>How I help</span><p>{need.approach}</p></div>
              <div className="card-output"><span>USEFUL OUTPUT</span><p>{need.output}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience section-white" id="experience" aria-labelledby="experience-title">
        <div className="section-kicker"><span>02</span><span className="kicker-line" /><span>{content.experience.eyebrow}</span></div>
        <div className="experience-heading" data-reveal="rise">
          <h2 id="experience-title">{content.experience.title}</h2>
          <p>{content.experience.intro}</p>
        </div>
        <div className="company-logos" aria-label="Organisations Vijayebhava has worked with" data-reveal="rise">
          {content.experience.companies.map((company) => <div className={`company-logo ${company.logo ? "" : "company-logo-vyturr"}`} key={company.name}>
            {company.logo ? <img src={company.logo} alt={`${company.name} logo`} /> : <span className="vyturr-name">VYTURR</span>}
          </div>)}
        </div>
      </section>

      <section className="approach" id="approach" aria-labelledby="approach-title">
        <div className="section-kicker section-kicker-light"><span>03</span><span className="kicker-line" /><span>{content.approach.eyebrow}</span></div>
        <div className="approach-heading" data-reveal="rise">
          <h2 id="approach-title">{content.approach.title}</h2>
          <p>{content.approach.intro}</p>
        </div>
        <div className="approach-list">
          {chapters.map((chapter) => {
            const chapterCopy = copy.chapters[chapter.id];
            return (
              <article className="approach-row" key={chapter.id} data-reveal="rise">
                <span className="approach-number">{chapter.number}</span>
                <div className="approach-step-title"><span>{chapter.eyebrow}</span><h3>{chapterCopy?.title || chapter.title}</h3></div>
                <p className="approach-description">{chapterCopy?.excerpt || chapter.description}</p>
                <div className="approach-output"><span>OUTPUT</span><p>{chapter.deliverable}</p></div>
              </article>
            );
          })}
        </div>
        <div className="approach-endnote"><span>01—06</span><span>FROM UNDERSTANDING TO OUTCOMES</span><span className="endnote-dot" /></div>
      </section>

      {content.caseStudies.length > 0 && <section className="case-studies section-white" id="selected-work" aria-labelledby="case-studies-title">
        <div className="section-kicker"><span>04</span><span className="kicker-line" /><span>SELECTED WORK</span></div>
        <div className="section-heading"><h2 id="case-studies-title">Product work, grounded in evidence.</h2><p>Selected examples of a business problem, the work behind it and what changed.</p></div>
        <div className="case-study-grid">{content.caseStudies.map((study) => <article className="case-study" key={study.title}>
          <p className="case-context">{study.context}</p><h3>{study.title}</h3><p>{study.problem}</p>
          <dl><div><dt>Contribution</dt><dd>{study.contribution}</dd></div><div><dt>Work and outputs</dt><dd>{study.deliverables.join(" · ")}</dd></div><div><dt>Outcome</dt><dd>{study.outcome}</dd></div></dl>
          {study.confidentiality && <p className="case-confidentiality">{study.confidentiality}</p>}
        </article>)}</div>
      </section>}

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about-copy" data-reveal="rise">
          <div className="section-kicker"><span>05</span><span className="kicker-line" /><span>{content.about.eyebrow}</span></div>
          <h2 id="about-title">{content.about.title}</h2>
          {content.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="about-note">{content.about.note}</p>
          <a className="about-link" href={content.contact.linkedinUrl} target="_blank" rel="noreferrer">More about my work on LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
        <div className="about-credentials" data-reveal="soft">
          <p className="credentials-kicker">A little context</p>
          <p className="about-context">I connect business context, customer reality and engineering detail to help small teams choose a useful next step.</p>
          {content.about.credentials.map((item) => <article key={item.label}><span>{item.number}</span><div><h3>{item.label}</h3><p>{item.detail}</p></div></article>)}
        </div>
      </section>

      <section className="engagement section-white" id="engagement" aria-labelledby="engagement-title">
        <div className="section-kicker"><span>06</span><span className="kicker-line" /><span>{content.engagements.eyebrow}</span></div>
        <div className="section-heading" data-reveal="rise"><h2 id="engagement-title">{content.engagements.title}</h2><p>{content.engagements.intro}</p></div>
        <div className="engagement-grid">
          {content.engagements.options.map((option) => <article className="engagement-card" key={option.number} data-reveal="rise">
            <div className="engagement-card-top"><DimensionalIcon kind={option.icon} label={`${option.title} icon`} /><span>{option.number}</span></div>
            <h3>{option.title}</h3><p className="engagement-fit">{option.fit}</p><p className="engagement-focus">{option.focus}</p>
            <div className="engagement-outputs"><span>POSSIBLE OUTPUTS</span><ul>{option.outputs.map((output) => <li key={output}>{output}</li>)}</ul></div>
          </article>)}
        </div>
      </section>

      {content.testimonials.length > 0 && <section className="testimonials" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="sr-only">Client testimonials</h2>
        {content.testimonials.map((item) => <figure key={`${item.name}-${item.quote}`}><blockquote>{item.quote}</blockquote><figcaption>{item.name}<span>{item.role}</span></figcaption></figure>)}
      </section>}

      {content.writingSamples.length > 0 && <section className="writing-samples section-paper" aria-labelledby="writing-title">
        <div className="section-heading"><h2 id="writing-title">Notes on product work.</h2></div>
        <ul>{content.writingSamples.map((sample) => <li key={sample.url}><a href={sample.url}>{sample.title} <span aria-hidden="true">↗</span></a></li>)}</ul>
      </section>}

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="section-kicker"><span>07</span><span className="kicker-line" /><span>START A CONVERSATION</span></div>
        <div className="contact-content" data-reveal="rise">
          <p className="eyebrow"><span className="eyebrow-dot" /> The next good thing starts somewhere</p>
          <h2 id="contact-title">Have a challenge<br />worth <em>solving?</em></h2>
          <p>Bring the product question, the business problem or the workflow that needs a clear next step.</p>
          <div className="contact-actions">
            <a className="button-primary" href={content.contact.whatsappUrl} target="_blank" rel="noreferrer">Discuss your product <span aria-hidden="true">↗</span></a>
            <a className="button-outline" href={content.contact.linkedinUrl} target="_blank" rel="noreferrer">Connect on LinkedIn <span aria-hidden="true">↗</span></a>
            {content.contact.emailAddress && <a className="button-outline" href={`mailto:${content.contact.emailAddress}`}>Email me <span aria-hidden="true">↗</span></a>}
            {content.contact.bookingUrl && <a className="button-outline" href={content.contact.bookingUrl}>Choose a time <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
        <footer className="site-footer">
          <a className="footer-brand" href="#top" aria-label="Vijayebhava, back to top"><span className="footer-mark">VB</span><span>VIJAYEBHAVA</span></a>
          <span>PRODUCT MANAGEMENT · BUSINESS TRANSFORMATION</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </section>
    </main>
  );
}
