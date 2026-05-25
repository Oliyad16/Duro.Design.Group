// app.jsx — header, footer, router, tweaks panel, mount

const { useEffect: useEffectA, useState: useStateA } = React;

function Header({ route }) {
  const [scrolled, setScrolled] = useStateA(false);
  useEffectA(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
      <div className="hdr-inner">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="logo">
            <span className="logo-dot"></span>
            <span>DURO</span>
          </a>
          <span className="logo-sub">Design Group</span>
        </div>
        <nav className="nav">
          {links.slice(1, 4).map(l => (
            <a key={l.to} href={`#${l.to}`}
               onClick={(e) => { e.preventDefault(); navigate(l.to); }}
               className={`nav-link ${route === l.to ? 'active' : ''}`}>
              {l.label}
            </a>
          ))}
          <a href="#/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
             className="nav-cta">Get in touch</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="ftr" data-screen-label="Global/Footer">
      <Shell>
        <div className="grid" style={{ rowGap: 64 }}>
          {/* Column 1 — wordmark */}
          <div style={{ gridColumn: '1 / span 4' }}>
            <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="logo" style={{ fontSize: 28 }}>
              <span className="logo-dot" style={{ width: 10, height: 10 }}></span>
              <span>DURO</span>
            </a>
            <div className="smallcaps mute" style={{ marginTop: 16 }}>
              Architecture · Engineering · Preservation
            </div>
          </div>

          {/* Column 2 — sitemap */}
          <div style={{ gridColumn: '6 / span 3' }}>
            <Eyebrow style={{ marginBottom: 24 }}>Sitemap</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['/', '/about', '/services', '/projects', '/contact'].map(t => (
                <a key={t} href={`#${t}`} onClick={e => { e.preventDefault(); navigate(t); }}
                   style={{ fontSize: 16, color: 'var(--duro-ink)' }}
                   className="footer-link">
                  {t === '/' ? 'Home' : t.replace('/', '').replace(/^./, c => c.toUpperCase())}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 — contact */}
          <div style={{ gridColumn: '10 / span 3' }}>
            <Eyebrow style={{ marginBottom: 24 }}>Studio</Eyebrow>
            <div className="body-m" style={{ lineHeight: 1.8 }}>
              <div>5112 11th Street NE</div>
              <div>Washington, DC 20011</div>
              <div style={{ marginTop: 12 }}>(202) 491-4948</div>
              <div>hello@durodesigngroup.com</div>
            </div>
          </div>
        </div>

        {/* Credentials strip */}
        <div style={{ marginTop: 88, paddingTop: 32, borderTop: '1px solid var(--duro-rule)', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32 }}>
          <div style={{ gridColumn: '1 / span 7' }}>
            <Eyebrow style={{ marginBottom: 12 }}>Registrations & Codes</Eyebrow>
            <div className="smallcaps mute" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
              <span>SAM.gov</span>
              <span>·</span>
              <span>AIA|DC</span>
              <span>·</span>
              <span>NCARB</span>
              <span>·</span>
              <span>LEED AP</span>
              <span>·</span>
              <span>DSLBD CBE <span style={{ textTransform: 'none', letterSpacing: 0, fontStyle: 'italic' }}>(verifying)</span></span>
              <span>·</span>
              <span>NAICS 541310 · 541330 · 541320 · 541350 · 541410</span>
            </div>
          </div>
          <div style={{ gridColumn: '9 / span 4', textAlign: 'right' }}>
            <Eyebrow style={{ marginBottom: 12 }}>Procurement</Eyebrow>
            <a href="#/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="tlink">
              <span>Request SF-330 portfolio</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--duro-rule)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
          <div className="smallcaps mute">© 2026 DURO Design Group, LLC — Washington, DC</div>
          <div className="smallcaps mute">UEI & CAGE Code available on request</div>
        </div>
      </Shell>
    </footer>
  );
}

// ──── Page transition wrapper (animation disabled — iframe timeline paused) ────
function PageFrame({ children, routeKey }) {
  return <div>{children}</div>;
}

// ──── App ────
function App() {
  const route = useRoute();
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  // Apply theme tweaks
  useEffectA(() => {
    document.documentElement.style.setProperty('--duro-red', t.accent || '#E63027');
    document.body.classList.toggle('duro-warm-paper', t.paperTone === 'warm-paper');
    document.body.classList.toggle('duro-before-after', !!t.beforeAfter);
    // Notify dynamic subscribers (FeaturedProject, etc.)
    window.__tweaks = t;
    window.dispatchEvent(new CustomEvent('tweaks-changed', { detail: t }));
  }, [t.accent, t.paperTone, t.beforeAfter]);

  // Enable scroll-reveal transitions ONLY if the host browser has a running
  // animation timeline. Some preview iframes pause the timeline at t=0, which
  // would leave opacity-0 content invisible forever; for those, content just
  // appears instantly (the fx-on class never gets added).
  useEffectA(() => {
    const t0 = document.timeline?.currentTime ?? 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t1 = document.timeline?.currentTime ?? 0;
        if (t1 > t0) {
          document.documentElement.classList.add('fx-on');
        }
      });
    });
  }, []);

  // Update document title
  useEffectA(() => {
    const titles = {
      '/': 'DURO Design Group — Architecture · Engineering · Preservation',
      '/about': 'About — DURO Design Group',
      '/services': 'Services — DURO Design Group',
      '/projects': 'Projects — DURO Design Group',
      '/contact': 'Contact — DURO Design Group',
    };
    document.title = titles[route] || 'DURO Design Group';
  }, [route]);

  let Page = HomePage;
  if (route === '/about') Page = AboutPage;
  else if (route === '/services') Page = ServicesPage;
  else if (route === '/projects') Page = ProjectsPage;
  else if (route === '/contact') Page = ContactPage;

  return (
    <ProjectOverlayProvider>
      <ScrollProgress />
      <ProjectCursor />
      <Header route={route} />
      <PageFrame routeKey={route}>
        <Page />
      </PageFrame>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakColor
          label="DURO accent"
          value={t.accent}
          options={['#E63027', '#C2241B', '#1B3A4B', '#171717']}
          onChange={(v) => setTweak('accent', v)}
        />

        <TweakSection label="Paper" />
        <TweakRadio
          label="Background"
          value={t.paperTone}
          options={['off-white', 'warm-paper']}
          onChange={(v) => setTweak('paperTone', v)}
        />

        <TweakSection label="Showcase" />
        <TweakToggle
          label="Before/After slider"
          value={!!t.beforeAfter}
          onChange={(v) => setTweak('beforeAfter', v)}
        />

        <TweakSection label="Quick links" />
        <TweakButton label="Home" onClick={() => navigate('/')} />
        <TweakButton label="About" onClick={() => navigate('/about')} />
        <TweakButton label="Services" onClick={() => navigate('/services')} />
        <TweakButton label="Projects" onClick={() => navigate('/projects')} />
        <TweakButton label="Contact" onClick={() => navigate('/contact')} />
      </TweaksPanel>
    </ProjectOverlayProvider>
  );
}

// Mount
document.body.classList.remove('app-mounting');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
