import { BookOpen, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

const readings = [
  ["29 Sep", "Ezekiel 37:1–14", "The valley of dry bones"],
  ["30 Sep", "Isaiah 40:27–31", "Strength for the waiting"],
  ["1 Oct", "Lamentations 3:19–26", "New every morning"],
  ["2 Oct", "2 Corinthians 4:16–18", "Renewed day by day"],
  ["3 Oct", "Psalm 46:1–11", "A very present help"],
];

export default function ReadingPlanPage() {
  return <main className="reader-page"><header className="reader-header shell"><BrandLogo /><nav><Link href="/today">Today</Link><Link href="/devotional/breath-for-weary-places">Devotional</Link><Link className="reader-nav-active" href="/reading-plan">Reading plan</Link></nav><Link className="button button--primary button--small" href="/login">Sign in</Link></header><section className="plan-hero shell"><p className="eyebrow"><BookOpen size={16} /> Bible reading plan</p><h1>Rooted in the Word.</h1><p>Five days of Scripture to accompany this week&apos;s devotional rhythm.</p></section><section className="plan-list shell">{readings.map(([date, reference, title], index) => <article className={`plan-day ${index === 0 ? "plan-day--active" : ""}`} key={date}><span className="plan-day__date">{date}</span><div><h2>{title}</h2><p>{reference}</p></div>{index === 0 ? <span className="plan-current"><Check size={15} /> Today</span> : <ChevronRight size={19} />}</article>)}</section></main>;
}
