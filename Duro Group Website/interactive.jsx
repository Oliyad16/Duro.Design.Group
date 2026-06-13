// interactive.jsx — overlay, cursor, before/after slider
// Exposes: ProjectOverlay, ProjectCursor, useProjectOverlay, BeforeAfter

const { useState: useStateI, useEffect: useEffectI, useRef: useRefI, useCallback: useCallbackI } = React;

// ─── Project detail overlay ──────────────────────────────────────────
// Single global overlay that any project tile can open. Keyboard nav (←/→/Esc).
const ProjectOverlayContext = React.createContext({ open: () => {}, close: () => {} });

function ProjectOverlayProvider({ children }) {
  const [idx, setIdx] = useStateI(-1);
  const total = PROJECTS.length;
  const open = useCallbackI((i) => setIdx(typeof i === 'string' ? PROJECTS.findIndex(p => p.id === i) : i), []);
  const close = useCallbackI(() => setIdx(-1), []);
  const prev = useCallbackI(() => setIdx(i => Math.max(0, i - 1)), []);
  const next = useCallbackI(() => setIdx(i => Math.min(total - 1, i + 1)), [total]);

  useEffectI(() => {
    if (idx < 0) {
      document.body.classList.remove('no-scroll');
      return;
    }
    document.body.classList.add('no-scroll');
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, close, prev, next]);

  return (
    <ProjectOverlayContext.Provider value={{ open, close }}>
      {children}
      <ProjectOverlay idx={idx} onClose={close} onPrev={prev} onNext={next} />
    </ProjectOverlayContext.Provider>
  );
}

function useProjectOverlay() { return React.useContext(ProjectOverlayContext); }

