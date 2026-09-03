'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  KeyboardEvent,
  PointerEvent,
  SyntheticEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';

const capabilities: [string, string[]][] = [
  [
    'Digital products',
    [
      'Web applications',
      'Mobile applications',
      'SaaS platforms',
      'Customer portals',
      'E-commerce',
      'Internal tools',
    ],
  ],
  [
    'Product & experience',
    [
      'Product strategy',
      'User experience',
      'Design systems',
      'User research',
      'Prototyping',
      'Brand experiences',
    ],
  ],
  [
    'Software engineering',
    [
      'Frontend systems',
      'Backend services',
      'Full-stack delivery',
      'APIs',
      'Payments',
      'Identity',
    ],
  ],
  [
    'Cloud & infrastructure',
    [
      'Cloud architecture',
      'CI / CD',
      'Containers',
      'Performance',
      'Observability',
      'DevOps',
    ],
  ],
  [
    'Platform & systems',
    [
      'API gateways',
      'Communications platforms',
      'VoIP / SIP',
      'Provisioning',
      'Automation',
      'Integrations',
    ],
  ],
  [
    'Data & AI',
    [
      'AI integrations',
      'LLM applications',
      'Data pipelines',
      'Analytics',
      'Search systems',
      'Reporting',
    ],
  ],
  [
    'Growth',
    [
      'Technical SEO',
      'Measurement',
      'Conversion',
      'Lifecycle',
      'Paid media',
      'Automation',
    ],
  ],
  [
    'Digital commerce',
    [
      'Shopify',
      'Custom commerce',
      'Payment integrations',
      'Subscriptions',
      'Checkout',
      'Operations',
    ],
  ],
  [
    'Security & reliability',
    [
      'Application security',
      'Access control',
      'Rate limiting',
      'Backups',
      'Reliability engineering',
      'Monitoring',
    ],
  ],
];
const nav = [
  ['Work', '/work'],
  ['Services', '/services'],
  ['Products', '/products'],
  ['About', '/about'],
  ['Insights', '/insights'],
];
const industries = [
  'SaaS',
  'Technology',
  'Telecommunications',
  'Professional Services',
  'FinTech',
  'E-commerce',
  'Marketplaces',
  'Startups',
  'B2B',
  'Consumer Products',
];
function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={'brand ' + (light ? 'light' : '')}
      href="/"
      aria-label="ELEVEN home"
    >
      <Image
        src="/eleven-wordmark.png"
        alt="ELEVEN"
        width={132}
        height={48}
        priority
      />
    </Link>
  );
}
function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);
  return (
    <header>
      <Logo />
      <nav className={open ? 'open' : ''} aria-label="Main navigation">
        <small>ELEVEN / INDEX</small>
        {nav.map(([n, h]) => (
          <Link
            href={h}
            className={path === h ? 'active' : ''}
            key={h}
            onClick={() => setOpen(false)}
          >
            {n}
          </Link>
        ))}
        <Link
          className="nav-cta"
          href="/contact"
          onClick={() => setOpen(false)}
        >
          Start a project <ArrowUpRight size={15} />
        </Link>
      </nav>
      <button
        className="menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-lead">
        <Logo light />
        <p>
          Product, engineering and operational depth for businesses with serious
          intent.
        </p>
      </div>
      <div className="footer-columns">
        <div>
          <small>Company</small>
          <Link href="/about">About</Link>
          <Link href="/work">Work</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <small>Capabilities</small>
          <Link href="/services">Product & experience</Link>
          <Link href="/services">Software engineering</Link>
          <Link href="/services">Cloud & infrastructure</Link>
          <Link href="/services">Growth</Link>
        </div>
        <div>
          <small>Technology</small>
          <Link href="/services">APIs & integrations</Link>
          <Link href="/services">Infrastructure</Link>
          <Link href="/services">Automation</Link>
          <Link href="/products">Communications</Link>
        </div>
        <div>
          <small>Product</small>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.elev1solutions.com/"
          >
            
            Eleven Solutions <ArrowUpRight size={13} />
          </a>
          <small className="spaced">Contact</small>
          <a href="mailto:hello@elev1.us">hello@elev1.us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© ELEVEN</span>
        <span>Built with ownership.</span>
      </div>
    </footer>
    
  );
}
function Title({
  n,
  label,
  children,
}: {
  n: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="title">
      <span>{n}</span>
      <div>
        <p className="eyebrow">{label}</p>
        {children}
      </div>
    </div>
  );
}
type DiagramNode = 'client' | 'api' | 'data';

