// motion.jsx — global mouse-interactivity layer
// Exposes: MouseLayer (ambient light + global mouse vars + auto-attached
// local tilt on .photo-well / .project-frame + magnetic on .nav-cta / .tlink).
//
// The smoothing happens here in JS (lerp at ~60fps), so CSS just reads the
// vars and applies a static transform — no CSS transition needed.

const { useEffect: useEffectMo, useState: useStateMo } = React;

function MouseLayer() {
  const [enabled, setEnabled] = useStateMo(true);

  // Honor a "no ambient" tweak if set.
  useEffectMo(() => {
    const sync = () => {
      const t = window.__tweaks || {};
      setEnabled(t.ambientLight !== false);
    };
    sync();
    window.addEventListener('tweaks-changed', sync);
    return () => window.removeEventListener('tweaks-changed', sync);
  }, []);

  // ─── Global mouse tracker — sets CSS vars on <html>
  useEffectMo(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const root = document.documentElement;
    // Targets in [0..1]; centered at 0.5
    let tx = 0.5, ty = 0.5;
    let cx = 0.5, cy = 0.5;
    let raf = 0;

    const tick = () => {
      // Lerp toward target — feels weighty without being laggy
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      const nx = cx * 2 - 1;            // [-1..1]
      const ny = cy * 2 - 1;
      root.style.setProperty('--mx', nx.toFixed(4));
      root.style.setProperty('--my', ny.toFixed(4));
      root.style.setProperty('--mpx', (cx * 100).toFixed(2) + '%');
      root.style.setProperty('--mpy', (cy * 100).toFixed(2) + '%');
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    };
    const onLeave = () => {
      tx = 0.5; ty = 0.5;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ─── Local tilt: .photo-well, .project-frame
  // Per-element so it tracks the mouse INSIDE the tile, not the page.
  useEffectMo(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tracked = new WeakSet();
    let raf = 0;
    // Map<el, {tx, ty, cx, cy, hover}>
    const states = new Map();

    const attach = (el) => {
      if (tracked.has(el)) return;
      tracked.add(el);
      const state = { tx: 0, ty: 0, cx: 0, cy: 0, hover: 0, targetHover: 0 };
      states.set(el, state);

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        state.tx = ((e.clientX - r.left) / r.width) * 2 - 1;   // [-1..1]
        state.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        state.targetHover = 1;
      };
      const onEnter = () => { state.targetHover = 1; };
      const onLeave = () => {
        state.tx = 0; state.ty = 0;
        state.targetHover = 0;
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    };

    const tick = () => {
      states.forEach((s, el) => {
        s.cx += (s.tx - s.cx) * 0.12;
        s.cy += (s.ty - s.cy) * 0.12;
        s.hover += (s.targetHover - s.hover) * 0.12;
        el.style.setProperty('--tx', s.cx.toFixed(4));
        el.style.setProperty('--ty', s.cy.toFixed(4));
        el.style.setProperty('--th', s.hover.toFixed(4));
      });
      raf = requestAnimationFrame(tick);
    };

    const scan = () => {
      document
        .querySelectorAll('.photo-well, .project-frame, [data-tilt]')
        .forEach(attach);
    };
    scan();
    // Re-scan periodically — new tiles appear when routes change.
    const interval = setInterval(scan, 1200);
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      mo.disconnect();
    };
  }, []);

  // ─── Magnetic nudge on primary CTAs
  useEffectMo(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tracked = new WeakSet();
    let raf = 0;
    const states = new Map(); // el -> {tx, ty, cx, cy}

    const attach = (el) => {
      if (tracked.has(el)) return;
      tracked.add(el);
      const s = { tx: 0, ty: 0, cx: 0, cy: 0 };
      states.set(el, s);

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const cx0 = r.left + r.width / 2;
        const cy0 = r.top + r.height / 2;
        const dx = (e.clientX - cx0) / (r.width / 2);
        const dy = (e.clientY - cy0) / (r.height / 2);
        // Only attract while the cursor is close
        s.tx = Math.max(-1.6, Math.min(1.6, dx));
        s.ty = Math.max(-1.6, Math.min(1.6, dy));
      };
      const onLeave = () => { s.tx = 0; s.ty = 0; };

      // Attract zone is bigger than the button — listen on a wrapper bbox
      const onPageMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = r.left + r.width / 2;
        const py = r.top + r.height / 2;
        const dx = e.clientX - px;
        const dy = e.clientY - py;
        const radius = Math.max(r.width, r.height) * 1.6;
        if (Math.hypot(dx, dy) < radius) {
          s.tx = (dx / radius);
          s.ty = (dy / radius);
        } else {
          s.tx = 0; s.ty = 0;
        }
      };
      document.addEventListener('mousemove', onPageMove, { passive: true });
      el.__detachMag = () => document.removeEventListener('mousemove', onPageMove);
    };

    const tick = () => {
      states.forEach((s, el) => {
        s.cx += (s.tx - s.cx) * 0.18;
        s.cy += (s.ty - s.cy) * 0.18;
        el.style.setProperty('--magx', s.cx.toFixed(4));
        el.style.setProperty('--magy', s.cy.toFixed(4));
      });
      raf = requestAnimationFrame(tick);
    };

    const scan = () => {
      document.querySelectorAll('.nav-cta, .btn-outline, [data-magnetic]').forEach(attach);
    };
    scan();
    const interval = setInterval(scan, 1500);
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className="ambient-light"
        aria-hidden
        style={{ opacity: enabled ? 1 : 0 }}
      ></div>
      <div className="ambient-grain" aria-hidden style={{ opacity: enabled ? 1 : 0 }}></div>
    </>
  );
}

Object.assign(window, { MouseLayer });
