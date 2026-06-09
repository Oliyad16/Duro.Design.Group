// app.jsx — header, footer, router, loader, tweaks panel, mount

const { useEffect: useEffectA, useState: useStateA } = React;

// ───── Wordmark lockup ─────
function Wordmark({ wordSize, subSize, onClick }) {
  return (
    <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); if (onClick) onClick(e); }} className="logo">
      <span className="logo-word" style={wordSize ? { fontSize: wordSize } : null}>DURO</span>
      <span className="logo-sub" style={subSize ? { fontSize: subSize } : null}>Design Group</span>
    </a>
  );
}

function Header({ route }) {
  // Order per client comp: SERVICES · WORK · ABOUT · CONTACT
  const links = [
    { to: '/services', label: 'Services' },
    { to: '/work', label: 'Work' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="hdr">
      <div className="hdr-inner">
        <Wordmark />
        <nav className="nav">
          {links.map(l => (
            <a key={l.to} href={`#${l.to}`}
               onClick={(e) => { e.preventDefault(); navigate(l.to); }}
               className={`nav-link ${route === l.to ? 'active' : ''}`}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ───── Footer — three-up info strip + giant red wordmark (client comp) ─────
function Footer() {
  return (
    <footer className="ftr" data-screen-label="Global/Footer">
      <Shell>
        <Rule />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 32,
          padding: '48px 0',
        }} className="ftr-grid">
          {/* Left — contact */}
          <div className="body-m" style={{ lineHeight: 1.7 }}>
            <div><a href="mailto:info@durodesign.group" style={{ color: 'var(--duro-ink)' }}>info@durodesign.group</a></div>
            <div>202-491-4948</div>
          </div>

          {/* Center — giant red wordmark */}
          <div style={{ textAlign: 'center' }}>
            <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="logo" style={{ alignItems: 'center' }}>
              <span className="logo-word" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>DURO</span>
              <span className="logo-sub" style={{ fontSize: 'clamp(10px, 1.2vw, 14px)', letterSpacing: '0.5em' }}>Design Group</span>
            </a>
          </div>

          {/* Right — address */}
          <div className="body-m" style={{ lineHeight: 1.7, textAlign: 'right' }}>
            <div>5112 11TH ST NE</div>
            <div>Washington, DC</div>
          </div>
        </div>
        <Rule />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '24px 0 0' }}>
          <div className="smallcaps mute">© 2026 Duro Design Group</div>
          <div className="smallcaps mute">All Rights Reserved</div>
        </div>
      </Shell>
    </footer>
  );
}

// ───── Loading screen — black, tagline + red wordmark, auto-dismisses ─────
function Loader() {
  const [gone, setGone] = useStateA(false);
  const [removed, setRemoved] = useStateA(false);
  useEffectA(() => {
    // Show once per session so navigating back home doesn't re-trigger it.
    if (sessionStorage.getItem('duro-loaded')) { setRemoved(true); return; }
    const t1 = setTimeout(() => setGone(true), 1500);
    const t2 = setTimeout(() => { setRemoved(true); sessionStorage.setItem('duro-loaded', '1'); }, 2150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (removed) return null;
  return (
    <div className={`loader ${gone ? 'gone' : ''}`}>
      <div className="loader-tag">Shaping intentions into built reality.</div>
      <div className="loader-mark">
        <span className="loader-word">DURO</span>
        <span className="loader-sub">Design Group</span>
      </div>
    </div>
  );
}

// ──── Page transition wrapper ────
function PageFrame({ children, routeKey }) {
  return <div>{children}</div>;
}

// ──── App ────
function App() {
  const route = useRoute();
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  // Apply accent tweak. Canvas is black by default now (no night/warm classes).
  useEffectA(() => {
    document.documentElement.style.setProperty('--duro-red', t.accent || '#F4291C');
    document.body.classList.toggle('duro-before-after', !!t.beforeAfter);
    window.__tweaks = t;
    window.dispatchEvent(new CustomEvent('tweaks-changed', { detail: t }));
  }, [t.accent, t.beforeAfter]);

  // Enable scroll-reveal transitions only when the host browser has a running
  // animation timeline (some preview iframes pause it at t=0).
  useEffectA(() => {
    const t0 = document.timeline?.currentTime ?? 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t1 = document.timeline?.currentTime ?? 0;
        if (t1 > t0) document.documentElement.classList.add('fx-on');
      });
    });
  }, []);

  useEffectA(() => {
    const titles = {
      '/': 'DURO Design Group — Shaping intentions into built reality',
      '/about': 'About — DURO Design Group',
      '/services': 'Services — DURO Design Group',
      '/work': 'Work — DURO Design Group',
      '/contact': 'Contact — DURO Design Group',
    };
    document.title = titles[route] || 'DURO Design Group';
  }, [route]);

  let Page = HomePage;
  if (route === '/about') Page = AboutPage;
  else if (route === '/services') Page = ServicesPage;
  else if (route === '/work' || route === '/projects') Page = WorkPage;
  else if (route === '/contact') Page = ContactPage;

  return (
    <ProjectOverlayProvider>
      <Loader />
      <ProjectCursor />
      <Header route={route} />
      <PageFrame routeKey={route}>
        <Page />
      </PageFrame>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakColor
          label="DURO red"
          value={t.accent}
          options={['#F4291C', '#E63027', '#C2241B', '#FF3B30']}
          onChange={(v) => setTweak('accent', v)}
        />

        <TweakSection label="Showcase" />
        <TweakToggle
          label="Before/After slider"
          value={!!t.beforeAfter}
          onChange={(v) => setTweak('beforeAfter', v)}
        />

        <TweakSection label="Quick links" />
        <TweakButton label="Home" onClick={() => navigate('/')} />
        <TweakButton label="Services" onClick={() => navigate('/services')} />
        <TweakButton label="Work" onClick={() => navigate('/work')} />
        <TweakButton label="About" onClick={() => navigate('/about')} />
        <TweakButton label="Contact" onClick={() => navigate('/contact')} />
      </TweaksPanel>
    </ProjectOverlayProvider>
  );
}

// Mount
document.body.classList.remove('app-mounting');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
