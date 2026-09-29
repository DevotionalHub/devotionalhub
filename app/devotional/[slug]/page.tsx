import { ArrowLeft, BookOpen, Check, HeartHandshake, Lightbulb, Music4, Quote, Sparkles } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { demoDevotional } from "@/lib/demo-content";

export default async function DevotionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const devotional = slug === demoDevotional.slug ? demoDevotional : demoDevotional;

  return (
    <main className="devotional-page">
      <header className="reader-header shell">
        <BrandLogo />
        <nav><Link href="/today">Today</Link><Link className="reader-nav-active" href={`/devotional/${devotional.slug}`}>Devotional</Link><Link href="/reading-plan">Reading plan</Link></nav>
        <Link className="button button--primary button--small" href="/login">Sign in</Link>
      </header>
      <div className="devotional-layout shell">
        <article className="devotional-article">
          <Link className="back-link" href="/"><ArrowLeft size={16} /> Back to home</Link>
          <p className="eyebrow"><Sparkles size={15} /> {devotional.theme} · {devotional.date} · 5 min read</p>
          <h1>{devotional.title}</h1>
          <p className="devotional-lede">{devotional.summary}</p>
          <section className="scripture-feature"><Quote size={28} /><p>{devotional.scripture.text}</p><strong>{devotional.scripture.reference}</strong></section>
          <div className="article-copy">{devotional.message.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <section className="takeaways"><h2><Lightbulb size={21} /> Key takeaways</h2><ul>{devotional.takeaways.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section>
          <section className="reflection-card"><p className="eyebrow">Pause and reflect</p><h2>{devotional.reflection}</h2><p><strong>Today&apos;s action:</strong> {devotional.action}</p></section>
          <section className="prayer-section"><div className="section-heading"><p className="eyebrow"><HeartHandshake size={16} /> Pray with today&apos;s message</p><h2>Bring it honestly to God.</h2></div><div className="prayer-list">{devotional.prayers.map((prayer, index) => <label className="prayer-item" key={prayer}><input type="checkbox" /><span>{index + 1}</span><b>{prayer}</b></label>)}</div></section>
          <section className="hymn-feature"><Music4 size={22} /><div><p className="eyebrow">Hymn for today</p><h2>{devotional.hymn.title}</h2><p>{devotional.hymn.author}</p><blockquote>{devotional.hymn.lines.map((line) => <span key={line}>{line}</span>)}</blockquote></div></section>
        </article>
        <aside className="devotional-aside"><div className="aside-card"><BookOpen size={20} /><h3>Recommended verses</h3>{devotional.recommended.map((verse) => <div className="recommended-verse" key={verse.reference}><strong>{verse.reference}</strong><p>{verse.text}</p></div>)}</div><div className="aside-card aside-card--dark"><p className="eyebrow eyebrow--light">Keep going</p><h3>Build a daily rhythm.</h3><p>Sign in to save this devotional, track your reading, and continue your plan tomorrow.</p><Link className="button button--cream" href="/register">Create free account</Link></div></aside>
      </div>
    </main>
  );
}