type DiagramPoint = {
  x: number;
  y: number;
};

const initialDiagramPoints: Record<DiagramNode, DiagramPoint> = {
  client: { x: 19, y: 25 },
  api: { x: 49, y: 51 },
  data: { x: 83, y: 75 },
};

function Diagram() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState(initialDiagramPoints);

  const moveNode = (
    node: DiagramNode,
    clientX: number,
    clientY: number,
    target: HTMLElement,
  ) => {
    const board = boardRef.current;
    if (!board) return;

    const bounds = board.getBoundingClientRect();
    const halfWidth = target.offsetWidth / 2;
    const halfHeight = target.offsetHeight / 2;
    const x = Math.min(
      bounds.width - halfWidth,
      Math.max(halfWidth, clientX - bounds.left),
    );
    const y = Math.min(
      bounds.height - halfHeight,
      Math.max(halfHeight, clientY - bounds.top),
    );

    setPoints((current) => ({
      ...current,
      [node]: {
        x: (x / bounds.width) * 100,
        y: (y / bounds.height) * 100,
      },
    }));
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    node: DiagramNode,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    moveNode(node, event.clientX, event.clientY, event.currentTarget);
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLButtonElement>,
    node: DiagramNode,
  ) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    moveNode(node, event.clientX, event.clientY, event.currentTarget);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    node: DiagramNode,
  ) => {
    const change = 2;
    const direction = {
      ArrowLeft: [-change, 0],
      ArrowRight: [change, 0],
      ArrowUp: [0, -change],
      ArrowDown: [0, change],
    }[event.key];

    if (!direction) return;
    event.preventDefault();
    setPoints((current) => ({
      ...current,
      [node]: {
        x: Math.max(0, Math.min(100, current[node].x + direction[0])),
        y: Math.max(0, Math.min(100, current[node].y + direction[1])),
      },
    }));
  };

  const nodeStyle = (node: DiagramNode) => ({
    left: `${points[node].x}%`,
    top: `${points[node].y}%`,
  });

  return (
    <div
      className="diagram"
      aria-label="Interactive architecture diagram. Drag a system block to reposition it."
    >
      <div className="diagram-top">
        <span>ELEVEN / SYSTEM</span>
        <span>LIVE / 01</span>
      </div>
      <div className="diagram-board" ref={boardRef}>
        <svg className="diagram-lines" aria-hidden="true" preserveAspectRatio="none">
          <line
            x1={`${points.client.x}%`}
            y1={`${points.client.y}%`}
            x2={`${points.api.x}%`}
            y2={`${points.api.y}%`}
          />
          <line
            x1={`${points.api.x}%`}
            y1={`${points.api.y}%`}
            x2={`${points.data.x}%`}
            y2={`${points.data.y}%`}
          />
        </svg>
        <button
          className="node client"
          type="button"
          style={nodeStyle('client')}
          aria-label="Client, web and mobile. Drag to move. Use arrow keys to reposition."
          onPointerDown={(event) => handlePointerDown(event, 'client')}
          onPointerMove={(event) => handlePointerMove(event, 'client')}
          onKeyDown={(event) => handleKeyDown(event, 'client')}
        >
          CLIENT<small>WEB / MOBILE</small>
        </button>
        <button
          className="node api"
          type="button"
          style={nodeStyle('api')}
          aria-label="API gateway. Drag to move. Use arrow keys to reposition."
          onPointerDown={(event) => handlePointerDown(event, 'api')}
          onPointerMove={(event) => handlePointerMove(event, 'api')}
          onKeyDown={(event) => handleKeyDown(event, 'api')}
        >
          API<small>GATEWAY</small>
        </button>
        <button
          className="node data"
          type="button"
          style={nodeStyle('data')}
          aria-label="Data, identity and billing. Drag to move. Use arrow keys to reposition."
          onPointerDown={(event) => handlePointerDown(event, 'data')}
          onPointerMove={(event) => handlePointerMove(event, 'data')}
          onKeyDown={(event) => handleKeyDown(event, 'data')}
        >
          DATA<small>IDENTITY / BILLING</small>
        </button>
        <code>
          DEPLOYMENT STATUS
          <br />
          <br />
          build / verified
          <br />
          services / nominal
          <br />
          latency / normal
        </code>
      </div>
    </div>
  );
}
function ProductVisual() {
  return (
    <div className="product-visual">
      <div className="product-main">
        <div className="browser-bar">
          ● ● ● <span>eleven solutions / communications</span>
        </div>
        <Image
          fill
          sizes="(max-width:800px) 90vw, 52vw"
          src="/asset1.png"
          alt="Eleven Solutions communications platform"
        />
      </div>
      <div className="product-inset">
        <Image
          fill
          sizes="(max-width:800px) 45vw, 25vw"
          src="/asset1.png"
          alt="Eleven Solutions call interface"
        />
      </div>
      <small>01 / CLOUD CALLING · MESSAGING</small>
    </div>
  );
}
function CTA() {
  return (
    <section className="cta">
      <p className="eyebrow">Start a conversation</p>
      <h2>
        Have something <em>ambitious</em> in mind?
      </h2>
      <p>Tell us what you are building, rebuilding or trying to scale.</p>
      <Link className="button pale" href="/contact">
        Start a project <ArrowUpRight size={17} />
      </Link>
    </section>
  );
}
function CapabilityIndex() {
  const [active, setActive] = useState(-1);
  const id = useId();
  return (
    <div className="cap-index">
      {capabilities.map(([name, items], i) => {
        const expanded = active === i;
        return (
          <article className={expanded ? 'expanded' : ''} key={name}>
            <button
              aria-expanded={expanded}
              aria-controls={id + i}
              onClick={() => setActive(expanded ? -1 : i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <b>{name}</b>
              <em>
                {i === 2
                  ? 'SYSTEMS / SERVICES'
                  : i === 3
                    ? 'PIPELINE / RUNTIME'
                    : 'PRACTICE / DELIVERY'}
              </em>
              <ArrowUpRight aria-hidden="true" />
            </button>
            <div id={id + i} hidden={!expanded}>
              <i className="schematic" aria-hidden="true" />
              <ul>
                {items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
function WorkFeature() {
  return (
    <article className="work-feature">
      <div className="work-image">
        <Image
          src="/asset2.png"
          alt="Eleven Solutions messaging interface"
          fill
          sizes="(max-width:800px) 90vw, 63vw"
        />
      </div>
      <div>
        <p className="eyebrow">01 / Communications / SaaS / Infrastructure</p>
        <h3>
          ELEVEN <em>Solutions.</em>
        </h3>
        <p>
          A production communications platform shaped by the same disciplines we
          bring to client systems: product, engineering, cloud, billing and
          APIs.
        </p>
        <ul className="meta">
          <li>Product</li>
          <li>Engineering</li>
          <li>Cloud</li>
          <li>Billing</li>
          <li>APIs</li>
          <li>Communications infrastructure</li>
        </ul>
        <a
          className="text-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.elev1solutions.com/"
        >
          Explore product <ArrowUpRight size={17} />
        </a>
      </div>
    </article>
  );
}
function Architecture() {
  const layers = [
    ['Client applications', 'Web / Mobile / Product UI'],
    ['Application layer', 'Business logic / Services'],
    ['API & integration layer', 'REST / Webhooks / Gateways'],
    ['Data / identity / billing', 'Databases / Auth / Payments'],
    ['Infrastructure', 'Cloud / CI-CD / Runtime'],
    ['Operations', 'Monitoring / Reliability / Security'],
  ];
  return (
    <div className="architecture">
      {layers.map(([t, d], i) => (
        <div key={t}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <b>
            {t}
            <small>{d}</small>
          </b>
          {i < 5 && <i />}
        </div>
      ))}
    </div>
  );
}
export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">ELEVEN / TECHNOLOGY / INDEPENDENT</p>
            <h1>
              Systems for <em>ambitious</em> companies.
            </h1>
            <p className="lead">
              ELEVEN designs, engineers and operates digital products, platforms
              and infrastructure for businesses with serious intent.
            </p>
            <div className="actions">
              <Link className="button" href="/contact">
                Start a project <ArrowUpRight size={17} />
              </Link>
              <Link className="text-link" href="/work">
                Explore our work <ArrowDownRight size={17} />
              </Link>
            </div>
            <div className="years">
              <strong>5+</strong>
              <span>Years building and operating digital products.</span>
            </div>
          </div>
          <Diagram />
        </section>
        <section className="statement">
          <Title n="01" label="One connected practice">
            <h2>
              Product, engineering, infrastructure and growth.{' '}
              <em>Under one roof.</em>
            </h2>
          </Title>
          <p>
            Fragmented vendors make fragmented products. We work from the first
            question to the systems that keep the answer working.
          </p>
          <div className="lifecycle">
            {[
              'Discover',
              'Design',
              'Engineer',
              'Launch',
              'Operate',
              'Grow',
            ].map((x, i) => (
              <span key={x}>
                <b>0{i + 1}</b>
                {x}
              </span>
            ))}
          </div>
        </section>
        <section className="work">
          <Title n="02" label="Selected work">
            <h2>
              Built to be <em>operated.</em>
            </h2>
          </Title>
          <WorkFeature />
          <Link className="text-link centered" href="/work">
            View work <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="capabilities">
          <div>
            <p className="eyebrow">03 / Capabilities</p>
            <h2>
              One partner. <em>Entire stack.</em>
            </h2>
            <p>
              Connected expertise across product thinking, technical delivery
              and operational responsibility.
            </p>
          </div>
          <CapabilityIndex />
        </section>
        <section className="experience">
          <div>
            <p className="eyebrow">Experience</p>
            <h2>
              5+<small>YEARS IN TECHNOLOGY</small>
            </h2>
            <p>
              Built through years of solving real product, engineering and
              operational problems.
            </p>
          </div>
          <div className="experience-grid">
            {[
              'Web',
              'Mobile',
              'Infrastructure',
              'Communications',
              'Cloud',
              'Growth',
              'SaaS',
              'E-commerce',
              'Automation',
            ].map((x, i) => (
              <span key={x}>
                <b>0{i + 1}</b>
                {x}
              </span>
            ))}
          </div>
        </section>
        <section className="process">
          <div>
            <p className="eyebrow">How ELEVEN works</p>
            <h2>
              Deliberate from problem to <em>production.</em>
            </h2>
          </div>
          <div>
            {[
              [
                'Understand the business',
                'Commercial problem, users, constraints and existing technology.',
              ],
              [
                'Design the system',
                'Product experience and technical architecture are designed together.',
              ],
              [
                'Build deliberately',
                'Small production-ready releases rather than speculative builds.',
              ],
              [
                'Launch responsibly',
                'Testing, deployment, monitoring and operational readiness.',
              ],
              [
                'Measure and improve',
                'Performance and user behaviour shape the next release.',
              ],
            ].map(([t, c], i) => (
              <article key={t}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{c}</p>
                </div>
                <ArrowRight className="process-arrow" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>
        <section className="solutions">
          <div>
            <p className="eyebrow">ELEVEN Solutions</p>
            <h2>
              We build our own <em>technology, too.</em>
            </h2>
            <p>
              Eleven Solutions is a communications platform for cloud calling,
              VoIP, messaging, provisioning, billing and communication
              workflows. Operating it gives our client work real production
              context.
            </p>
            <a
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.elev1solutions.com/"
            >
              Explore Eleven Solutions <ArrowUpRight size={17} />
            </a>
          </div>
          <ProductVisual />
        </section>
        <section className="depth">
          <div>
            <p className="eyebrow">Engineering depth</p>
            <h2>
              Designed beyond the <em>interface.</em>
            </h2>
            <p>
              A polished interface is one layer of a successful product. ELEVEN
              works across application engineering, integrations, identity,
              billing, infrastructure and operations.
            </p>
          </div>
          <Architecture />
        </section>
        <section className="industries">
          <div>
            <p className="eyebrow">Industries</p>
            <h2>
              Experience across <em>complex digital businesses.</em>
            </h2>
          </div>
          <div>
            {industries.map((x, i) => (
              <span key={x}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                {x}
                <ArrowUpRight size={15} />
              </span>
            ))}
          </div>
        </section>
        <section className="insights">
          <Title n="10" label="Thinking in public">
            <h2>
              Notes from the <em>work.</em>
            </h2>
          </Title>
          <div>
            {[
              'Why systems become difficult to maintain',
              'What good API architecture actually looks like',
              'Designing infrastructure before scale',
              'Where growth meets product engineering',
            ].map((x, i) => (
              <Link href="/insights" key={x}>
                <small>
                  0{i + 1} /{' '}
                  {['Engineering', 'Product', 'Infrastructure', 'Growth'][i]}
                </small>
                <h3>{x}</h3>
                <ArrowUpRight size={19} />
              </Link>
            ))}
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
function PageHero({
  label,
  title,
  children,
}: {
  label: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="lead">{children}</p>
    </section>
  );
}
export function WorkPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          label="Work"
          title={
            <>
              Proof in <em>production.</em>
            </>
          }
        >
          We build and operate our own technology. That operational context
          changes the way we approach every digital product.
        </PageHero>
        <section className="page-section">
          <WorkFeature />
          <p className="note">
            We do not invent client case studies. Further work is shared where
            the right permission and context exist.
          </p>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
export function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          label="Capabilities"
          title={
            <>
              Capability without <em>fragmentation.</em>
            </>
          }
        >
          Product, experience, engineering, cloud and growth work as one
          continuous practice — not a chain of handoffs.
        </PageHero>
        <section className="services-page">
          <div>
            <p className="eyebrow">The index</p>
            <h2>Practical expertise, organised around the whole system.</h2>
          </div>
          <CapabilityIndex />
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
export function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          label="Products"
          title={
            <>
              We operate what we <em>build.</em>
            </>
          }
        >
          Owning product software brings firsthand experience of billing,
          infrastructure, availability, security and support.
        </PageHero>
        <section className="product-page">
          <WorkFeature />
          <Diagram />
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
export function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          label="About ELEVEN"
          title={
            <>
              Technology built with <em>ownership.</em>
            </>
          }
        >
          ELEVEN is a multidisciplinary technology practice for ambitious
          businesses that need product and technical depth in the same room.
        </PageHero>
        <section className="about-grid">
          {[
            [
              'Product with consequence',
              'Every design decision meets the realities of a running system.',
            ],
            [
              'Engineering with context',
              'Technical decisions begin with the commercial and user problem.',
            ],
            [
              'Operations from day one',
              'Reliability, observability and future ownership are part of the build.',
            ],
            [
              'Growth connected to product',
              'Measurement and distribution inform the product instead of trailing it.',
            ],
          ].map(([t, c], i) => (
            <article key={t}>
              <span>0{i + 1}</span>
              <h2>{t}</h2>
              <p>{c}</p>
            </article>
          ))}
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
export function InsightsPage() {
  const items = [
    'Why systems become difficult to maintain',
    'What good API architecture actually looks like',
    'Designing infrastructure before scale',
    'Where growth meets product engineering',
  ];
  return (
    <>
      <Header />
      <main>
        <PageHero
          label="Insights"
          title={
            <>
              Thinking in the <em>open.</em>
            </>
          }
        >
          Notes on product systems, engineering judgement and dependable digital
          businesses.
        </PageHero>
        <section className="insights-page">
          {items.map((x, i) => (
            <article key={x}>
              <small>
                0{i + 1} /{' '}
                {['Engineering', 'Product', 'Infrastructure', 'Growth'][i]}
              </small>
              <h2>{x}</h2>
              <div>
                <p>
                  Practical thinking from the work of designing, building and
                  operating software.
                </p>
                <Link className="text-link" href="/contact">
                  Discuss this with us <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
export function ContactPage() {
  const [sent, setSent] = useState(false);
  function submit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }
  return (
    <>
      <Header />
      <main>
        <PageHero
          label="Start a project"
          title={
            <>
              A considered brief is a good <em>start.</em>
            </>
          }
        >
          Tell us what is changing, what is not working, or what you need to put
          into the world.
        </PageHero>
        <section className="contact">
          {sent ? (
            <div className="confirmation">
              <p className="eyebrow">Your brief is ready</p>
              <h2>
                Thank you. <em>Let’s talk.</em>
              </h2>
              <p>
                This form currently has no submission service connected. Your
                answers remain in this browser; email{' '}
                <a href="mailto:hello@elev1.us">hello@elev1.us</a> to start the
                conversation.
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label>
                Name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                />
              </label>
              <label>
                Work email
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                />
              </label>
              <label>
                Company
                <input name="company" placeholder="Company name" />
              </label>
              <label>
                Website
                <input name="website" type="url" placeholder="https://" />
              </label>
              <fieldset>
                <legend>Services interested in</legend>
                <div className="checks">
                  {capabilities.map(([x]) => (
                    <label key={x}>
                      <input type="checkbox" value={x} />
                      {x}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Project stage</legend>
                <div className="checks">
                  {[
                    'Idea',
                    'Existing product',
                    'Rebuild',
                    'Scaling',
                    'Ongoing support',
                  ].map((x) => (
                    <label key={x}>
                      <input type="radio" name="stage" value={x} />
                      {x}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label>
                Timeline
                <input
                  name="timeline"
                  placeholder="When do you want to begin?"
                />
              </label>
              <label className="full">
                Project description
                <textarea
                  required
                  name="description"
                  rows={6}
                  placeholder="What are you looking to build?"
                />
              </label>
              <button className="button" type="submit">
                Prepare enquiry <ArrowUpRight size={17} />
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
