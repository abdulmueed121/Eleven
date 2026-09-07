import { notFound } from 'next/navigation';
import { services } from '../../../lib/site-content';
import { DetailPage } from '../../detail-page';
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = services.find(p => p.slug === slug); return { title: page?.title, description: page?.intro }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const detail = services.find(p => p.slug === slug); if (!detail) notFound(); return <DetailPage detail={detail} back="/services" backLabel="All services" />; }
