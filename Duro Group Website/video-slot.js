/**
 * <video-slot> — companion to <image-slot> for video drops.
 *
 *   • Drag-drop a video file onto the slot → autoplays muted/looped.
 *   • Paste a URL while hovering → uses that as src.
 *   • Right-click → "Paste video URL…" prompt for explicit entry.
 *   • Shift+click an empty slot → URL prompt.
 *   • Click an empty slot → file picker.
 *   • Drag an image onto the slot → used as a poster frame.
 *
 * Persistence: URLs are stored in localStorage by id; file drops survive the
 * session but not a reload (object URLs are not persistable). When a file
 * drop is lost the slot falls back to its poster or placeholder.
 *
 *   <script src="video-slot.js"></script>
 *   <video-slot id="hero" placeholder="Drop a project video" poster="..."></video-slot>
 *
 * Attributes:
 *   id           Required for persistence
 *   placeholder  Empty-state caption (default "Drop a video")
 *   poster       Static image URL shown before play / when no video set
 *   src          Optional initial video URL
 *   loop         true|false (default true)
 *   muted        true|false (default true — required for autoplay)
 *   controls     If present, show native controls instead of hover affordance
 */
(() => {
  if (customElements.get('video-slot')) return;

  const css = `
    :host { display:block; position:relative; background:transparent;
      overflow:hidden; cursor:default;
      font:11px/1.4 -apple-system, system-ui, sans-serif; }
    :host([data-dragover])::after {
      content:""; position:absolute; inset:0;
      outline:2px solid var(--vs-accent, #E63027); outline-offset:-2px;
      background:rgba(230,48,39,.06); pointer-events:none; z-index:5;
    }
    .well { position:absolute; inset:0; width:100%; height:100%; background:#0a0a0a; }
    video, img.poster {
      position:absolute; inset:0; width:100%; height:100%;
      display:block;
    }
    /* Show the whole video frame (no crop); letterbox on the black well.
       Poster still image fills the frame so the still looks intentional.
       Poster sits BEHIND the video so the video can crossfade in on top
       while it buffers. */
    img.poster { object-fit:cover; z-index:1; }
    video { object-fit:contain; z-index:2; }
    .cap {
      position:absolute; right:14px; top:14px;
      display:flex; align-items:center; gap:6px;
      background:rgba(23,23,23,.55); color:#fff;
      padding:5px 9px;
      letter-spacing:.14em; text-transform:uppercase;
      font-size:9px; pointer-events:none;
      opacity:0; transition: opacity 200ms ease;
      z-index: 4;
    }
    .cap::before { content:"▶"; font-size:8px; }
    :host(:hover) .cap { opacity:1; }
    .cap.has-poster { background:rgba(0,0,0,.55); color:#fff; }
    .badge {
      position:absolute; left:14px; top:14px;
      background:rgba(0,0,0,.55); color:#fff;
      font-size:9px; letter-spacing:.18em; text-transform:uppercase;
      padding:4px 8px; border-radius:1px; z-index:3;
      pointer-events:none;
      display:none !important;   /* editor affordance — hidden in production */
    }
    .ctrl {
      position:absolute; right:14px; bottom:14px; z-index:4;
      display:flex; gap:6px; opacity:0; transition: opacity 200ms ease;
    }
    /* Editor controls reveal only when the host opts in via [data-editable]. */
    :host([data-editable]:hover) .ctrl { opacity:1; }
    :host(:not([data-editable])) .ctrl { display:none; }
    :host(:not([data-editable])) .cap { display:none; }
    .ctrl button {
      appearance:none; border:0; cursor:pointer;
      background:rgba(0,0,0,.55); color:#fff;
      padding:6px 10px; font:inherit;
      letter-spacing:.14em; text-transform:uppercase; font-size:9px;
      border-radius:1px;
    }
    .ctrl button:hover { background:#E63027; }
    input[type=file] { display:none; }
  `;

  class VideoSlot extends HTMLElement {
    static get observedAttributes() { return ['placeholder', 'poster', 'src', 'id', 'loop', 'muted', 'controls']; }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      const style = document.createElement('style'); style.textContent = css;
      root.appendChild(style);
      this._well = document.createElement('div'); this._well.className = 'well';
      this._cap = document.createElement('div'); this._cap.className = 'cap';
      this._badge = document.createElement('div'); this._badge.className = 'badge'; this._badge.textContent = 'Video';
      this._badge.style.display = 'none';
      this._poster = document.createElement('img'); this._poster.className = 'poster'; this._poster.style.display = 'none';
      this._video = document.createElement('video');
      this._video.style.display = 'none';
      this._video.style.opacity = '0';
      this._video.style.transition = 'opacity 400ms ease';
      this._video.setAttribute('playsinline', '');
      this._video.setAttribute('preload', 'auto');
      this._video.muted = true;
      this._video.loop = true;
      this._video.autoplay = true;
      this._input = document.createElement('input');
      this._input.type = 'file';
      this._input.accept = 'video/*,image/*';
      this._ctrl = document.createElement('div'); this._ctrl.className = 'ctrl';
      this._ctrl.innerHTML = `
        <button data-act="url">URL</button>
        <button data-act="file">File</button>
        <button data-act="clear">Clear</button>
      `;
      this._well.append(this._poster, this._video, this._cap, this._badge);
      root.append(this._well, this._ctrl, this._input);
      this._bind();
    }

    _bind() {
      this.addEventListener('dragover', (e) => { e.preventDefault(); this.setAttribute('data-dragover', ''); });
      this.addEventListener('dragleave', () => this.removeAttribute('data-dragover'));
      this.addEventListener('drop', (e) => {
        e.preventDefault();
        this.removeAttribute('data-dragover');
        const f = e.dataTransfer?.files?.[0];
        if (f) { this._ingestFile(f); return; }
        // Maybe a URL was dragged
        const url = e.dataTransfer?.getData('text/uri-list') || e.dataTransfer?.getData('text/plain');
        if (url) this._setSrc(url, true);
      });
      this.addEventListener('click', (e) => {
        if (this._src) return; // ignore click when something is playing
        if (e.shiftKey) {
          this._promptUrl();
        } else {
          this._input.click();
        }
      });
      this.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this._promptUrl();
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files?.[0];
        if (f) this._ingestFile(f);
        this._input.value = '';
      });
      this._ctrl.addEventListener('click', (e) => {
        const act = e.target?.dataset?.act;
        if (!act) return;
        if (act === 'url') this._promptUrl();
        else if (act === 'file') this._input.click();
        else if (act === 'clear') this._clear();
      });
      // Allow paste while hovering
      this.addEventListener('mouseenter', () => { document.addEventListener('paste', this._onPaste); });
      this.addEventListener('mouseleave', () => { document.removeEventListener('paste', this._onPaste); });
      this._onPaste = (e) => {
        const text = e.clipboardData?.getData('text');
        if (text && /^https?:\/\//i.test(text)) {
          e.preventDefault();
          this._setSrc(text, true);
        }
      };
    }

    connectedCallback() {
      this._cap.textContent = 'Add video';
      this._hydrate();
    }

    disconnectedCallback() {
      if (this._io) { this._io.disconnect(); this._io = null; }
    }

    // React-friendly: attributes (src/poster) often arrive a render tick AFTER
    // the element mounts, so connectedCallback alone misses them. Re-hydrate on
    // change — mirrors image-slot.js's attributeChangedCallback so author-set
    // src never loses the race. Persisted/user state still wins over author src.
    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      if (!this.shadowRoot) return; // pre-construction; connectedCallback handles it
      if (name === 'poster' || name === 'src') this._hydrate();
    }

    _hydrate() {
      // A user drop/paste (or a previously persisted URL) always wins over the
      // author-supplied src attribute — never clobber live playback.
      const id = this.getAttribute('id');
      let persisted = null;
      if (id) {
        try { persisted = localStorage.getItem('video-slot:' + id); } catch {}
      }
      const desired = persisted || this.getAttribute('src');

      // Poster: show it whenever there's no active video yet.
      const poster = this.getAttribute('poster');
      if (poster && this._poster.src !== poster) this._poster.src = poster;
      if (poster && !this._src && !desired) {
        this._poster.style.display = 'block';
        this._cap.classList.add('has-poster');
      }

      // Only (re)set the video source if it actually changed. Defer the
      // actual network fetch until the slot is at/near the viewport, so a
      // page with several videos (Work grid, carousel) doesn't pull them all
      // at once and starve the visible one's bandwidth. The poster/image
      // behind it is already showing, so off-screen slots look complete.
      if (desired && desired !== this._src && desired !== this._pendingSrc) {
        this._pendingSrc = desired;
        this._loadWhenVisible(desired);
      }
    }

    _loadWhenVisible(url) {
      const start = () => {
        if (this._pendingSrc !== url) return; // superseded
        this._pendingSrc = null;
        this._setSrc(url, false);
      };
      // No IO support, or already on screen → load now.
      if (typeof IntersectionObserver === 'undefined') { start(); return; }
      const r = this.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 1.25 && r.bottom > -vh * 0.25) { start(); return; }
      if (this._io) this._io.disconnect();
      this._io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { this._io.disconnect(); this._io = null; start(); }
        }
      }, { rootMargin: '300px 0px' }); // begin slightly before it scrolls in
      this._io.observe(this);
    }

    _promptUrl() {
      const cur = this._src || '';
      const url = window.prompt('Video URL (mp4, webm, etc.):', cur);
      if (url === null) return;
      if (!url) { this._clear(); return; }
      this._setSrc(url, true);
    }

    _ingestFile(file) {
      if (file.type?.startsWith('image/')) {
        // Use as poster
        const url = URL.createObjectURL(file);
        this._poster.src = url; this._poster.style.display = 'block';
        this._cap.classList.add('has-poster');
        return;
      }
      if (!file.type?.startsWith('video/')) return;
      const url = URL.createObjectURL(file);
      this._setSrc(url, false); // session-only — don't persist object URLs
      this._cap.textContent = 'Video added (session only — paste URL to persist)';
    }

    _setSrc(url, persist) {
      this._src = url;
      this._cap.style.display = 'none';
      this._badge.style.display = 'block';

      // Keep the poster visible underneath while the video buffers — the
      // viewer sees the still frame instantly instead of a black box. The
      // video element is mounted but transparent; it fades in only once it
      // has enough data to play, so there's no flash of empty/black.
      const poster = this.getAttribute('poster');
      if (poster) {
        if (this._poster.src !== poster) this._poster.src = poster;
        this._poster.style.display = 'block';
      }
      this._video.style.display = 'block';
      this._video.style.opacity = '0';

      const reveal = () => {
        this._video.style.opacity = '1';
        // Drop the poster after the crossfade so it can't bleed through.
        setTimeout(() => { if (this._src) this._poster.style.display = 'none'; }, 420);
      };
      // Fire on the first frame that's actually renderable.
      this._video.addEventListener('loadeddata', reveal, { once: true });
      this._video.addEventListener('playing', reveal, { once: true });

      this._video.src = url;
      // Nudge the browser to begin fetching/decoding right away.
      try { this._video.load(); } catch {}
      this._video.play().catch(() => {});

      const id = this.getAttribute('id');
      if (persist && id) {
        try { localStorage.setItem('video-slot:' + id, url); } catch {}
      }
    }

    _clear() {
      this._src = null;
      this._video.removeAttribute('src');
      this._video.load();
      this._video.style.display = 'none';
      this._cap.style.display = 'flex';
      this._badge.style.display = 'none';
      const id = this.getAttribute('id');
      if (id) {
        try { localStorage.removeItem('video-slot:' + id); } catch {}
      }
      const poster = this.getAttribute('poster');
      this._poster.style.display = poster ? 'block' : 'none';
      if (!poster) this._cap.classList.remove('has-poster');
    }
  }

  customElements.define('video-slot', VideoSlot);
})();
