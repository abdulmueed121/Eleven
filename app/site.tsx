'use client';
import Image from 'next/image';
import { ProjectForm } from './project-form';
import { ContentCards } from './content-cards';
import { services, products, insights } from '../lib/site-content';
import { usePathname } from 'next/navigation';
import {
  KeyboardEvent,
  PointerEvent,
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
function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
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
    </a>
  );
}
export function Header() {
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
          <a
            href={h}
            className={path === h || path.startsWith(h + '/') ? 'active' : ''}
            aria-current={path === h ? 'page' : undefined}
            key={h}
            onClick={() => setOpen(false)}
          >
            {n}
          </a>
        ))}
        <a
          className="nav-cta"
          href="/contact"
          onClick={() => setOpen(false)}
        >
          Start a project <ArrowUpRight size={15} />
        </a>
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
export function Footer() {
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
          <a href="/about">About</a>
          <a href="/work">Work</a>
          <a href="/insights">Insights</a>
          <a href="/contact">Contact</a>
        </div>
        <div>
          <small>Capabilities</small>
          <a href="/services/product-experience">Product & experience</a>
          <a href="/services/software-engineering">Software engineering</a>
          <a href="/services/cloud-infrastructure">Cloud & infrastructure</a>
          <a href="/services/growth">Growth</a>
        </div>
        <div>
          <small>Technology</small>
          <a href="/services/apis-integrations">APIs & integrations</a>
          <a href="/services/infrastructure">Infrastructure</a>
          <a href="/services/automation">Automation</a>
          <a href="/services/communications">Communications</a>
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
          <a href="/products/billing-pos">Billing & POS</a><a href="/products/sms-gateway">SMS gateway API</a><a href="/products/kyc">KYC & identity matching</a><a href="/products/vid">VID</a><small className="spaced">Contact</small>
          <a href="mailto:hello@elev1.us">hello@elev1.us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© ELEVEN</span>
        <div className="footer-legal"><a href="/legal/privacy">Privacy</a><a href="/legal/terms">Terms</a><a href="/legal/cookies">Cookies</a><a href="/legal/acceptable-use">Acceptable use</a><a href="/legal/security">Security</a><a href="/legal">Legal & trust</a></div><span>Built with ownership.</span>
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
function ClusterNetwork() {
  return (
    <div className="cluster-network" aria-label="A connected automation cluster">
      <div className="cluster-sources" aria-label="Connected sources">
        <span>HubSpot</span>
        <span>LinkedIn</span>
        <span className="source-active">Apollo</span>
        <span>Crunchbase</span>
        <span>Clearbit</span>
      </div>
      <div className="cluster-flow cluster-flow-in" aria-hidden="true" />
      <div className="cluster-core">
        <i aria-hidden="true" />
        <span>Cluster</span>
      </div>
      <div className="cluster-flow cluster-flow-out" aria-hidden="true" />
      <div className="cluster-agents" aria-label="Automation agents">
        <span className="agent agent-research">Research agent</span>
        <span className="agent agent-review">Review agent</span>
        <span className="agent agent-outreach">Outreach agent</span>
      </div>
      <div className="cluster-results" aria-label="Cluster results">
        <div className="result-qualified">
          <b>Account qualified</b>
          <small>94% ICP fit · VP Sales found</small>
        </div>
        <div className="result-signal">
          <b>Signal detected</b>
          <small>Cursor is hiring GTM roles</small>
        </div>
        <div className="result-sequence">
          <b>Sequence drafted</b>
          <small>Intro message · Follow-up ready</small>
        </div>
      </div>
    </div>
  );
}
function BlockField() {
  return (
    <figure className="block-field">
      <Image
        src="/lifecycle-blocks-fixed.png"
        alt="An isometric field of connected system blocks with one active orange cube"
        fill
        sizes="(max-width: 850px) 100vw, 62vw"
      />
    </figure>
  );
}
function PhoneStage() {
  return (
    <section className="phone-stage">
      <div>
        <p className="eyebrow">Omnichannel experience</p>
        <h2>
          One conversation, <em>every channel.</em>
        </h2>
        <p>
          Make every customer interaction feel continuous, even when it moves
          between calls, messages and your product.
        </p>
      </div>
      <figure className="phone-art-placeholder">
        <Image
          src="/main%20asset.png"
          alt="Eleven Solutions mobile calling and messaging interfaces"
          fill
          sizes="(max-width: 850px) 100vw, 62vw"
        />
      </figure>
    </section>
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
          src="/asset01.png"
          alt="Eleven Solutions communications platform"
        />
      </div>
      <div className="product-inset">
        <Image
          fill
          sizes="(max-width:800px) 45vw, 25vw"
          src="/asset02.png"
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
      <a className="button pale" href="/contact">
        Start a project <ArrowUpRight size={17} />
      </a>
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
          alt="Eleven Solutions call interface"
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
              <a className="button" href="/contact">
                Start a project <ArrowUpRight size={17} />
              </a>
              <a className="text-link" href="/work">
                Explore our work <ArrowDownRight size={17} />
              </a>
            </div>
            <div className="years">
              <strong>5+</strong>
              <span>Years building and operating digital products.</span>
            </div>
          </div>
          <Diagram />
        </section>
        <section className="hero-signal">
          <div>
            <p className="eyebrow">Connected intelligence</p>
            <h2>
              Useful systems build <em>momentum.</em>
            </h2>
            <p>
              We connect the right people, signals and workflows so your team
              can act while the opportunity is still there.
            </p>
          </div>
          <ClusterNetwork />
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
          <a className="text-link centered" href="/work">
            View work <ArrowUpRight size={17} />
          </a>
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
                '/services/product-experience',
              ],
              [
                'Design the system',
                'Product experience and technical architecture are designed together.',
                '/services/product-experience',
              ],
              [
                'Build deliberately',
                'Small production-ready releases rather than speculative builds.',
                '/services/software-engineering',
              ],
              [
                'Launch responsibly',
                'Testing, deployment, monitoring and operational readiness.',
                '/services/cloud-infrastructure',
              ],
              [
                'Measure and improve',
                'Performance and user behaviour shape the next release.',
                '/services/growth',
              ],
            ].map(([t, c, href], i) => (
              <a className="process-step" href={href} key={t}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{c}</p>
                </div>
                <ArrowRight className="process-arrow" aria-hidden="true" />
              </a>
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
        <section className="lifecycle-blocks">
          <div>
            <p className="eyebrow">Systems in motion</p>
            <h2>
              Every part has a place in the <em>whole.</em>
            </h2>
            <p>
              A flexible system is built from deliberate, connected parts. We
              design the rules that make the pieces work together.
            </p>
          </div>
          <BlockField />
        </section>
        <PhoneStage />
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
        <ContentCards items={services} base="/services" label="Explore our practice" /><section className="services-page">
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
        <ContentCards items={products} base="/products" label="The product portfolio" /><section className="product-page">
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
          <article><span>Our approach</span><h2>One brief. Shared responsibility.</h2><p>We begin with the business problem, the people affected and the constraints around delivery. Product and engineering decisions are considered together, including the systems, data and operational changes needed to make an interface useful.</p></article>
          <article><span>How we work</span><h2>Make the important decisions visible.</h2><p>Discovery establishes scope, assumptions and success measures. Delivery turns those into reviewable increments, with acceptance criteria and a clear record of decisions. Launch planning includes migration, support and the handover needed to keep the product moving.</p></article>
          <article><span>Product perspective</span><h2>Ownership changes the questions.</h2><p>Our own product work spans communications, billing, messaging and identity matching. It brings questions about reconciliation, permissions, provider dependencies and support into the conversation early.</p><a className="text-link" href="/products">Explore our products ↗</a></article>
          <article><span>Working together</span><h2>A scope that fits the situation.</h2><p>An engagement may begin with discovery, a defined build, an integration or improvements to an existing system. Deliverables, responsibilities, commercial terms and ongoing support are agreed before work begins.</p><a className="text-link" href="/contact">Tell us about your project ↗</a></article>
        </section>
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
          {insights.map((x, i) => (
            <article key={x.slug}>
              <small>
                0{i + 1} /{' '}
                {['Engineering', 'Product', 'Infrastructure', 'Growth'][i]}
              </small>
              <h2><a href={`/insights/${x.slug}`}>{x.title}</a></h2>
              <div>
                <p>
                  {x.intro}
                </p>
                <a className="text-link" href={`/insights/${x.slug}`}>
                  Read insight <ArrowUpRight size={16} />
                </a>
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
  return <><Header /><main><PageHero label="Start a project" title={<>A considered brief is a good <em>start.</em></>}>Tell us about your business, the challenge and the outcome you need. We’ll use your brief to shape a focused first conversation.</PageHero><section className="contact"><ProjectForm /></section></main><Footer /></>;
}
