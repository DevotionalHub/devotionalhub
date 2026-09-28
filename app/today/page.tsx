import {
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  LogOut,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Today" };

function lagosDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login?next=/today");
  }

  const today = lagosDate();
  const [{ data: profile }, { data: devotional }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", authData.user.id)
      .maybeSingle(),
    supabase
      .from("devotionals")
      .select("id, title, summary, devotional_date, author_name")
      .eq("devotional_date", today)
      .maybeSingle(),
  ]);

  const displayDate = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const firstName = profile?.display_name?.split(" ")[0] || "friend";

  return (
    <main className="reader-page">
      <header className="reader-header shell">
        <BrandLogo />
        <nav>
          <Link className="reader-nav-active" href="/today">Today</Link>
          <span>Reading plan</span>
          <span>Bookmarks</span>
        </nav>
        <form action="/auth/signout" method="post">
          <button className="reader-signout" type="submit">
            <LogOut size={17} />
            Sign out
          </button>
        </form>
      </header>

      <section className="reader-welcome shell">
        <div>
          <p className="eyebrow">{displayDate}</p>
          <h1>Good morning, {firstName}.</h1>
          <p>Take a breath. Your quiet place is ready.</p>
        </div>
        <span className="reader-streak"><Sparkles size={16} /> Day 1</span>
      </section>

      <section className="reader-grid shell">
        <article className="today-card">
          <div className="today-card__art" aria-hidden="true">
            <span>Today’s devotional</span>
            <div className="today-art__sun" />
            <div className="today-art__line today-art__line--one" />
            <div className="today-art__line today-art__line--two" />
          </div>
          <div className="today-card__content">
            <p className="eyebrow">5 minute read</p>
            <h2>{devotional?.title ?? "Today’s message is being prepared"}</h2>
            <p>
              {devotional?.summary ??
                "The DevotionalHub editorial team is preparing a thoughtful, Scripture-centred message for this day."}
            </p>
            {devotional ? (
              <Link className="button button--primary" href={`/devotional/${today}`}>
                Begin today’s reading <ChevronRight size={18} />
              </Link>
            ) : (
              <span className="reader-empty-note">
                <CircleCheck size={17} /> Your account is connected successfully.
              </span>
            )}
          </div>
        </article>

        <aside className="reader-sidebar">
          <article className="reader-mini-card">
            <span className="feature-icon"><BookOpenCheck /></span>
            <div>
              <p className="eyebrow">Bible plan</p>
              <h3>Your reading journey</h3>
              <p>The 2026 plan will appear here once its readings are published.</p>
            </div>
          </article>
          <article className="reader-mini-card">
            <span className="feature-icon"><CalendarDays /></span>
            <div>
              <p className="eyebrow">This month</p>
              <h3>0 days completed</h3>
              <p>Your progress begins with your first devotional.</p>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
