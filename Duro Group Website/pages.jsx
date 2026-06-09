// pages.jsx — Home, About, Services, Projects, Contact
const { useState: useStateP, useEffect: useEffectP } = React;

// ═══════════ PROJECT DATA ═══════════
const PROJECTS = [
  {
    id: 'thurgood-marshall',
    title: 'Justice Thurgood Marshall Center',
    year: 2024,
    types: 'Cultural · Historic Preservation',
    categories: ['Cultural', 'Preservation'],
    location: 'Baltimore, MD',
    sf: '22,000 SF',
    cost: '$15,000,000',
    client: 'Beloved Community Services CDC, Inc.',
    sector: 'Cultural Institution',
    services: ['Architecture', 'Interior Architecture', 'MEP Engineering'],
    permits: [],
    status: 'Completed · 2024',
    award: '2024 ULI Wavemaker Award',
    dek: 'Adaptive reuse of PS 103 — Justice Marshall\'s elementary school — anchoring a cultural-tourism strategy for Baltimore\'s Upton community.',
    blurb: 'The Amenity Center was a major step forward in establishing the nation\'s largest historic African American district as a cultural-tourism destination. Built in 1877, PS 103 was a segregated elementary school for African American children — and the school Thurgood Marshall attended from 1914 to 1921.',
  },
  {
    id: 'eastern-market',
    title: 'Eastern Market Preservation',
    year: 2023,
    types: 'Historic Preservation · Architecture',
    categories: ['Civic', 'Preservation'],
    location: 'Washington, DC',
    sf: '7,000 SF',
    cost: '$1,200,000',
    client: 'DC Department of General Services',
    sector: 'Municipal',
    services: ['Architecture', 'Interior Architecture', 'MEP Engineering'],
    permits: ['DOB', 'CFA'],
    status: 'Completed · CA Phase 2023',
    dek: 'Revitalizing stonework, signage, skylights, and the mezzanine deck — safeguarding Eastern Market\'s role as a community marketplace.',
    blurb: 'The Eastern Market Preservation Project addresses normal wear, tear, and deferred maintenance to ensure the long-term preservation of this historic public space — revitalizing exterior stonework, refreshing existing signage, preserving the skylight, and repairing the mezzanine floor deck.',
  },
  {
    id: 'aacw-museum',
    title: 'African American Civil War Museum',
    year: 2023,
    types: 'Cultural · Historic Preservation',
    categories: ['Cultural', 'Preservation'],
    location: 'Washington, DC',
    sf: '15,000 SF',
    cost: '$3,000,000',
    client: 'African American Civil War Memorial Freedom Foundation',
    sector: 'Cultural Institution',
    services: ['Architecture', 'Interior Architecture', 'MEP Engineering'],
    permits: [],
    status: 'Completed · CA Phase 2023',
    dek: 'Adaptive reuse of the 1887 Grimke School — a new permanent home for the museum, targeting LEED Silver.',
    blurb: 'Built in 1887, the Grimke School in the Greater U Street Historic District is undergoing adaptive reuse to host the new permanent home of the African American Civil War Museum. The project will achieve LEED Silver certification while preserving the historic character of the building.',
  },
  {
    id: 'walter-pierce',
    title: 'Walter Pierce Park',
    year: 2024,
    types: 'Park Upgrades · Landscape',
    categories: ['Civic'],
    location: 'Washington, DC',
    sf: '20,000 SF',
    cost: '$700,000',
    client: 'DC Department of General Services',
    sector: 'Municipal',
    services: ['Landscape Architecture', 'Civil Engineering', 'MEP Engineering'],
    permits: ['DOB', 'CFA', 'DDOT', 'DC Water'],
    status: 'In Construction Administration',
    dek: 'Park upgrades on the site of the former Mount Pleasant Plains Cemetery — adding historical interpretation while respecting the heritage of 8,400+ souls.',
    blurb: 'Located in the heart of Adams Morgan, the park is the final resting place for over 8,400 African Americans and remains an important cultural site. Improvements include new historical signage, a standalone Portland Loo restroom, and treatment of the brick wall along Adams Mill Road.',
  },
  {
    id: 'harbor-bank',
    title: 'Harbor Bank of Maryland HQ',
    year: 2025,
    types: 'Bank Fit-out · Architecture',
    categories: ['Private'],
    location: 'Baltimore, MD',
    sf: '5,000 SF',
    cost: '$1,000,000',
    client: 'Harbor Bank of Maryland',
    sector: 'Private — Mission-Driven',
    services: ['Architecture', 'Interior Architecture', 'MEP Engineering'],
    permits: ['DOB', 'CFA'],
    status: 'In Progress',
    dek: 'A new architectural standard for the bank — openness, natural light, and integrated technology in service of community values.',
    blurb: 'The renovation redefines the bank\'s physical identity through a contemporary architectural language that merges functionality, brand expression, and community values. The headquarters becomes a model for all Harbor Bank facilities.',
  },
];

