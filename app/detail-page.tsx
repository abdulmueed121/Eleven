import { ArrowUpRight } from 'lucide-react';
import { Header, Footer } from './site';
import type { Detail } from '../lib/site-content';

export function DetailPage({ detail, back, backLabel, legal = false }: { detail: Detail; back: string; backLabel: string; legal?: boolean }) {
  return <><Header /><main>
    <section className="detail-hero">
      <a className="text-link" href={back}>← {backLabel}</a>
      <p className="eyebrow">{detail.category}</p>
      <h1>{detail.title}<span>.</span></h1>
      <p className="lead">{detail.intro}</p>
    </section>
    <div className="detail-layout">
      <aside className="detail-index" aria-label="On this page"><p className="eyebrow">On this page</p>{detail.sections.map((s, i) => <a key={s.title} href={`#section-${i + 1}`}><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</a>)}</aside>
      <div className="detail-copy">{detail.sections.map((s, i) => <section id={`section-${i + 1}`} key={s.title}><p className="eyebrow">{String(i + 1).padStart(2, '0')}</p><h2>{s.title}</h2><p>{s.body}</p>{s.points && <ul>{s.points.map(p => <li key={p}>{p}</li>)}</ul>}</section>)}</div>
    </div>
    {!legal && <section className="detail-cta"><div><p className="eyebrow">Your next move</p><h2>Let’s put it to work.</h2></div><a className="button" href={`/contact?interest=${encodeURIComponent(detail.title)}`}>Discuss your project <ArrowUpRight size={18} /></a></section>}
  </main><Footer /></>;
}

