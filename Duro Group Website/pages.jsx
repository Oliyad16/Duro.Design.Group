// pages.jsx — Home, About, Services, Projects, Contact
const { useState: useStateP, useEffect: useEffectP } = React;

// ═══════════ PROJECT DATA ═══════════
const PROJECTS = [
  {
    id: 'thurgood-marshall',
    title: 'Justice Thurgood Marshall Center',
    year: 2024,
    types: 'Cultural · Historic Preservation',
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
};
window.PROJECT_VIDEOS = PROJECT_VIDEOS;

// FeaturedProject — full-bleed hero block. Reads beforeAfter Tweak to swap the
// hero image for a draggable before/after slider on supported projects.
function FeaturedProject({ id }) {
  const p = PROJECT_BY_ID[id];
  const { open } = useProjectOverlay();
  // Read tweak from window — set by App on body via class. Simpler: read
  // localStorage written by useTweaks.
  const [beforeAfter, setBA] = React.useState(false);
  React.useEffect(() => {
    const read = () => setBA(!!(window.__tweaks && window.__tweaks.beforeAfter));
    read();
    window.addEventListener('tweaks-changed', read);
    return () => window.removeEventListener('tweaks-changed', read);
  }, []);

  return (
    <div className="project" onClick={() => open(id)} data-cursor={beforeAfter ? null : 'view'} data-cursor-label="View case">
      {beforeAfter ? (
        <div className="project-frame" onClick={(e) => e.stopPropagation()} style={{ cursor: 'ew-resize' }}>
          <BeforeAfter
            beforeId={`ba-${id}-before`}
            afterId={`ba-${id}-after`}
            beforeSrc={PROJECT_IMAGES[id]?.archival}
            afterSrc={PROJECT_IMAGES[id]?.hero}
            beforeLabel="1877 · Archival"
            afterLabel="2024 · Restored"
            ratio="21/9"
          />
        </div>
      ) : (
        <MediaWell
          id={`proj-${id}-lead`}
          placeholder={`${p.title} — primary photo or video`}
          src={PROJECT_IMAGES[id]?.hero}
          ratio="21/9"
          className="project-frame"
        />
      )}
      <Shell style={{ padding: 0 }}>
        <div className="grid" style={{ marginTop: 32 }}>
          <div style={{ gridColumn: '1 / span 7' }}>
            {p.award && <Eyebrow red style={{ marginBottom: 16 }}>{p.award}</Eyebrow>}
            <h3 className="display display-m" style={{ marginBottom: 16 }}>
              <span className="project-title">{p.title}</span>
            </h3>
            <div className="project-caption">{p.types} · {p.location} · {p.sf}</div>
          </div>
          <div style={{ gridColumn: '8 / span 5' }}>
            <p className="body-m mute" style={{ marginBottom: 24 }}>{p.dek}</p>
            <button
              className="tlink"
              onClick={(e) => { e.stopPropagation(); open(id); }}
              style={{ border: 0, background: 'transparent', padding: '4px 0' }}
            >
              <span>View project</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </Shell>
    </div>
  );
}

// ═══════════ HOME ═══════════
function HomePage() {
  return (
    <main data-screen-label="01 Home">
      {/* HERO */}
      <section className="section-sm" data-screen-label="Home/Hero" style={{ paddingTop: 'clamp(40px, 6vw, 80px)', paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
        <Shell>
          <div className="grid" style={{ alignItems: 'end', minHeight: '78vh' }}>
            {/* Headline left */}
            <div style={{ gridColumn: '1 / span 7', paddingBottom: 24 }}>
              <Reveal>
                <Eyebrow red style={{ marginBottom: 40 }}>Washington, DC · Public-sector A+E · Est. 2015</Eyebrow>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="display display-xl" style={{ marginBottom: 48 }}>
                  We <span className="u">design</span>, <span className="u">engineer</span>,<br/>
                  and <span className="u">steward</span> buildings<br/>
                  that serve the&nbsp;<em>public good</em>.
                </h1>
              </Reveal>
              <Reveal delay={250}>
                <div className="body-l mute" style={{ maxWidth: '46ch', marginBottom: 48 }}>
                  The DMV's integrated architecture and engineering firm — built for the way public agencies actually procure, permit, and deliver work.
                </div>
              </Reveal>
              <Reveal delay={350}>
                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <TextLink to="/projects">See our work</TextLink>
                  <TextLink to="/contact" ghost>Request SF-330 portfolio</TextLink>
                </div>
              </Reveal>
            </div>

            {/* Image right */}
            <div style={{ gridColumn: '8 / span 5', alignSelf: 'stretch', display: 'flex' }}>
              <Reveal style={{ width: '100%', display: 'flex' }}>
                <div style={{ width: '100%', alignSelf: 'end' }}>
                  <PhotoWell
                    id="home-hero"
                    placeholder="Thurgood Marshall Center — façade, autumn light"
                    src="assets/home/hero.jpg"
                    ratio="3/4"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Shell>
      </section>

      {/* STAT BAND */}
      <Section sm data-screen-label="Home/Stats">
        <Rule />
        <div className="grid" style={{ padding: '80px 0' }}>
          <div style={{ gridColumn: '1 / span 4' }}>
            <Reveal><StatBlock num="5" caption="Disciplines under one roof — Architecture · MEP · Structural · Civil · Permitting" /></Reveal>
          </div>
          <div style={{ gridColumn: '5 / span 4' }}>
            <Reveal delay={120}><StatBlock num="10+" caption="Years supporting local, state, and regional government projects" /></Reveal>
          </div>
          <div style={{ gridColumn: '9 / span 4' }}>
            <Reveal delay={240}><StatBlock num="1" caption="Signature. One accountable team. One source of truth." /></Reveal>
          </div>
        </div>
        <Rule />
      </Section>

      {/* AGENCIES SERVED */}
      <Section sm data-screen-label="Home/Agencies">
        <div className="grid" style={{ alignItems: 'start' }}>
          <div style={{ gridColumn: '1 / span 4' }}>
            <Eyebrow style={{ marginBottom: 32 }}>Public Clients</Eyebrow>
            <h2 className="display display-s" style={{ marginBottom: 24 }}>
              We work with the agencies that <em><span className="u">steward</span></em> public space.
            </h2>
            <p className="body-m mute" style={{ maxWidth: '34ch' }}>
              Local, state, and regional. From small-scale municipal upgrades to multi-phase infrastructure work — we know the procurement cycle, the agency contacts, and the regulatory steps that come next.
            </p>
          </div>
          <div style={{ gridColumn: '6 / span 7' }}>
            <Rule />
            {AGENCIES.map((a, i) => (
              <Reveal key={a.short} delay={i * 60}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  padding: '24px 0',
                  borderBottom: '1px solid var(--duro-rule)',
                  alignItems: 'baseline',
                  gap: 24,
                }}>
                  <div className="serif" style={{ fontSize: 'clamp(20px, 2vw, 28px)', letterSpacing: '-0.01em' }}>
                    {a.name}
                  </div>
                  <div className="smallcaps mute">{a.short}</div>
                </div>
              </Reveal>
            ))}
            <p className="smallcaps mute" style={{ marginTop: 24 }}>
              + Federal, state, municipal, cultural & educational clients across DC, MD, VA
            </p>
          </div>
        </div>
      </Section>

      {/* SELECTED WORK */}
      <section data-screen-label="Home/Work">
        <Shell>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 64 }}>
            <Eyebrow>Selected Work · 2023 — 2025</Eyebrow>
            <TextLink to="/projects" ghost>All projects</TextLink>
          </div>
        </Shell>

        {/* Lead — Thurgood Marshall — full bleed */}
        <Reveal>
          <div style={{ padding: '0 var(--page-pad)', maxWidth: 1440, margin: '0 auto' }}>
            <FeaturedProject id="thurgood-marshall" />
          </div>
        </Reveal>

        {/* 2-up gallery */}
        <Shell style={{ paddingTop: 160, paddingBottom: 0 }}>
          <div className="grid" style={{ rowGap: 120 }}>
            <div style={{ gridColumn: '1 / span 6' }}>
              <Reveal><ProjectCard {...PROJECTS[1]} ratio="4/5" /></Reveal>
            </div>
            <div style={{ gridColumn: '7 / span 6', marginTop: 80 }}>
              <Reveal delay={120}><ProjectCard {...PROJECTS[2]} ratio="4/5" /></Reveal>
            </div>
            <div style={{ gridColumn: '2 / span 5' }}>
              <Reveal><ProjectCard {...PROJECTS[3]} ratio="3/4" /></Reveal>
            </div>
            <div style={{ gridColumn: '8 / span 5', marginTop: 120 }}>
              <Reveal delay={120}><ProjectCard {...PROJECTS[4]} ratio="3/4" /></Reveal>
            </div>
          </div>
        </Shell>
      </section>

      {/* WHY INTEGRATED */}
      <Section data-screen-label="Home/Integrated">
        <div className="grid">
          <div style={{ gridColumn: '1 / span 7' }}>
            <Eyebrow style={{ marginBottom: 40 }}>The Integrated Firm</Eyebrow>
            <PullQuote>
              "One signature on every drawing.<br/>
              One team accountable for every decision."
            </PullQuote>
          </div>
          <div style={{ gridColumn: '9 / span 4', paddingTop: 32 }}>
            <p className="body-l" style={{ marginBottom: 24 }}>
              Subconsultant coordination is the number-one source of risk on government projects. Schedules slip in the gaps between firms. Drawings disagree. Permit reviewers send everyone back to start.
            </p>
            <p className="body-l mute">
              DURO carries architecture, MEP, structural, civil, and permitting in-house. Every drawing leaves our office with one signature and one set of stamps — ours.
            </p>
          </div>
        </div>
      </Section>

      {/* PRACTICE AREAS PREVIEW */}
      <Section sm data-screen-label="Home/Practice">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 64 }}>
          <div>
            <Eyebrow style={{ marginBottom: 24 }}>Practice Areas</Eyebrow>
            <h2 className="display display-m" style={{ maxWidth: '18ch' }}>
              Eleven services.<br/>One contract.<br/>One signature.
            </h2>
          </div>
          <TextLink to="/services" ghost>Services in detail</TextLink>
        </div>

        <div>
          <DisciplineRow name="Architecture" desc="Programming, schematic through construction documents, construction administration." />
          <DisciplineRow name="Interior Architecture" desc="Tenant fit-outs, space planning, finishes and FF&E." />
          <DisciplineRow name="Landscape Architecture" desc="Site, plaza, park, and civic-space design — coordinated with civil and MEP." />
          <DisciplineRow name="MEP Engineering" desc="In-house mechanical, electrical, plumbing. Energy modeling, BEPS, LEED, net-zero pathways." />
          <DisciplineRow name="Structural Engineering" desc="System design, analysis, existing-building assessments, renovation and retrofit." />
          <DisciplineRow name="Civil Engineering" desc="Erosion & sediment control, stormwater, GAR plans, utility plans, traffic & public-space." />
          <DisciplineRow name="Historic Preservation & Adaptive Reuse" desc="HPRB, SHPO, CFA, Section 106. Conditions assessments and treatment plans." />
          <DisciplineRow name="Feasibility & Existing Conditions" desc="Pre-design assessments to confirm scope, budget, and program before commitments." />
          <DisciplineRow name="Construction Administration" desc="Field observation, RFI response, submittal review, change-order management." />
          <DisciplineRow name="Permitting & Regulatory Strategy" desc="DOB, CFA, DDOT, DC Water, MDE, VDOT, HPRB. Packages, expediting, agency liaison." />
          <DisciplineRow name="Permit Expediting" desc="In-house expediting — not a referral. Same team that drew it walks it through review." />
        </div>
      </Section>

      {/* PROCUREMENT READINESS */}
      <section className="section dark-block" data-screen-label="Home/Procurement">
        <Shell>
          <div className="grid" style={{ alignItems: 'start' }}>
            <div style={{ gridColumn: '1 / span 5' }}>
              <Eyebrow red style={{ marginBottom: 32 }}>Procurement Readiness</Eyebrow>
              <h2 className="display display-l" style={{ marginBottom: 32 }}>
                Built for the way <em><span className="u">public agencies</span></em> buy.
              </h2>
              <p className="body-l" style={{ maxWidth: '36ch', color: 'rgba(250,250,247,0.78)' }}>
                Registered, certified, and ready to respond. We carry the same compliance posture as firms ten times our size — with the responsiveness of one that isn't.
              </p>
              <div style={{ marginTop: 48 }}>
                <TextLink to="/contact">Request our SF-330 portfolio</TextLink>
              </div>
            </div>

            <div style={{ gridColumn: '7 / span 6' }}>
              <Rule />
              {CONTRACTING.registrations.map((r) => (
                <div key={r} style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr',
                  padding: '20px 0', borderBottom: '1px solid rgba(250,250,247,0.15)',
                  gap: 24,
                }}>
                  <div className="smallcaps" style={{ color: 'var(--duro-red)' }}>✓</div>
                  <div className="body-m">{r}</div>
                </div>
              ))}

              <div style={{ marginTop: 48 }}>
                <Eyebrow style={{ marginBottom: 24, color: 'rgba(250,250,247,0.6)' }}>NAICS Codes</Eyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {CONTRACTING.naics.map(n => (
                    <div key={n.code} style={{ paddingTop: 12, borderTop: '1px solid rgba(250,250,247,0.15)' }}>
                      <div className="serif" style={{ fontSize: 22, color: 'var(--duro-bg)', letterSpacing: '-0.01em' }}>{n.code}</div>
                      <div className="smallcaps" style={{ color: 'rgba(250,250,247,0.55)', marginTop: 4 }}>{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Shell>
      </section>

      {/* CLOSING CTA */}
      <ClosingCTA
        headline={<><em><span className="u">Building</span></em> for the next generation of public stewards.</>}
        body={<>DURO Design Group, LLC<br/>5112 11th Street NE<br/>Washington, DC 20011</>}
      />
    </main>
  );
}

// ═══════════ ABOUT ═══════════
function AboutPage() {
  return (
    <main data-screen-label="02 About">
      <Section sm>
        <Eyebrow red>About</Eyebrow>
      </Section>

      <section style={{ paddingBottom: 'clamp(80px, 10vw, 160px)' }}>
        <Shell>
          <div className="grid" style={{ alignItems: 'end' }}>
            <div style={{ gridColumn: '1 / span 7' }}>
              <Reveal>
                <h1 className="display display-xl" style={{ marginBottom: 48 }}>
                  We work where <em><span className="u">public memory</span></em><br/>meets public infrastructure.
                </h1>
              </Reveal>
            </div>
            <div style={{ gridColumn: '9 / span 4' }}>
              <Reveal>
                <PhotoWell
                  id="about-hero"
                  placeholder="DURO Design Group logo"
                  src="assets/brand/duro-logo-red.png"
                  fit="contain"
                  ratio="3/4"
                />
              </Reveal>
            </div>
          </div>
        </Shell>
      </section>

      {/* The firm */}
      <Section>
        <div className="grid">
          <div style={{ gridColumn: '1 / span 4' }}>
            <Eyebrow>The Firm</Eyebrow>
          </div>
          <div style={{ gridColumn: '5 / span 7' }}>
            <p className="display display-s" style={{ marginBottom: 40, fontFamily: 'var(--font-serif)' }}>
              DURO Design Group is a full-service architecture and engineering firm working at local, state, and regional levels across the DMV.
            </p>
            <p className="body-l" style={{ marginBottom: 24 }}>
              Our portfolio is anchored in historic preservation and adaptive reuse — buildings that hold public memory and deserve careful stewardship. We work with the Department of General Services, Prince William Water Authority, State Department entities, and mission-driven private clients.
            </p>
            <p className="body-l mute">
              Every drawing that leaves our office carries one signature. Architecture, MEP, structural, civil, and permitting under one roof means schedules don't slip into the gaps between firms, and the same team that designs your building also gets it through review and into the ground.
            </p>
          </div>
        </div>
      </Section>

      {/* Approach pillars */}
      <Section sm data-screen-label="About/Approach">
        <Rule />
        <div style={{ paddingTop: 80 }}>
          <Eyebrow style={{ marginBottom: 64 }}>Approach</Eyebrow>
          <div className="grid" style={{ rowGap: 88 }}>
            {[
              { n: '01', t: 'Integrated by design', d: 'Five disciplines, one accountable team. We carry MEP, structural, civil, and permitting in-house — not as subconsultants, but as colleagues across the studio.' },
              { n: '02', t: 'Stewards of historic fabric', d: 'Most of our work touches buildings older than living memory. We treat them as artifacts first and as projects second — surveying, documenting, and preserving what is there before we add what is new.' },
              { n: '03', t: 'Resilient and net-zero ready', d: 'BEPS, LEED, and net-zero pathways are baked into our MEP scope. We design buildings that will still be efficient in 2050 — not retrofitted to be.' },
              { n: '04', t: 'Accountable to the public', d: 'Our clients are governments and public institutions. We answer to citizens, taxpayers, and the agencies that steward shared resources — and we calibrate our process accordingly.' },
            ].map((p, i) => (
              <div key={p.n} style={{ gridColumn: (i % 2 === 0) ? '1 / span 5' : '7 / span 5' }}>
                <Reveal delay={i * 80}>
                  <div className="display display-l" style={{ color: 'var(--duro-red)', fontWeight: 300, marginBottom: 24, fontSize: 'clamp(72px, 8vw, 112px)' }}>{p.n}</div>
                  <h3 className="display display-s" style={{ marginBottom: 16 }}>{p.t}</h3>
                  <p className="body-m mute" style={{ maxWidth: '40ch' }}>{p.d}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Leadership / credentials */}
      <Section sm data-screen-label="About/Credentials">
        <Rule />
        <div className="grid" style={{ padding: '80px 0' }}>
          <div style={{ gridColumn: '1 / span 4' }}>
            <Eyebrow style={{ marginBottom: 24 }}>Leadership</Eyebrow>
            <p className="body-m mute">Leadership profiles coming soon.</p>
          </div>
          <div style={{ gridColumn: '6 / span 7' }}>
            <Eyebrow style={{ marginBottom: 32 }}>Credentials</Eyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              {['AIA', 'NCARB', 'PE', 'LEED AP', 'AIA|DC Member', 'SAM.gov'].map(c => (
                <div key={c} style={{ paddingTop: 16, borderTop: '1px solid var(--duro-rule)' }}>
                  <div className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>{c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Rule />
      </Section>

      {/* Awards strip */}
      <Section data-screen-label="About/Awards">
        <Eyebrow style={{ marginBottom: 56 }}>Recognition</Eyebrow>
        {[
          { y: '2024', n: 'Urban Land Institute Wavemaker Award', p: 'Justice Thurgood Marshall Center' },
          { y: '2024', n: 'Historic Preservation Review — Approved with Distinction', p: 'Eastern Market Preservation' },
          { y: '2023', n: 'DGS Contractor of the Year — Finalist', p: 'Department of General Services' },
          { y: '2023', n: 'AIA|DC Civic Design — Recognition', p: 'Walter Pierce Park Upgrades' },
        ].map((a, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className="award-row">
              <div className="award-year">{a.y}</div>
              <div className="award-name">{a.n}</div>
              <div className="award-project">{a.p}</div>
            </div>
          </Reveal>
        ))}
      </Section>

      <ClosingCTA
        headline={<>Bring us a <em><span className="u">difficult</span></em> public project.</>}
        body={<>hello@durodesigngroup.com<br/>(202) 491-4948</>}
      />
    </main>
  );
}

// ═══════════ SERVICES ═══════════
function ServicesPage() {
  const services = [
    {
      n: '01', name: 'Architecture',
      photo: 'Walter Pierce Park — pavilion',
      body: 'Full-service architecture for public agencies, cultural institutions, and educational clients. We have led work for the DC Department of General Services and similar agencies across the DMV — from programming and feasibility through construction administration. Our process is calibrated to the way public agencies actually procure, review, and accept work.',
      bullets: ['Programming & feasibility', 'Schematic design', 'Design development', 'Construction documents', 'Construction administration', 'Cost-estimating coordination', 'Stakeholder engagement'],
    },
    {
      n: '02', name: 'Interior Architecture',
      photo: 'Interior — civic finishes detail',
      body: 'Tenant fit-outs, civic-space interiors, and adaptive reuse — coordinated tightly with our MEP and structural teams. Furniture, fixtures, equipment, finishes, signage, lighting, and acoustic planning all under one contract.',
      bullets: ['Space planning & programming', 'Furniture, fixtures, equipment (FF&E)', 'Finishes & materials selection', 'Signage & wayfinding', 'Acoustic & lighting planning'],
    },
    {
      n: '03', name: 'Landscape Architecture',
      photo: 'Walter Pierce Park — site plan',
      body: 'Civic plazas, parks, streetscapes, and site design — always coordinated with our civil engineering team so site drainage, ADA paths, grading, and planting are designed as one. We have completed landscape work for the DC Department of General Services and other municipal clients.',
      bullets: ['Site design & site planning', 'Park & plaza design', 'Streetscape & public-realm', 'Planting design', 'ADA & path-of-travel'],
    },
    {
      n: '04', name: 'MEP Engineering',
      photo: 'Mechanical room — equipment as architecture',
      body: 'In-house mechanical, electrical, and plumbing — not a subconsultant relationship. Our MEP team sits twenty feet from our architects, which means coordination happens at the desk, not in a meeting two weeks later. We deliver energy modeling, BEPS pathways, LEED and net-zero strategies, and the calculations that prove them.',
      bullets: ['Mechanical system design', 'Electrical & lighting design', 'Plumbing system design', 'Fire protection coordination', 'Load calculations & system analysis', 'Energy modeling & BEPS', 'LEED / net-zero pathways'],
    },
    {
      n: '05', name: 'Structural Engineering',
      photo: 'Historic structure — load survey',
      body: 'Historic structure assessments are the most demanding form of structural engineering — every assumption has to be tested, every concealed condition surveyed. Our team works from light-gauge framing through heavy timber, and from seismic retrofit through full structural redesign of buildings that pre-date modern codes.',
      bullets: ['Structural system design', 'Structural analysis & calculations', 'Existing building assessments', 'Renovation & retrofit design', 'Heavy timber, steel, light gauge'],
    },
    {
      n: '06', name: 'Civil Engineering & Site Design',
      photo: 'Site plan — stormwater + grading',
      body: 'Civil work that respects the building. Stormwater management plans, Green Area Ratio compliance, grading, site utilities, and the coordination with landscape architects and DDOT that makes the difference between a site that looks designed and one that looks engineered.',
      bullets: ['Erosion & sediment control plans', 'Stormwater management plans', 'Green Area Ratio (GAR) plans', 'Utility plans', 'Traffic control & public-space plans'],
    },
    {
      n: '07', name: 'Historic Preservation & Adaptive Reuse',
      photo: 'Eastern Market — stonework detail',
      body: 'We have led HPRB, SHPO, and CFA reviews across the District and Maryland — from Section 106 consultation through final treatment. Our preservation work begins with conditions assessments and treatment plans grounded in the Secretary of the Interior\'s Standards. We document what is there, identify what is character-defining, and engineer the interventions that let historic buildings serve their next hundred years.',
      bullets: ['HPRB / SHPO / CFA review', 'Section 106 consultation', 'Conditions assessments', 'Treatment plans & specifications', 'Historic structure reports', 'Adaptive reuse planning'],
    },
    {
      n: '08', name: 'Feasibility & Existing Conditions',
      photo: 'Field survey — assessment in progress',
      body: 'Before scope commitments, before budgets, before the agency commits public dollars — we tell you what is actually there. Existing-conditions documentation, structural assessments, MEP capacity surveys, and feasibility memos that make the next phase defensible.',
      bullets: ['Feasibility studies', 'Existing conditions assessments', 'Pre-design memos', 'Budget & schedule validation', 'Test fits & space studies'],
    },
    {
      n: '09', name: 'Construction Administration',
      photo: 'Site visit — punch list',
      body: 'The same team that designs your building gets it built. Field observation, RFI response, submittal review, change-order management, and substantial-completion certification. CA is where most public-sector projects lose schedule — we treat it as a deliverable, not a courtesy.',
      bullets: ['Field observation & reporting', 'RFI & submittal management', 'Change-order review', 'Pay application review', 'Punch-list & substantial completion'],
    },
    {
      n: '10', name: 'Permitting & Regulatory Strategy',
      photo: 'Permit set — review markup',
      body: 'We pull permits in DC, Maryland, and Virginia regularly. We know the reviewers. We know which questions get asked. We prepare full permit packages, expedite where the law allows, and serve as agency liaison — DCRA, MDE, VDOT, HPRB, DDOT, DC Water.',
      bullets: ['Building permits', 'Stormwater, utility, tree permits', 'Department of Transportation permits', 'DC Water service permits', 'HPRB / CFA submissions', 'Agency liaison'],
    },
    {
      n: '11', name: 'Permit Expediting',
      photo: 'Plan-review counter',
      body: 'In-house expediting — not a referral, not a separate vendor. The same team that drew the documents walks them through plan review. This shortens the cycle and eliminates the most common cause of permit delays: a question the original designer needs to answer.',
      bullets: ['Plan-review accompaniment', 'Comment-response coordination', 'Multi-agency walk-through', 'Revision package preparation'],
    },
  ];

  return (
    <main data-screen-label="03 Services">
      {/* Hero */}
      <section className="section-sm" style={{ paddingTop: 'clamp(40px, 6vw, 80px)' }}>
        <Shell>
          <Eyebrow red style={{ marginBottom: 40 }}>Services · Capabilities Statement</Eyebrow>
          <div className="grid">
            <div style={{ gridColumn: '1 / span 9' }}>
              <Reveal>
                <h1 className="display display-xl" style={{ marginBottom: 48 }}>
                  Eleven services.<br/>One roof.<br/>One <em><span className="u">accountable</span></em> team.
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="body-l mute" style={{ maxWidth: '54ch' }}>
                  Most architecture firms managing a public-sector project run three to seven subconsultants. We don't. Every drawing that leaves our office carries one signature and one set of stamps — ours.
                </p>
              </Reveal>
            </div>
          </div>
        </Shell>
      </section>

      {/* Featured offering — Preservation Pre-Screen */}
      <Section sm>
        <Reveal>
          <div style={{ border: '1px solid var(--duro-rule)', padding: 'clamp(40px, 6vw, 80px)' }}>
            <div className="grid" style={{ alignItems: 'end' }}>
              <div style={{ gridColumn: '1 / span 7' }}>
                <Eyebrow red style={{ marginBottom: 32 }}>Featured · Fixed-Fee</Eyebrow>
                <h3 className="display display-m" style={{ marginBottom: 24, maxWidth: '14ch' }}>
                  The Preservation Pre-Screen.
                </h3>
                <p className="body-l mute" style={{ maxWidth: '46ch' }}>
                  Two weeks. One fixed fee. A complete HPRB / SHPO / CFA pre-submission package: feasibility memo, regulatory matrix, conditions assessment, and a written go / no-go recommendation. For developers and agencies asking whether a building can be saved.
                </p>
              </div>
              <div style={{ gridColumn: '9 / span 4' }}>
                <div style={{ marginBottom: 32 }}>
                  <div className="serif" style={{ fontSize: 80, lineHeight: 0.9, letterSpacing: '-0.04em' }}>2</div>
                  <div className="smallcaps mute" style={{ marginTop: 8 }}>Weeks · Fixed fee</div>
                </div>
                <TextLink to="/contact">Request a pre-screen</TextLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Disciplines */}
      {services.map((s, i) => (
        <section key={s.n} className="section-sm" style={{ paddingTop: 0 }} data-screen-label={`Services/${s.name}`}>
          <Shell>
            <Rule />
            <div className="grid" style={{ paddingTop: 80, paddingBottom: 24, alignItems: 'start' }}>
              <div style={{ gridColumn: '1 / span 1' }}>
                <div className="serif" style={{ fontSize: 56, lineHeight: 0.9, color: 'var(--duro-red)' }}>{s.n}</div>
              </div>
              <div style={{ gridColumn: '2 / span 5' }}>
                <Reveal>
                  <h2 className="display display-m" style={{ marginBottom: 32, maxWidth: '14ch' }}>{s.name}</h2>
                  <p className="body-l" style={{ marginBottom: 32 }}>{s.body}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                    {s.bullets.map(b => (
                      <span key={b} className="smallcaps mute" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ color: 'var(--duro-red)' }}>·</span> {b}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </div>
              <div style={{ gridColumn: '8 / span 5' }}>
                <Reveal>
                  <PhotoWell
                    id={`svc-${s.n}`}
                    placeholder={s.photo}
                    ratio="4/5"
                  />
                </Reveal>
              </div>
            </div>
          </Shell>
        </section>
      ))}

      {/* Sectors */}
      <Section data-screen-label="Services/Sectors">
        <Rule />
        <div style={{ padding: '64px 0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 64px', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 48 }}>
            <Eyebrow>Sectors Served</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px' }}>
              {['Federal', 'State', 'Municipal', 'Cultural Institutions', 'Educational', 'Civic', 'Mission-Driven Private'].map(s => (
                <span key={s} className="serif" style={{ fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.01em' }}>{s}</span>
              ))}
            </div>
          </div>
          <Rule />
          <div style={{ paddingTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            <div>
              <Eyebrow style={{ marginBottom: 16 }}>Procurement</Eyebrow>
              <p className="body-m">SAM.gov-registered. AIA|DC member. DSLBD CBE — verification in progress. NAICS codes 541310 · 541330 · 541320 · 541350 · 541410. UEI, CAGE Code, and SF-330 portfolio available on request.</p>
            </div>
            <div>
              <Eyebrow style={{ marginBottom: 16 }}>Geography</Eyebrow>
              <p className="body-m">Washington, DC · Maryland · Virginia. Permitting active across DCRA, DOB, CFA, DDOT, DC Water, MDE, and VDOT. Studio at 5112 11th Street NE, Washington, DC 20011.</p>
            </div>
          </div>
        </div>
        <Rule />
      </Section>

      <ClosingCTA
        headline={<>Bring us the project nobody else will <em><span className="u">sign</span></em>.</>}
        body={<>hello@durodesigngroup.com<br/>(202) 491-4948</>}
      />
    </main>
  );
}

// ═══════════ PROJECTS INDEX ═══════════
function ProjectsPage() {
  const { open } = useProjectOverlay();
  return (
    <main data-screen-label="04 Projects">
      <section className="section-sm" style={{ paddingTop: 'clamp(40px, 6vw, 80px)' }}>
        <Shell>
          <Eyebrow red style={{ marginBottom: 40 }}>Projects · Selected</Eyebrow>
          <div className="grid" style={{ alignItems: 'end' }}>
            <div style={{ gridColumn: '1 / span 9' }}>
              <Reveal>
                <h1 className="display display-xl" style={{ marginBottom: 48 }}>
                  Buildings that carry<br/>a <em><span className="u">civic weight</span></em>.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="body-l mute" style={{ maxWidth: '52ch' }}>
                  A chronologically-ordered selection of recent work — public agencies, cultural institutions, and historic structures across DC, Maryland, and Virginia.
                </p>
              </Reveal>
            </div>
          </div>
        </Shell>
      </section>

      {/* Stacked project entries */}
      <section style={{ paddingTop: 'clamp(80px, 10vw, 140px)' }}>
        {PROJECTS.map((p, i) => (
          <article key={p.id} style={{ paddingBottom: 'clamp(80px, 10vw, 160px)' }} data-screen-label={`Projects/${p.title}`}>
            <Shell>
              <Reveal>
                <div
                  onClick={() => open(p.id)}
                  style={{ cursor: 'pointer' }}
                  data-cursor="view"
                  data-cursor-label="View case"
                >
                  <MediaWell
                    id={`pj-${p.id}`}
                    placeholder={`${p.title} — primary photo or video`}
                    src={PROJECT_IMAGES[p.id]?.hero}
                    videoSrc={PROJECT_VIDEOS[p.id]?.hero}
                    ratio="16/9"
                  />
                </div>
              </Reveal>
              <div className="grid" style={{ marginTop: 48 }}>
                <div style={{ gridColumn: '1 / span 6' }}>
                  {p.award && <Eyebrow red style={{ marginBottom: 20 }}>{p.award}</Eyebrow>}
                  <h2 className="display display-m" style={{ marginBottom: 16 }}>
                    <span className="project-title">{p.title}</span>
                  </h2>
                  <div className="smallcaps" style={{ color: 'var(--duro-red)', marginBottom: 16 }}>{p.client}</div>
                  <p className="body-l" style={{ marginBottom: 24, maxWidth: '40ch' }}>{p.dek}</p>
                  <ProjectOpenButton id={p.id} />
                </div>
                <div style={{ gridColumn: '8 / span 5' }}>
                  <div className="smallcaps mute" style={{ lineHeight: 2 }}>
                    <div><span style={{ color: 'var(--duro-ink)' }}>Sector</span>  ·  {p.sector}</div>
                    <div><span style={{ color: 'var(--duro-ink)' }}>Location</span>  ·  {p.location}</div>
                    <div><span style={{ color: 'var(--duro-ink)' }}>Size</span>  ·  {p.sf}</div>
                    <div><span style={{ color: 'var(--duro-ink)' }}>Cost</span>  ·  {p.cost}</div>
                    <div><span style={{ color: 'var(--duro-ink)' }}>Status</span>  ·  {p.status}</div>
                    <div style={{ marginTop: 12 }}>
                      <span style={{ color: 'var(--duro-ink)' }}>Services</span>
                      <div style={{ marginTop: 4 }}>{p.services.join(' · ')}</div>
                    </div>
                    {p.permits && p.permits.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <span style={{ color: 'var(--duro-ink)' }}>Permitting</span>
                        <div style={{ marginTop: 4 }}>{p.permits.join(' · ')}</div>
                      </div>
                    )}
                  </div>
                  <p className="body-m" style={{ marginTop: 32 }}>{p.blurb}</p>
                </div>
              </div>
            </Shell>
          </article>
        ))}
      </section>

      {/* Archive prompt */}
      <Section sm>
        <Rule />
        <div style={{ padding: '64px 0' }} className="grid">
          <div style={{ gridColumn: '1 / span 7' }}>
            <h3 className="display display-s" style={{ marginBottom: 16 }}>More projects in the archive.</h3>
            <p className="body-m mute" style={{ maxWidth: '40ch' }}>For federal procurement officers and prime contractors — request our full SF-330 portfolio.</p>
          </div>
          <div style={{ gridColumn: '9 / span 4', alignSelf: 'end' }}>
            <TextLink to="/contact">Request portfolio</TextLink>
          </div>
        </div>
        <Rule />
      </Section>

      <ClosingCTA
        headline={<><em><span className="u">Public</span></em> work, made permanent.</>}
        body={<>5112 11th Street NE<br/>Washington, DC 20011</>}
      />
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
      <section className="section-sm" style={{ paddingTop: 'clamp(40px, 6vw, 80px)' }}>
        <Shell>
          <Eyebrow red style={{ marginBottom: 40 }}>Contact</Eyebrow>
        </Shell>
      </section>

      <Section style={{ paddingTop: 0 }}>
        <div className="grid" style={{ alignItems: 'start', columnGap: 'clamp(40px, 6vw, 96px)' }}>
          {/* Left column — editorial */}
          <div style={{ gridColumn: '1 / span 6' }}>
            <Reveal>
              <h1 className="display display-l" style={{ marginBottom: 48 }}>
                Tell us about<br/>your <em><span className="u">project</span></em>.
              </h1>
              <p className="body-l" style={{ marginBottom: 56, maxWidth: '36ch' }}>
                We work with public agencies, cultural institutions, and mission-driven private clients across DC, Maryland, and Virginia. New project inquiries, RFP responses, and SF-330 portfolio requests all start the same way — a short note and a 30-minute call.
              </p>
              <Rule style={{ margin: '40px 0' }} />
              <div className="body-m" style={{ lineHeight: 1.9 }}>
                <div className="serif" style={{ fontSize: 22, marginBottom: 12 }}>DURO Design Group, LLC</div>
                <div>5112 11th Street NE</div>
                <div>Washington, DC 20011</div>
                <div style={{ marginTop: 24 }}>
                  <span className="mute" style={{ marginRight: 12 }}>t.</span>(202) 491-4948
                </div>
                <div>
                  <span className="mute" style={{ marginRight: 12 }}>e.</span>hello@durodesigngroup.com
                </div>
              </div>
              <Rule style={{ margin: '40px 0' }} />

              {/* Procurement block */}
              <Eyebrow style={{ marginBottom: 24 }}>Procurement & Contracting</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 12, columnGap: 24 }}>
                {[
                  ['Registration', 'SAM.gov — Active'],
                  ['Membership', 'AIA|DC'],
                  ['Certification', 'DSLBD CBE — Verifying'],
                  ['UEI', 'Available on request'],
                  ['CAGE Code', 'Available on request'],
                ].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <div className="smallcaps mute">{k}</div>
                    <div className="body-s">{v}</div>
                  </React.Fragment>
                ))}
              </div>

              <Eyebrow style={{ marginTop: 40, marginBottom: 16 }}>NAICS Codes</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                  ['541310', 'Architectural Services'],
                  ['541330', 'Engineering Services'],
                  ['541320', 'Landscape Architecture'],
                  ['541350', 'Building Inspection'],
                  ['541410', 'Interior Design'],
                ].map(([c, l]) => (
                  <div key={c}>
                    <div className="serif" style={{ fontSize: 20, letterSpacing: '-0.01em' }}>{c}</div>
                    <div className="smallcaps mute" style={{ marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right column — form */}
          <div style={{ gridColumn: '8 / span 5' }}>
            <Reveal delay={150}>
              {!submitted ? (
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                  <div>
                    <label className="field-label">Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="field-label">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div>
                    <label className="field-label">Agency / Organization</label>
                    <input type="text" value={form.org} onChange={e => setForm({...form, org: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label">Inquiry type</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} required>
                      <option value="">Select one</option>
                      <option>RFP / SF-330 response</option>
                      <option>Public agency — direct inquiry</option>
                      <option>Cultural institution</option>
                      <option>Educational</option>
                      <option>Prime contractor — teaming</option>
                      <option>Private — mission-driven</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Tell us about your project</label>
                    <textarea rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <button type="submit" className="btn-outline">Send inquiry  →</button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: '64px 0' }}>
                  <Eyebrow red style={{ marginBottom: 32 }}>Received</Eyebrow>
                  <p className="display display-s" style={{ maxWidth: '20ch' }}>
                    Thanks. We'll respond within one business day.
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
  HomePage, AboutPage, ServicesPage, ProjectsPage, ContactPage,
  PROJECTS, PROJECT_BY_ID,
});