function ProjectOverlay({ idx, onClose, onPrev, onNext }) {
  const open = idx >= 0;
  const p = open ? PROJECTS[idx] : null;
  const total = PROJECTS.length;

  // Reset scroll on project change
  const ref = useRefI(null);
  useEffectI(() => {
    if (open && ref.current) ref.current.scrollTop = 0;
  }, [idx, open]);

  return (
    <div ref={ref} className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="overlay-inner">
        {/* Top bar */}
        <div className="overlay-bar">
          <button className="overlay-close" onClick={onClose} aria-label="Close project">
            <span className="x">×</span>
            <span>Close</span>
          </button>
          <div className="overlay-nav">
            <span className="overlay-count">
              {open ? String(idx + 1).padStart(2, '0') : '00'}
              <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
              {String(total).padStart(2, '0')}
            </span>
            <button onClick={onPrev} disabled={!open || idx === 0}>← Prev</button>
            <button onClick={onNext} disabled={!open || idx === total - 1}>Next →</button>
          </div>
        </div>

        {open && p && (
          <>
            {/* Hero */}
            <div className="grid" style={{ marginBottom: 80 }}>
              <div style={{ gridColumn: '1 / span 12' }}>
                <MediaWell
                  id={`ov-${p.id}`}
                  placeholder={`${p.title} — primary photo or video`}
                  src={(window.PROJECT_IMAGES && window.PROJECT_IMAGES[p.id])?.hero}
                  videoSrc={(window.PROJECT_VIDEOS && window.PROJECT_VIDEOS[p.id])?.hero}
                  ratio="21/9"
                />
              </div>
            </div>

            {/* Title + facts */}
            <div className="grid" style={{ marginBottom: 80, alignItems: 'start' }}>
              <div style={{ gridColumn: '1 / span 7' }}>
                {p.award && (
                  <div className="eyebrow eyebrow-red" style={{ marginBottom: 24 }}>{p.award}</div>
                )}
                <h2 className="display display-l" style={{ marginBottom: 32 }}>
                  {p.title}
                </h2>
                <p className="body-l" style={{ maxWidth: '38ch', marginBottom: 32 }}>{p.dek}</p>
              </div>
              <div style={{ gridColumn: '9 / span 4' }}>
                <Rule />
                <FactRow label="Client" value={p.client} />
                <FactRow label="Location" value={p.location} />
                <FactRow label="Completed" value={p.year} />
                <FactRow label="Size" value={p.sf} />
                <FactRow label="Cost" value={p.cost} />
                <FactRow label="Services" value={p.types} />
              </div>
            </div>

            {/* Body */}
            <div className="grid" style={{ marginBottom: 96 }}>
              <div style={{ gridColumn: '2 / span 6' }}>
                <div className="eyebrow" style={{ marginBottom: 32 }}>Project Description</div>
                <p className="body-l" style={{ marginBottom: 32 }}>{p.blurb}</p>
              </div>
            </div>

            {/* Secondary media — every picture this project has.
               Pull all registered image slots (detail, context, card,
               archival, …), drop the hero (already shown up top) and any
               duplicate src, then lay them out two-per-row. Projects with
               more photos automatically get more rows; nothing is hard-coded
               to two, so adding files to PROJECT_IMAGES shows up here. */}
            {(() => {
              const imgs = (window.PROJECT_IMAGES && window.PROJECT_IMAGES[p.id]) || {};
              const heroSrc = imgs.hero;
              // Preserve a sensible reading order, then append any other slots
              // we don't know about by name so nothing is ever silently hidden.
              const ordered = ['detail', 'context', 'card', 'archival'];
              const slots = [
                ...ordered.filter((k) => imgs[k]),
                ...Object.keys(imgs).filter((k) => k !== 'hero' && !ordered.includes(k)),
              ];
              const gallery = slots
                .map((slot) => ({ slot, src: imgs[slot] }))
                .filter((x) => x.src && x.src !== heroSrc)
                .filter((x, i, a) => a.findIndex((y) => y.src === x.src) === i);

              if (gallery.length === 0) return null;

              return (
                <div className="grid" style={{ marginBottom: 64, rowGap: 'clamp(20px, 3vw, 40px)' }}>
                  {gallery.map(({ slot, src }, i) => (
                    <div
                      key={slot}
                      style={{ gridColumn: i % 2 === 0 ? '1 / span 7' : '8 / span 5' }}
                    >
                      <PhotoWell
                        id={`ov-${slot}-${p.id}`}
                        placeholder={`${p.title} — ${slot}`}
                        src={src}
                        ratio="4/5"
                      />
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Bottom nav */}
            <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid var(--duro-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="tlink"
                onClick={onPrev}
                disabled={idx === 0}
                style={{ visibility: idx === 0 ? 'hidden' : 'visible', appearance: 'none', border: 0, background: 'transparent' }}
              >
                <span>← {idx > 0 ? PROJECTS[idx - 1].title : ''}</span>
              </button>
              <span className="overlay-count">
                Project {String(idx + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}
              </span>
              <button
                className="tlink"
                onClick={onNext}
                disabled={idx === total - 1}
                style={{ visibility: idx === total - 1 ? 'hidden' : 'visible', appearance: 'none', border: 0, background: 'transparent' }}
              >
                <span>{idx < total - 1 ? PROJECTS[idx + 1].title : ''} →</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FactRow({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', padding: '16px 0', borderBottom: '1px solid var(--duro-rule)' }}>
      <div className="smallcaps mute">{label}</div>
      <div className="body-s" style={{ color: 'var(--duro-ink)' }}>{value}</div>
    </div>
  );
}

// ProjectOpenButton — visible CTA next to a project on the index page.
// Lives in interactive.jsx so it has access to the overlay context.
function ProjectOpenButton({ id }) {
  const { open } = useProjectOverlay();
  return (
    <button
      className="tlink"
      onClick={() => open(id)}
      style={{ border: 0, background: 'transparent', padding: '4px 0' }}
      data-cursor="view"
      data-cursor-label="View case"
    >
      <span>View full case</span>
      <span className="arrow">→</span>
    </button>
  );
}

// ─── Custom cursor (red disc on project hover) ───────────────────────
function ProjectCursor() {
  const ref = useRefI(null);
  const [label, setLabel] = useStateI('View');
  const [variant, setVariant] = useStateI('view'); // view | compare
  useEffectI(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    let raf = 0;
    let tx = 0, ty = 0;
    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el) el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    };
    const over = (e) => {
      const tile = e.target?.closest?.('[data-cursor]');
      if (tile && el) {
        el.classList.add('show');
        const v = tile.getAttribute('data-cursor');
        setVariant(v);
        setLabel(tile.getAttribute('data-cursor-label') || (v === 'compare' ? 'Drag' : 'View'));
      } else if (el) {
        el.classList.remove('show');
      }
    };
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className={`cursor-dot ${variant === 'compare' ? 'compare' : ''}`} aria-hidden>
      {label}
    </div>
  );
}

// ─── Before / After slider ───────────────────────────────────────────
function BeforeAfter({ beforeId = 'ba-before', afterId = 'ba-after', beforeSrc, afterSrc, beforeLabel = 'Before', afterLabel = 'After', ratio = '16/9' }) {
  const ref = useRefI(null);
  const [x, setX] = useStateI(50);
  const drag = useRefI(false);

  const move = useCallbackI((clientX) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setX(Math.max(0, Math.min(100, p)));
  }, []);

  useEffectI(() => {
    const onMove = (e) => { if (drag.current) move(e.clientX); };
    const onTouch = (e) => { if (drag.current) move(e.touches[0].clientX); };
    const onUp = () => { drag.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [move]);

  return (
    <div
      ref={ref}
      className="compare"
      style={{ aspectRatio: ratio, '--compare-x': `${x}%` }}
      data-cursor="compare"
      data-cursor-label="Drag"
      onMouseDown={(e) => { drag.current = true; move(e.clientX); }}
      onTouchStart={(e) => { drag.current = true; move(e.touches[0].clientX); }}
    >
      <div className="compare-layer compare-before">
        <image-slot
          id={beforeId}
          src={beforeSrc}
          placeholder={`${beforeLabel} — archival photo`}
          style={{ width: '100%', height: '100%' }}
        ></image-slot>
      </div>
      <div className="compare-layer compare-after">
        <image-slot
          id={afterId}
          src={afterSrc}
          placeholder={`${afterLabel} — restored photo`}
          style={{ width: '100%', height: '100%' }}
        ></image-slot>
      </div>
      <div className="compare-divider"></div>
      <div className="compare-handle" aria-label="Drag to compare"></div>
      <div className="compare-label left">{beforeLabel}</div>
      <div className="compare-label right">{afterLabel}</div>
    </div>
  );
}

Object.assign(window, {
  ProjectOverlay, ProjectOverlayProvider, useProjectOverlay,
  ProjectCursor, BeforeAfter, ProjectOpenButton,
});