const PROJECT_CATEGORIES = ['All', 'Cultural', 'Civic', 'Preservation', 'Private'];

// ═══════════ AGENCIES + CONTRACT INFO ═══════════
const AGENCIES = [
  { name: 'DC Department of General Services', short: 'DGS' },
  { name: 'Prince William Water Authority', short: 'PWWA' },
  { name: 'U.S. Department of State', short: 'State Department' },
  { name: 'African American Civil War Memorial Foundation', short: 'AACWM' },
  { name: 'Beloved Community Services CDC', short: 'BCS CDC' },
];

const CONTRACTING = {
  uei: 'UEI · Available on request',
  cage: 'CAGE Code · Available on request',
  duns: 'DUNS · Available on request',
  naics: [
    { code: '541310', label: 'Architectural Services' },
    { code: '541330', label: 'Engineering Services' },
    { code: '541320', label: 'Landscape Architecture' },
    { code: '541350', label: 'Building Inspection Services' },
    { code: '541410', label: 'Interior Design Services' },
  ],
  registrations: ['SAM.gov · Active', 'AIA|DC Member', 'DSLBD CBE — Verifying'],
};

const PROJECT_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));

// Image registry — wired to assets/projects/{id}/{slot}.jpg files.
// Slots: hero (featured lead), card (index grid), detail (overlay lower-left),
// context (overlay lower-right). A missing slot falls through to the drop placeholder.
const PROJECT_IMAGES = {
  'thurgood-marshall': {
    hero:     'assets/projects/thurgood-marshall/hero.jpg',
    card:     'assets/projects/thurgood-marshall/card.jpg',
    detail:   'assets/projects/thurgood-marshall/detail.jpg',
    context:  'assets/projects/thurgood-marshall/context.jpg',
    archival: 'assets/projects/thurgood-marshall/archival.jpg', // WPA-era PS 103 schoolyard
  },
  'eastern-market': {
    hero:    'assets/projects/eastern-market/hero.jpg',    // 2010 Italianate facade + market tents
    card:    'assets/projects/eastern-market/card.jpg',    // working market interior
    detail:  'assets/projects/eastern-market/detail.jpg',  // HABS-era B&W skylit hall
    context: 'assets/projects/eastern-market/context.jpg', // entrance plaque detail
  },
  'aacw-museum': {
    hero:     'assets/projects/aacw-museum/hero.jpg',
    card:     'assets/projects/aacw-museum/card.jpg',
    detail:   'assets/projects/aacw-museum/detail.jpg',   // restored Grimke with modern glass insertion
    context:  'assets/projects/aacw-museum/context.jpg',
    archival: 'assets/projects/aacw-museum/archival.jpg', // 1887 Phelps School B&W
  },
  'walter-pierce': {
    hero:    'assets/projects/walter-pierce/hero.jpg',
    card:    'assets/projects/walter-pierce/card.jpg',
    detail:  'assets/projects/walter-pierce/detail.jpg',
    context: 'assets/projects/walter-pierce/context.jpg',
  },
  'harbor-bank': {
    hero:    'assets/projects/harbor-bank/hero.jpg',
    card:    'assets/projects/harbor-bank/card.jpg',
    detail:  'assets/projects/harbor-bank/detail.jpg',
    context: 'assets/projects/harbor-bank/context.jpg',
  },
};
window.PROJECT_IMAGES = PROJECT_IMAGES;

// Project-level video sources. Only populated for projects that have an
// actual moving-image asset. The corresponding image stays as a poster
// fallback (autoplay-blocked browsers, slow networks, before video loads).
const PROJECT_VIDEOS = {
  'harbor-bank': {
    hero: 'assets/projects/harbor-bank/hero.mp4',
  },
  'aacw-museum': {
    hero: 'assets/projects/aacw-museum/hero.mp4',
  },
  'eastern-market': {
    hero: 'assets/projects/eastern-market/Eastern-market-Video.mp4',
  },
  'thurgood-marshall': {
    hero: 'assets/projects/thurgood-marshall/Thurgood-Marshall.mp4',
  },
};
window.PROJECT_VIDEOS = PROJECT_VIDEOS;

