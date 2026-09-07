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
              <a className="button" href="/">
                Back to home
              </a>
              <a className="text-link" href="/contact">
                Contact ELEVEN
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
