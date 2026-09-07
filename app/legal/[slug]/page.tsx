import { notFound } from 'next/navigation';
import { legal } from '../../../lib/legal-content';
import { DetailPage } from '../../detail-page';
export function generateStaticParams() { return legal.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = legal.find(p => p.slug === slug); return { title: page?.title, description: page?.intro }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const detail = legal.find(p => p.slug === slug); if (!detail) notFound(); return <DetailPage detail={detail} back="/legal" backLabel="Legal & trust" legal />; }