// Approx site coordinates for the hero overlay (decorative, per comp).
const PROJECT_COORDS = {
  'walter-pierce': ['38.9220° N', '77.0430° W'],
  'thurgood-marshall': ['39.3070° N', '76.6360° W'],
  'eastern-market': ['38.8870° N', '76.9960° W'],
  'aacw-museum': ['38.9170° N', '77.0250° W'],
  'harbor-bank': ['39.2900° N', '76.6120° W'],
};

// HeroCarousel — full-bleed auto-rotating project rotator. Image (or video)
// fills the frame; geo-coords top-left, project name + city bottom-left,
// 01/06 counter + prev/next arrows bottom-right. Clicking a slide opens it.
function HeroCarousel({ ids }) {
  const { open } = useProjectOverlay();
  const [i, setI] = React.useState(0);
  const n = ids.length;
  const go = (d) => setI((prev) => (prev + d + n) % n);

  React.useEffect(() => {
    const t = setInterval(() => setI((prev) => (prev + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  const activeId = ids[i];
  const p = PROJECT_BY_ID[activeId];
  const coords = PROJECT_COORDS[activeId] || [];

  return (
    <div className="carousel" data-screen-label="Home/Hero">
      {ids.map((id, idx) => (
        <div key={id} className={`carousel-slide ${idx === i ? 'active' : ''}`}>
          <MediaWell
            id={`hero-${id}`}
            placeholder={`${PROJECT_BY_ID[id].title} — hero`}
            src={PROJECT_IMAGES[id]?.hero}
            videoSrc={PROJECT_VIDEOS[id]?.hero}
            ratio={null}
          />
        </div>
      ))}
      <div className="carousel-scrim" />
      {coords.length > 0 && (
        <div className="carousel-coords">
          <div>{coords[0]}</div>
          <div>{coords[1]}</div>
        </div>
      )}
      <div
        className="carousel-caption"
        onClick={() => open(activeId)}
        data-cursor="view" data-cursor-label="View"
        style={{ cursor: 'pointer' }}
      >
        <div className="c-title">{p.title}</div>
        <div className="c-loc">{p.location}</div>
      </div>
      <div className="carousel-controls">
        <button className="carousel-arrow prev" aria-label="Previous" onClick={() => go(-1)}>←</button>
        <span className="carousel-count">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        <button className="carousel-arrow next" aria-label="Next" onClick={() => go(1)}>→</button>
      </div>
    </div>
  );
}

// ═══════════ HOME ═══════════
// Per client comp: full-bleed hero carousel, then a two-column block —
// serif headline left, founding paragraph right.
function HomePage() {
  // Video-backed projects lead; Walter Pierce (no video) sits last.
  const heroIds = ['thurgood-marshall', 'aacw-museum', 'eastern-market', 'harbor-bank', 'walter-pierce'];
  return (
    <main data-screen-label="01 Home">
      <HeroCarousel ids={heroIds} />

      {/* Statement block — headline left, founding paragraph right */}
      <Section data-screen-label="Home/Statement">
        <Rule />
        <div className="grid" style={{ alignItems: 'start', paddingTop: 'clamp(72px, 9vw, 120px)' }}>
          <div style={{ gridColumn: '1 / span 6' }}>
            <Reveal>
              <h1 className="display display-l">
                Meaningful, <span style={{ color: 'var(--duro-red)', fontStyle: 'italic' }}>inspired</span> design solutions for all.
              </h1>
            </Reveal>
          </div>
          <div style={{ gridColumn: '8 / span 5' }}>
            <Reveal delay={120}>
              <p className="body-l" style={{ lineHeight: 1.65 }}>
                Duro Design Group was founded to deliver rigorous, inspired design
                across scales — from everyday private spaces to civic and public
                environments. Our work is responsive to the client, the end user,
                and the broader community, creating places that are visually
                engaging, technically resolved, and responsible to their context,
                resources, and long-term use. We offer architecture, engineering,
                urban design, permitting, and construction support through a
                collaborative process centered on people.
              </p>
              <div style={{ marginTop: 40 }}>
                <TextLink to="/work">See our work</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </main>
  );
}

// ═══════════ ABOUT ═══════════
// Per client comp: "About" title top-right, then numbered sections —
// 01 What we bring / 02 Public Sector / 03 Who we are — each a bold heading
// plus body paragraphs.
function AboutPage() {
  const para = (
    <>
      <p className="body-m" style={{ marginBottom: 24 }}>
        At Duro Design Group, how we translate intention into built reality shapes
        everything we do. We believe good design begins long before a drawing is
        produced — through listening, observation, and the discipline to understand
        what a project is asking from every side: the client, the end user, the
        community, the site, the budget, the agencies, and the people who will live
        with the outcome. Our practice is rooted in presence, clarity, and care. We
        show up to each project with curiosity and responsibility, because every
        space carries more than a program. It carries history, need, ambition,
        memory, and future use.
      </p>
      <p className="body-m" style={{ marginBottom: 24 }}>
        We see design as both a creative and civic act. Whether we are shaping a
        home, a cultural place, a workplace, a public park, or a civic environment,
        our work is measured by how well it serves people. We begin by listening
        deeply and without assumption, then uncover the opportunities hidden inside
        constraint. Context, code, systems, accessibility, durability, and craft are
        not obstacles to beauty; they are the conditions through which meaningful
        design becomes real. Our role is to bring vision and rigor into the same
        process — creating spaces that feel inspired, elegant, useful, and enduring.
      </p>
      <p className="body-m">
        Duro was founded to bring institutional-level design care back to everyday
        life. The discipline often reserved for public work — clear communication,
        technical precision, agency fluency, documentation, and accountability —
        belongs in homes, small businesses, cultural spaces, civic projects, and the
        public realm. We pair architectural imagination with engineering discipline
        and collaborative delivery so clients of all kinds can access serious design
        without losing warmth, humanity, or trust. This is how we show up: attentive,
        exacting, collaborative, and grounded in purpose. We design to elevate the
        built environment, create belonging, and shape places that honor both what
        exists and what could be.
      </p>
    </>
  );

  const sections = [
    { n: '01', t: 'What we bring' },
    { n: '02', t: 'Public Sector' },
    { n: '03', t: 'Who we are' },
  ];

  return (
    <main data-screen-label="02 About">
      <Section sm className="page-title-row">
        <Shell style={{ padding: 0 }}>
          <h1 className="page-title">About</h1>
        </Shell>
      </Section>

      <Section sm style={{ paddingTop: 'clamp(24px, 4vw, 56px)' }} data-screen-label="About/Sections">
        {sections.map((s, i) => (
          <Reveal key={s.n} delay={i * 60}>
            <Accordion num={`${s.n} —`} title={s.t} defaultOpen={i === 0}>
              <div style={{ color: 'var(--duro-ink)' }}>{para}</div>
            </Accordion>
          </Reveal>
        ))}
      </Section>
    </main>
  );
}

// ServiceItem — discipline name + tagline stay visible; the description and
// "Selected capabilities" list drop down behind a labeled toggle.
function ServiceItem({ service: s, defaultOpen = false }) {
  const [open, setOpen] = useStateP(defaultOpen);
  return (
    <div style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(26px, 3vw, 38px)', letterSpacing: '-0.02em', marginBottom: 16 }}>{s.name}</h2>
      <p className="body-m" style={{ marginBottom: 18 }}>{s.tag}</p>

      {/* Toggle — clearly indicates a dropdown with a rotating chevron */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="svc-toggle"
        style={{
          appearance: 'none', background: 'transparent', border: 0, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 0',
          fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: open ? 'var(--duro-red)' : 'var(--duro-ink)',
        }}
      >
        <span>Selected capabilities</span>
        <span aria-hidden="true" style={{
          display: 'inline-block', transition: 'transform 300ms cubic-bezier(0.2,0.7,0.2,1)',
          transform: open ? 'rotate(180deg)' : 'none', fontSize: 11, color: 'var(--duro-red)',
        }}>▾</span>
      </button>

      <div className={`acc-body ${open ? '' : ''}`} style={{
        overflow: 'hidden',
        maxHeight: open ? 800 : 0,
        opacity: open ? 1 : 0,
        transition: 'max-height 420ms cubic-bezier(0.2,0.7,0.2,1), opacity 320ms ease',
      }}>
        <p className="body-s mute" style={{ margin: '14px 0 20px', maxWidth: '46ch' }}>{s.body}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {s.caps.map(c => (
            <div key={c} className="body-s mute" style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ color: 'var(--duro-red)' }}>·</span> {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════ SERVICES ═══════════
// Per client comp: "Services" title top-right; left column lists Architecture /
// Engineering / Permitting (name · tagline · capabilities dropdown);
// right column holds a large serif statement with red emphasis words.
function ServicesPage() {
  const services = [
    {
      name: 'Architecture',
      tag: 'Spaces shaped around people, purpose, and place.',
      body: 'We design buildings, interiors, renovations, additions, and spatial experiences that support how people live, work, gather, and move. Our architectural work balances clarity, beauty, technical coordination, and long-term use.',
      caps: ['Feasibility Studies and Existing Conditions Assessments', 'Space Planning and Programming', 'Interior Architecture', 'Landscape Architecture', 'Full Service Permitting Services', 'Construction Administration'],
    },
    {
      name: 'Engineering',
      tag: 'Technical care that makes spaces safer, stronger, and more enduring.',
      body: 'We coordinate the systems that allow design to perform. MEP, structure, and civil are integrated early so each project can move with confidence from idea to use.',
      caps: ['MEP Engineering', 'Structural Engineering', 'Civil Engineering'],
    },
    {
      name: 'Permitting',
      tag: 'Government-caliber guidance for projects of every scale.',
      body: 'We help projects move through review, permitting, and agency coordination with clarity. Whether the project is public or private, we bring discipline to the approval process so design intent can move forward.',
      caps: ['Building Permits', 'Stormwater, Utility, and Tree Permits', 'Department of Transportation Permits', 'Permit Expediting'],
    },
  ];

  return (
    <main data-screen-label="03 Services">
      <Section sm className="page-title-row">
        <Shell style={{ padding: 0 }}>
          <h1 className="page-title">Services</h1>
        </Shell>
      </Section>

      <Section sm style={{ paddingTop: 'clamp(24px, 4vw, 56px)' }}>
        <div className="grid" style={{ alignItems: 'start', columnGap: 'clamp(40px, 6vw, 96px)' }}>
          {/* Left — disciplines (capabilities collapse under each tagline) */}
          <div style={{ gridColumn: '1 / span 6' }}>
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <ServiceItem service={s} defaultOpen={i === 0} />
              </Reveal>
            ))}
          </div>

          {/* Right — big serif statement */}
          <div style={{ gridColumn: '8 / span 5' }}>
            <Reveal delay={120}>
              <p className="display display-m" style={{ lineHeight: 1.12 }}>
                From first <span style={{ color: 'var(--duro-red)' }}>intention</span> to final detail, we guide ideas into elegant, enduring places shaped for people and <span style={{ color: 'var(--duro-red)' }}>built</span> with discipline.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>
    </main>
  );
}

// ═══════════ WORK ═══════════
// Per client comp: "Work" title top-right; a thumbnail grid of every project;
// then a featured block (big media left, 3 stacked thumbs right) with a
// Completion | Type | SQ FT meta line and a descriptive paragraph. Selecting
// any thumbnail promotes it to the featured slot; clicking the feature opens
// the full overlay.
function WorkPage() {
  const { open } = useProjectOverlay();
  const [featuredId, setFeatured] = useStateP(PROJECTS[0].id);
  const feat = PROJECT_BY_ID[featuredId];
  const imgs = PROJECT_IMAGES[featuredId] || {};

  // The three side thumbs are OTHER VIEWS OF THE SAME PROJECT (its own
  // detail / context / card / archival shots), not other projects. Pick up to
  // three distinct stills, falling back to whatever the project has.
  const sideViews = [imgs.detail, imgs.context, imgs.card, imgs.archival, imgs.hero]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3);

  const featuredHere = (id) => { setFeatured(id); };

  return (
    <main data-screen-label="04 Work">
      <Section sm className="page-title-row">
        <Shell style={{ padding: 0 }}>
          <h1 className="page-title">Work</h1>
        </Shell>
      </Section>

      {/* Thumbnail grid — every project; hover plays video, click features it */}
      <Section sm style={{ paddingTop: 'clamp(16px, 3vw, 40px)', paddingBottom: 'clamp(32px, 4vw, 56px)' }}>
        <div className="work-wrap work-thumbs">
          {PROJECTS.map((p) => (
            <Reveal key={p.id}>
              <div
                className="work-thumb"
                onClick={() => { setFeatured(p.id); window.scrollTo({ top: window.scrollY }); }}
                onDoubleClick={() => open(p.id)}
                data-cursor="view" data-cursor-label="Select"
                data-screen-label={`Work/${p.title}`}
              >
                <MediaWell
                  id={`wt-${p.id}`}
                  placeholder={`${p.title}`}
                  src={PROJECT_IMAGES[p.id]?.card || PROJECT_IMAGES[p.id]?.hero}
                  videoSrc={PROJECT_VIDEOS[p.id]?.hero}
                  ratio={null}
                />
                <div className="work-thumb-label">{p.title}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Featured block */}
      <Section sm style={{ paddingTop: 0, paddingBottom: 'clamp(56px, 7vw, 96px)' }} data-screen-label="Work/Featured">
        <Reveal>
          {/* Big media LEFT · same-project view thumbs RIGHT */}
          <div className="work-wrap work-feature">
            <div
              className="work-feature-main"
              onClick={() => open(featuredId)}
              data-cursor="view" data-cursor-label="View"
            >
              <MediaWell
                id={`wf-main-${featuredId}`}
                placeholder={`${feat.title} — primary`}
                src={PROJECT_IMAGES[featuredId]?.hero}
                videoSrc={PROJECT_VIDEOS[featuredId]?.hero}
                ratio={null}
              />
              <div className="wf-caption">
                <div className="wf-title">{feat.title}</div>
                <div className="wf-loc">{feat.location}</div>
              </div>
            </div>
            <div className="work-feature-side">
              {sideViews.map((src, i) => (
                <div
                  key={src}
                  className="work-thumb"
                  onClick={() => open(featuredId)}
                  data-cursor="view" data-cursor-label="View"
                >
                  <PhotoWell
                    id={`wf-side-${featuredId}-${i}`}
                    placeholder={`${feat.title} — view ${i + 1}`}
                    src={src}
                    ratio={null}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Meta line + paragraph */}
          <div className="work-wrap" style={{ marginTop: 'clamp(28px, 3vw, 44px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 4vw, 56px)', marginBottom: 24 }} className="smallcaps mute">
              <span>Completion <span style={{ color: 'var(--duro-ink)', marginLeft: 8 }}>{feat.year}</span></span>
              <span>Type <span style={{ color: 'var(--duro-ink)', marginLeft: 8 }}>{feat.types.split(' · ')[0]}</span></span>
              <span>SQ FT <span style={{ color: 'var(--duro-ink)', marginLeft: 8 }}>{feat.sf}</span></span>
            </div>
            <p className="body-m mute" style={{ maxWidth: '88ch' }}>{feat.blurb}</p>
            <div style={{ marginTop: 28 }}>
              <TextLink onClick={() => open(featuredId)}>View project</TextLink>
            </div>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}

// ═══════════ CONTACT ═══════════
function ContactPage() {
  const [submitted, setSubmitted] = useStateP(false);
  const [form, setForm] = useStateP({ name: '', email: '', org: '', type: '', message: '' });
  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main data-screen-label="05 Contact">
      <Section sm className="page-title-row">
        <Shell style={{ padding: 0 }}>
          <h1 className="page-title">Contact</h1>
        </Shell>
      </Section>

      <Section style={{ paddingTop: 'clamp(24px, 4vw, 56px)' }}>
        <div className="grid" style={{ alignItems: 'start', columnGap: 'clamp(40px, 6vw, 96px)' }}>
          {/* Left — serif statement */}
          <div style={{ gridColumn: '1 / span 5' }}>
            <Reveal>
              <h1 className="display display-l">
                Let’s discuss the<br/><span style={{ color: 'var(--duro-red)' }}>possibilities</span>.
              </h1>
            </Reveal>
          </div>

          {/* Right — form */}
          <div style={{ gridColumn: '7 / span 6' }}>
            <Reveal delay={150}>
              {!submitted ? (
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                  <div>
                    <label className="field-label">Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="field-label">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div>
                    <label className="field-label">Company</label>
                    <input type="text" value={form.org} onChange={e => setForm({...form, org: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label">Project Type</label>
                    <input type="text" value={form.type} onChange={e => setForm({...form, type: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label">Message</label>
                    <textarea rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button type="submit" className="tlink" style={{ border: 0, background: 'transparent', padding: '4px 0', fontSize: 14 }}>
                      <span>Send Message</span>
                      <span className="arrow">→</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: '40px 0' }}>
                  <Eyebrow red style={{ marginBottom: 24 }}>Received</Eyebrow>
                  <p className="display display-s" style={{ maxWidth: '20ch' }}>
                    Thanks. We’ll be in touch shortly.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </Section>
    </main>
  );
}

Object.assign(window, {
  HomePage, AboutPage, ServicesPage, WorkPage, ContactPage,
  PROJECTS, PROJECT_BY_ID,
});
