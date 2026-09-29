import {
  ArrowRight,
  BookHeart,
  BookOpen,
  CalendarDays,
  Check,
  Download,
  Feather,
  HeartHandshake,
  LogIn,
  Music4,
  NotebookPen,
  Quote,
  ScrollText,
  Sunrise,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

const dailyElements = [
  "A focused Scripture reading",
  "A thoughtful devotional message",
  "A hymn to carry through the day",
  "Guided prayer points",
  "One practical action for the day",
];

const hymns = [
  {
    title: "Amazing Grace",
    author: "John Newton, 1779",
    lines: [
      "Amazing grace! how sweet the sound,",
      "That saved a wretch like me!",
      "I once was lost, but now am found,",
      "Was blind, but now I see.",
    ],
  },
  {
    title: "It Is Well with My Soul",
    author: "Horatio G. Spafford, 1873",
    lines: [
      "When peace like a river attendeth my way,",
      "When sorrows like sea billows roll;",
      "Whatever my lot, Thou hast taught me to say,",
      "It is well, it is well with my soul.",
    ],
  },
  {
    title: "Holy, Holy, Holy",
    author: "Reginald Heber, 1826",
    lines: [
      "Holy, holy, holy! Lord God Almighty!",
      "Early in the morning our song shall rise to Thee;",
      "Holy, holy, holy! merciful and mighty,",
      "God in three Persons, blessèd Trinity!",
    ],
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="site-header shell">
        <BrandLogo />
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#scripture">Scripture</a>
          <a href="#hymns">Hymns</a>
          <a href="#features">Features</a>
          <Link className="site-nav__signin" href="/login">
            <LogIn size={16} />
            Sign in
          </Link>
          <Link className="button button--primary button--small" href="/register">
            <UserPlus size={16} />
            Sign up
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
            Daily Scripture, thoughtful reflection, timeless hymns, and guided
            prayer—gathered into one quiet place for your walk with God.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/register">
              <UserPlus size={18} />
              Sign up free
            </Link>
            <Link className="button button--ghost" href="/login">
              <LogIn size={18} />
              Sign in
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
                <strong>29</strong>
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
            <Music4 size={18} />
            <span><strong>Hymn</strong> of the day</span>
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

      {/* Scripture */}
      <section className="scripture shell" id="scripture">
        <div className="scripture__intro">
          <p className="eyebrow">
            <Sunrise size={16} />
            The Word, first
          </p>
          <h2>A verse to steady the morning.</h2>
          <p className="scripture__lede">
            Each day opens with a passage of Scripture—read slowly, meant to be
            carried with you. Reflections and prayers grow from the text, never
            the other way around.
          </p>
          <Link className="button button--primary" href="/register">
            Read today’s passage
            <ArrowRight size={18} />
          </Link>
        </div>

        <figure className="verse-card">
          <Quote className="verse-card__mark" size={40} aria-hidden="true" />
          <blockquote>
            “Because of Yahweh’s loving kindnesses we are not consumed, because
            his compassion doesn’t fail. They are new every morning; great is
            your faithfulness.”
          </blockquote>
          <figcaption>Lamentations 3:22–23 · WEB</figcaption>
          <div className="verse-card__foot">
            <BookOpen size={16} />
            <span>Part of your daily Bible reading plan</span>
          </div>
        </figure>
      </section>

      {/* Hymns */}
      <section className="hymns" id="hymns">
        <div className="shell">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">
              <Music4 size={16} />
              Songs for the soul
            </p>
            <h2>Hymns to sing over your day.</h2>
            <p>
              Timeless, public-domain hymns paired with each devotional—words the
              church has treasured for generations, ready to read, pray, or sing.
            </p>
          </div>

          <div className="hymn-grid">
            {hymns.map((hymn) => (
              <article className="hymn-card" key={hymn.title}>
                <span className="hymn-card__icon" aria-hidden="true">
                  <Music4 size={20} />
                </span>
                <h3>{hymn.title}</h3>
                <p className="hymn-card__author">{hymn.author}</p>
                <p className="hymn-card__lines">
                  {hymn.lines.map((line, index) => (
                    <span key={index}>{line}</span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Devotional text */}
      <section className="reflection shell">
        <div className="reflection__panel">
          <p className="eyebrow eyebrow--light">
            <ScrollText size={16} />
            From today’s devotional
          </p>
          <h2>Breath for the weary places</h2>
          <div className="reflection__text">
            <p>
              There are seasons that feel like a valley of dry bones—plans that
              stalled, prayers that seem unanswered, a faith that has gone quiet.
              Ezekiel is asked to speak to exactly that kind of place, and God’s
              question still stands over our own: “Can these bones live?”
            </p>
            <p>
              The answer was never about the strength left in the bones. It was
              about the breath God was willing to give. What looks finished to you
              is not finished to Him. Bring the dry place into the light of His
              Word today, and ask the Author of life to breathe again.
            </p>
          </div>
          <div className="reflection__prayer">
            <HeartHandshake size={18} />
            <p>
              <strong>Pray:</strong> Lord, breathe new life where I have grown
              weary. Renew my hope and lead me one faithful step at a time.
            </p>
          </div>
        </div>
      </section>

      <section className="features shell" id="features">
        <div className="section-heading">
          <p className="eyebrow">Grow at your pace</p>
          <h2>A faithful companion, not another noisy app.</h2>
          <p>
            Designed to help you build a sustainable rhythm of Scripture, song,
            and prayer without pressure or distraction.
          </p>
        </div>
        <div className="feature-grid">
          <article>
            <span className="feature-icon"><BookHeart /></span>
            <h3>Daily devotionals</h3>
            <p>Original, Scripture-centred messages written for real adult life.</p>
          </article>
          <article>
            <span className="feature-icon"><Music4 /></span>
            <h3>Hymns &amp; songs</h3>
            <p>A treasured hymn each day to read, pray, or sing over your time.</p>
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
            <span className="feature-icon"><NotebookPen /></span>
            <h3>Reader progress</h3>
            <p>Bookmark readings, track streaks, and pick up right where you left.</p>
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
        <div className="closing-cta__actions">
          <Link className="button button--cream" href="/register">
            <UserPlus size={18} />
            Create your free account
          </Link>
          <Link className="button button--outline-light" href="/login">
            <LogIn size={18} />
            Sign in
          </Link>
        </div>
      </section>

      <footer className="site-footer shell">
        <BrandLogo />
        <p>© 2026 DevotionalHub. Original devotionals for a daily walk with God.</p>
        <div>
          <a href="#scripture">Scripture</a>
          <a href="#hymns">Hymns</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </main>
  );
}
