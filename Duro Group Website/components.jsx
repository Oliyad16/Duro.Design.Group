// components.jsx — shared building blocks for DURO
// Exposes to window: Eyebrow, Display, Rule, TextLink, StatBlock, PullQuote,
// DisciplineRow, ProjectCard, EditorialSplit, Section, Shell, Reveal, navigate

const { useEffect, useState, useRef } = React;

// ───────── Navigation helpers ─────────
function navigate(path) {
  if (path.startsWith('#')) path = path.slice(1);
  if (!path.startsWith('/')) path = '/' + path;
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || '/');
  useEffect(() => {
    const fn = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return route;
}

// ───────── Layout ─────────
function Shell({ children, className = '', style }) {
  return <div className={`shell ${className}`} style={style}>{children}</div>;
}

function Section({ children, className = '', sm = false, dark = false, style }) {
  return (
    <section className={`${sm ? 'section-sm' : 'section'} ${dark ? 'dark-block' : ''} ${className}`} style={style}>
      <Shell>{children}</Shell>
    </section>
  );
}

// ───────── Reveal on scroll ─────────
// Reveal — fade-in on scroll. Uses IntersectionObserver with a sync visibility
// check on mount so already-visible content shows immediately. Drives a class
// toggle (.reveal → .reveal.in) rather than CSS @keyframes so it survives
// paused-timeline environments.
function Reveal({ children, delay = 0, as: As = 'div', className = '', style }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const show = () => {
      if (cancelled) return;
      setShown(true);
    };

    // Sync check — if element already intersects viewport on mount, reveal now
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh && r.bottom > 0) {
      if (delay) setTimeout(show, delay); else show();
      return () => { cancelled = true; };
    }

    if (typeof IntersectionObserver === 'undefined') { show(); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          if (delay) setTimeout(show, delay); else show();
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); };
  }, [delay]);

  return (
    <As
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={style}
    >{children}</As>
  );
}

// ───────── Primitives ─────────
function Eyebrow({ children, red = false, style }) {
  return <div className={`eyebrow ${red ? 'eyebrow-red' : ''}`} style={style}>{children}</div>;
}

function Rule({ style }) { return <hr className="rule" style={style} />; }

function TextLink({ to, onClick, children, arrow = true, ghost = false, style }) {
  const handle = (e) => {
    if (to) { e.preventDefault(); navigate(to); }
    if (onClick) onClick(e);
  };
  return (
    <a href={to ? `#${to}` : '#'} onClick={handle} className={`tlink ${ghost ? 'tlink-ghost' : ''}`} style={style}>
      <span>{children}</span>
      {arrow && <span className="arrow">→</span>}
    </a>
  );
}

// ───────── Stat ─────────
function StatBlock({ num, caption }) {
  return (
    <div className="stat">
      <div className="stat-num">{num}</div>
      <div className="stat-cap">{caption}</div>
    </div>
  );
}

// ───────── Pull quote ─────────
function PullQuote({ children }) {
  return <blockquote className="pullquote">{children}</blockquote>;
}

// ───────── Discipline row ─────────
function DisciplineRow({ name, desc }) {
  return (
    <div className="disc-row">
      <div className="disc-name">{name}</div>
      <div className="disc-desc">{desc}</div>
    </div>
  );
}

