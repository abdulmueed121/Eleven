import { ArrowUpRight } from 'lucide-react';
import type { Detail } from '../lib/site-content';
export function ContentCards({ items, base, label }: { items: Detail[]; base: string; label: string }) {
  return <section className="content-directory"><p className="eyebrow">{label}</p><div className="content-cards">{items.map((item, i) => <a key={item.slug} href={`${base}/${item.slug}`} className="content-card"><div className="card-number"><span>{String(i + 1).padStart(2, '0')}</span><ArrowUpRight size={24} /></div><h2>{item.title}</h2><p>{item.intro}</p><span className="text-link">Explore {base === '/products' ? 'product' : 'capability'}</span></a>)}</div></section>;
}
