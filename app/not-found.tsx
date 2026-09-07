import Link from 'next/link';
import { Header, Footer } from './site';

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <p className="eyebrow">ELEVEN / 404</p>
          <h1>Page not found.</h1>
          <div className="lead">
            <p>The page you are looking for is unavailable.</p>
            <div className="actions">
              <Link className="button" href="/">
                Back to home
              </Link>
              <Link className="text-link" href="/contact">
                Contact ELEVEN
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
