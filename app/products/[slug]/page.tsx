import { notFound } from 'next/navigation';
import { products } from '../../../lib/site-content';
import { DetailPage } from '../../detail-page';
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = products.find(p => p.slug === slug); return { title: page?.title, description: page?.intro }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const detail = products.find(p => p.slug === slug); if (!detail) notFound(); return <DetailPage detail={detail} back="/products" backLabel="All products" />; }
