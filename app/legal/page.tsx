import { Header, Footer } from '../site';
import { legal } from '../../lib/legal-content';
export const metadata = { title: 'Legal & trust', description: 'Privacy, website terms, acceptable use and security information for ELEVEN.' };
export default function Page() { return <><Header /><main><section className="detail-hero"><p className="eyebrow">ELEVEN / Legal & trust</p><h1>Clear expectations<span>.</span></h1><p className="lead">How we handle enquiries, the terms of using this website and where to raise a concern.</p></section><section className="content-directory"><div className="content-cards">{legal.map(p => <a className="content-card" key={p.slug} href={`/legal/${p.slug}`}><h2>{p.title} ↗</h2><p>{p.intro}</p></a>)}</div></section></main><Footer /></>; }
