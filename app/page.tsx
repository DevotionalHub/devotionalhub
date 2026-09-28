import {
  ArrowRight,
  BookHeart,
  BookOpenCheck,
  CalendarDays,
  Check,
  Download,
  Feather,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

const dailyElements = [
  "A focused Scripture reading",
  "A thoughtful devotional message",
  "Guided prayer points",
  "One practical action for the day",
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="site-header shell">
        <BrandLogo />
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#rhythm">Daily rhythm</a>
          <a href="#features">Features</a>
          <Link href="/login">Sign in</Link>
          <Link className="button button--primary button--small" href="/register">
            Get started
          </Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero__copy">
          <div className="hero__eyebrow">
            <span />
            Scripture for ordinary days
          </div>
          <h1>
            Start the day
            <br />
            <em>rooted in truth.</em>
          </h1>
          <p className="hero__lede">
            Daily Scripture, thoughtful reflection, and guided prayer—gathered
            into one quiet place for your walk with God.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/register">
              Begin your journey
              <ArrowRight size={18} />
            </Link>
            <Link className="button button--ghost" href="/login">
              I already have an account
            </Link>
          </div>
          <div className="hero__trust">
            <span className="avatar-stack" aria-hidden="true">
              <i>AM</i>
              <i>JO</i>
              <i>NK</i>
            </span>
            <p>
              <strong>Free to begin.</strong> Read without an account, or sign in
              to keep your progress.
            </p>
          </div>
        </div>

        <div className="hero__visual" aria-label="Example daily devotional">
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />
          <article className="devotional-preview">
            <div className="devotional-preview__top">
              <div>
                <p>Today’s devotional</p>
                <span>5 min read</span>
              </div>
              <div className="preview-date">
                <strong>28</strong>
                <span>SEP</span>
              </div>
            </div>
            <div className="preview-art" aria-hidden="true">
              <div className="sun" />
              <div className="hill hill--back" />
              <div className="hill hill--front" />
              <Feather size={30} />
            </div>
            <div className="devotional-preview__body">
              <p className="eyebrow">Renewal · Ezekiel 37:5</p>
              <h2>Breath for the weary places</h2>
              <p>
                God is not intimidated by what looks dry or unfinished. His
                presence still brings life, direction, and a new beginning.
              </p>
              <div className="preview-progress">
                <span><i /></span>
                <small>Today’s reading</small>
              </div>
            </div>
          </article>
          <div className="floating-note floating-note--prayer">
            <HeartHandshake size={18} />
            <span><strong>3</strong> prayer points</span>
          </div>
          <div className="floating-note floating-note--streak">
            <BookOpenCheck size={18} />
            <span><strong>7 day</strong> reading streak</span>
          </div>
        </div>
      </section>

      <section className="daily-strip" id="rhythm">
        <div className="shell daily-strip__inner">
          <div className="daily-strip__intro">
            <p className="eyebrow eyebrow--light">A simple daily rhythm</p>
            <h2>Everything you need to pause, listen, and respond.</h2>
          </div>
          <div className="daily-checklist">
            {dailyElements.map((item) => (
              <div key={item}>
                <span><Check size={15} /></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features shell" id="features">
        <div className="section-heading">
          <p className="eyebrow">Grow at your pace</p>
          <h2>A faithful companion, not another noisy app.</h2>
          <p>
            Designed to help you build a sustainable rhythm of Scripture and
            prayer without pressure or distraction.
          </p>
        </div>
        <div className="feature-grid">
          <article>
            <span className="feature-icon"><BookHeart /></span>
            <h3>Daily devotionals</h3>
            <p>Original, Scripture-centred messages written for real adult life.</p>
          </article>
          <article>
            <span className="feature-icon"><CalendarDays /></span>
            <h3>Bible reading plan</h3>
            <p>Know what to read next and carry your progress across devices.</p>
          </article>
          <article>
            <span className="feature-icon"><HeartHandshake /></span>
            <h3>Guided prayer</h3>
            <p>Turn each day’s truth into specific, personal points of prayer.</p>
          </article>
          <article>
            <span className="feature-icon"><Download /></span>
            <h3>Monthly editions</h3>
            <p>Download a beautifully arranged Word edition for offline reading.</p>
          </article>
        </div>
      </section>

      <section className="closing-cta shell">
        <div>
          <p className="eyebrow eyebrow--light">Begin today</p>
          <h2>Make a little room for God’s Word.</h2>
        </div>
        <Link className="button button--cream" href="/register">
          Create your free account
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="site-footer shell">
        <BrandLogo />
        <p>© 2026 DevotionalHub. Original devotionals for a daily walk with God.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </main>
  );
}