// ───────── Project card ─────────
// One large image + caption block. Pure HTML; image-slot lets user drop a photo.
function ProjectCard({ id, title, year, types, location, sf, award, client, services, permits, status, ratio = '16/10', dark = false, alignRight = false }) {
  const { open } = useProjectOverlay();
  const imgs = (window.PROJECT_IMAGES && window.PROJECT_IMAGES[id]) || {};
  return (
    <div className="project" onClick={() => open(id)} data-cursor="view" data-cursor-label="View">
      <div className="project-frame" style={{ aspectRatio: ratio }}>
        <MediaWell
          id={`proj-${id}`}
          placeholder={`${title} — primary photo`}
          src={imgs.card || imgs.hero}
          dark={dark}
          ratio={ratio}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="project-meta" style={alignRight ? { textAlign: 'right', alignItems: 'flex-end' } : null}>
        {client && (
          <div className="smallcaps" style={{ color: 'var(--duro-red)', marginBottom: -2 }}>{client}</div>
        )}
        <div>
          <span className="project-title">{title}</span>
        </div>
        <div className="project-caption">
          {types} · {location}{sf ? ` · ${sf}` : ''}
        </div>
        {services && services.length > 0 && (
          <div className="project-caption">
            Services: {services.join(' · ')}
          </div>
        )}
        {permits && permits.length > 0 && (
          <div className="project-caption">
            Permits: {permits.join(' · ')}
          </div>
        )}
        {status && (
          <div className="project-caption" style={{ color: 'var(--duro-ink)' }}>
            {status}
          </div>
        )}
        {award && <div className="project-award">{award}</div>}
        <button
          className="tlink"
          onClick={(e) => { e.stopPropagation(); open(id); }}
          style={{ marginTop: 4, border: 0, background: 'transparent', padding: '4px 0' }}
        >
          <span>View project</span>
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

// Editorial split — headline + image
function EditorialSplit({ eyebrow, title, body, imgId, imgPlaceholder, reverse = false, ratio = '4/5', archival = false, children }) {
  return (
    <div className="grid" style={{ alignItems: 'start' }}>
      <div className="text-col" style={{
        gridColumn: reverse ? '7 / span 6' : '1 / span 6',
        order: reverse ? 2 : 1,
      }}>
        {eyebrow && <Eyebrow style={{ marginBottom: 28 }}>{eyebrow}</Eyebrow>}
        {title && <h2 className="display display-m" style={{ marginBottom: 32 }}>{title}</h2>}
        {body && <div className="body-l mute" style={{ maxWidth: '48ch' }}>{body}</div>}
        {children}
      </div>
      <div className="img-col" style={{
        gridColumn: reverse ? '1 / span 6' : '7 / span 6',
        order: reverse ? 1 : 2,
      }}>
        <PhotoWell id={imgId} placeholder={imgPlaceholder} dark={archival} ratio={ratio} />
      </div>
    </div>
  );
}

// Closing CTA — used on Home, About
function ClosingCTA({ headline, sub, body }) {
  return (
    <Section>
      <div className="grid">
        <div style={{ gridColumn: '1 / span 8' }}>
          <Eyebrow style={{ marginBottom: 32 }}>Get in touch</Eyebrow>
          <h2 className="display display-l" style={{ marginBottom: 40, maxWidth: '18ch' }}>
            {headline}
          </h2>
          <TextLink to="/contact">Start a conversation</TextLink>
          {body && <div className="body-m mute" style={{ marginTop: 56, maxWidth: '32ch' }}>{body}</div>}
        </div>
      </div>
    </Section>
  );
}

// Sticky scroll progress (subtle, for the long pages)
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{
      position: 'fixed',
      left: 0, right: 0, top: 0,
      height: 2, zIndex: 60,
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${p * 100}%`,
        background: 'var(--duro-red)',
        transition: 'width 80ms linear'
      }} />
    </div>
  );
}

// PhotoWell — wraps image-slot with a fallback caption visible in static captures.
// User-facing drop placeholder still comes from image-slot itself.
function PhotoWell({ id, placeholder, src, fit, dark = false, ratio, style, className = '' }) {
  return (
    <div
      className={`photo-well ${dark ? 'dark' : ''} ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      <div className="photo-hint">{placeholder}</div>
      <image-slot
        id={id}
        placeholder={placeholder}
        src={src}
        fit={fit}
        class={dark ? 'dark' : ''}
      ></image-slot>
    </div>
  );
}

// MediaWell — supports both image (poster) and video. video-slot sits on top
// of image-slot; if a video is set, it plays over the image. Drops on the
// wrapper route to the correct slot by file type.
function MediaWell({ id, placeholder, src, videoSrc, poster, dark = false, ratio, style, className = '' }) {
  return (
    <div
      className={`photo-well media-well ${dark ? 'dark' : ''} ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      <div className="photo-hint">{placeholder}</div>
      <image-slot
        id={`img-${id}`}
        placeholder={placeholder}
        src={src}
        class={dark ? 'dark' : ''}
      ></image-slot>
      <video-slot
        id={`vid-${id}`}
        src={videoSrc}
        poster={poster || src}
        placeholder={`Drop video or paste URL — ${placeholder}`}
      ></video-slot>
    </div>
  );
}

Object.assign(window, { PhotoWell, MediaWell });

Object.assign(window, {
  navigate, useRoute,
  Shell, Section, Reveal,
  Eyebrow, Rule, TextLink,
  StatBlock, PullQuote, DisciplineRow,
  ProjectCard, EditorialSplit, ClosingCTA,
  ScrollProgress, PhotoWell,
});
