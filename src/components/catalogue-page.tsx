import { useEffect, useMemo, useRef, useState } from "react";
import { Mail, MapPin, Phone, Search, ShieldCheck, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "@/data/catalogue";

const PHONE = "8175903666";
const PHONE_HREF = "tel:+918175903666";
const EMAIL = "mirhajchemicalspvtltd@gmail.com";

const SAFETY = [
  "Read the leaflet before using any product.",
  "Do not mix with bare hands.",
  "Keep away from food, empty food containers and animal feed.",
  "Avoid contact with mouth, eyes and skin.",
  "Avoid breathing spray mist. Spray with the wind, not against it.",
  "Do not smoke, eat, drink or chew while spraying.",
  "Stir spray mixtures with a wooden stick.",
  "Wear full protective clothing: gloves, goggles and a face mask.",
  "Keep out of the reach of children.",
  "Store cool and dry, away from heat and open flame.",
  "If swallowed, or if poisoning symptoms appear, call a physician immediately.",
];

const FLASH_SCENES: FlashCard[] = [
  { src: "/flash/farmer.jpg", kicker: "Farmer", title: "Spray in the field", fit: "cover" },
  { src: "/flash/cabbage-spray.jpg", kicker: "Farmer", title: "Protected spray", fit: "cover" },
  { src: "/flash/wheat.jpg", kicker: "Crop", title: "Wheat", fit: "cover" },
  { src: "/flash/field-team.jpg", kicker: "Farmer", title: "In the standing crop", fit: "cover" },
  { src: "/flash/chilli.jpg", kicker: "Crop", title: "Chilli and cotton", fit: "cover" },
  { src: "/flash/paddy-spray.jpg", kicker: "Farmer", title: "Spraying the paddy", fit: "cover" },
  { src: "/flash/field.jpg", kicker: "Farmer", title: "Across the standing crop", fit: "cover" },
];

const FLASH_PACKS: FlashCard[] = [
  ["panther", "Panther"],
  ["supreme", "Supreme"],
  ["pound-up", "Pound Up"],
  ["mira-71", "Mira-71"],
  ["pookie-zyme", "Pookie Zyme"],
  ["ballistic", "Ballistic"],
  ["cluster-75", "Cluster-75"],
  ["futerra", "Futerra"],
  ["miracle", "Miracle"],
  ["jaishu", "Jaishu"],
].map(([slug, title]) => ({
  src: `/products/${slug}.jpg`,
  kicker: "Pack",
  title,
  fit: "contain" as const,
}));

type FlashCard = {
  src: string;
  kicker: string;
  title: string;
  fit: "cover" | "contain";
};

function RollingRow({
  cards,
  reverse,
  full,
}: {
  cards: FlashCard[];
  reverse?: boolean;
  full?: boolean;
}) {
  const loop = [...cards, ...cards];
  return (
    <div className="overflow-hidden">
      <div className={`${reverse ? "roll-right" : "roll-left"} flex w-max gap-4`}>
        {loop.map((card, index) => {
          const copy = index >= cards.length;
          return (
            <figure key={`${card.src}-${index}`} className={full ? "w-[min(88vw,40rem)] shrink-0" : "w-40 shrink-0"} aria-hidden={copy}>
              <img
                src={card.src}
                alt={copy ? "" : card.title}
                className={
                  full
                    ? "h-64 w-full rounded-2xl bg-white object-contain sm:h-80"
                    : `h-28 w-full rounded-2xl bg-paper ${card.fit === "cover" ? "object-cover object-center" : "object-contain p-2"}`
                }
              />
              <figcaption className="mt-2 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">{card.kicker}</span>
                <span className="mt-0.5 block text-sm text-paper">{card.title}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
const NANO = [
  "19:19:19",
  "13:00:45",
  "00:00:50",
  "20:20:20",
  "00:52:34",
  "12:61:00",
  "13:40:13",
];

function categoryLabel(id: Category) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function CataloguePage() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (!q) return true;
      return [p.name, p.technical, p.crops, p.targets, p.summary, categoryLabel(p.category)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [filter, query]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <a href="#top" className="shrink-0">
            <img src="/brand/logo-complete.jpg" alt="Mirhaj Chemicals" className="h-16 w-auto object-contain object-left" />
          </a>
          <nav className="ml-auto flex items-center gap-1 overflow-x-auto text-sm font-medium">
            <a className="rounded-full px-3 py-2 text-ink/80 hover:bg-ink/5 hover:text-ink" href="#range">
              Range
            </a>
            <a className="rounded-full px-3 py-2 text-ink/80 hover:bg-ink/5 hover:text-ink" href="/team">
              Team
            </a>
            <a className="rounded-full px-3 py-2 text-ink/80 hover:bg-ink/5 hover:text-ink" href="#about">
              About
            </a>
            <a className="rounded-full px-3 py-2 text-ink/80 hover:bg-ink/5 hover:text-ink" href="#safety">
              Safety
            </a>
            <a
              className="ml-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-teal text-paper sm:w-auto sm:gap-2 sm:px-4"
              href={PHONE_HREF}
              aria-label={`Call customer care ${PHONE}`}
            >
              <Phone className="size-4" aria-hidden />
              <span className="hidden sm:inline">{PHONE}</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                ISO 9001:2015 · Lucknow
              </p>
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
                Your trusted crop protector
              </h1>
              <p className="mt-3 font-display text-xl text-gold">सुरक्षित फसल, बेहतर भविष्य</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#range"
                  className="inline-flex min-h-11 items-center rounded-full bg-teal px-5 text-sm font-semibold text-paper"
                >
                  See the packs
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-11 items-center rounded-full border border-paper/30 px-5 text-sm font-semibold text-paper"
                >
                  Ask for a dealer
                </a>
              </div>
            </div>
          </div>
          <div className="roll-mask flex flex-col gap-6 pb-10" aria-label="Farmers and crops rolling across the screen">
            <RollingRow cards={FLASH_SCENES} full />
            <RollingRow cards={FLASH_PACKS} reverse />
          </div>
        </section>

        <section id="range" className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal">Catalogue</p>
              <h2 className="mt-1 font-display text-3xl">Bottles and packs</h2>
            </div>
            <p className="text-sm text-ink/70">{visible.length} of {PRODUCTS.length} products</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/50" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, crop or technical"
                className="min-h-11 w-full rounded-full border border-ink/15 bg-card py-2 pr-4 pl-10 text-sm outline-none focus:border-teal"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Filter by category">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                All
              </FilterChip>
              {CATEGORIES.map((category) => (
                <FilterChip
                  key={category.id}
                  active={filter === category.id}
                  onClick={() => setFilter(category.id)}
                >
                  {category.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-ink/10 bg-card px-6 py-10 text-center text-ink/70">
              No packs match that search. Try a crop, a pest, or a technical name.
            </p>
          ) : (
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {visible.map((product) => (
                <li key={product.slug}>
                  <button
                    type="button"
                    className="pack-card flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-card text-left transition duration-200 hover:-translate-y-0.5 hover:border-teal/50"
                    onClick={() => setSelected(product)}
                  >
                    <span className="flex aspect-4/5 items-center justify-center bg-paper p-3">
                      <img
                        src={`/products/${product.slug}.jpg`}
                        alt={`${product.name} pack`}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </span>
                    <span className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal">
                        {categoryLabel(product.category)}
                      </span>
                      <span className="font-display text-lg leading-tight">{product.name}</span>
                      <span className="text-sm leading-snug text-ink/70">{product.technical}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-card">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">The full line</p>
            <h2 className="mt-1 font-display text-3xl">From the catalogue lineup</h2>
            <img
              src="/brochure/lineup.jpg"
              alt="Mirhaj product lineup of bottles, pouches and cartons"
              className="mt-6 w-full rounded-2xl border border-ink/10"
            />
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal">About</p>
              <h2 className="mt-1 font-display text-3xl">Mirhaj Chemicals Private Limited</h2>
              <p className="mt-4 text-ink/80">
                We produce insecticides, fungicides, herbicides and plant growth regulators for a
                wide range of crops and soils. The range is made with laboratory support, production
                capacity and a field team that works with distributors, dealers and farmers.
              </p>
              <p className="mt-3 text-ink/80">
                The aim is straightforward: quality crop protection that helps farmers raise yield
                and crop quality, at a price that holds up as value for money.
              </p>
            </div>
            <dl className="grid gap-4">
              <AboutFact title="Mission">
                Supply products that help farmers increase yields and crop quality, for food, feed,
                fibre and energy.
              </AboutFact>
              <AboutFact title="Vision">
                Results for customers across a broad crop-protection range. We believe in value for
                money.
              </AboutFact>
              <AboutFact title="Mark">MCPL · ISO 9001:2015 certified company</AboutFact>
            </dl>
          </div>
        </section>

        <section id="safety" className="bg-ink text-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                <ShieldCheck className="size-4" aria-hidden />
                Product safety
              </p>
              <h2 className="mt-2 font-display text-3xl">Read the leaflet. Then spray.</h2>
              <ul className="mt-5 space-y-2 text-sm text-paper/85">
                {SAFETY.map((line) => (
                  <li key={line} className="border-l-2 border-gold pl-3">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-paper/70">
                Dispose of packages, surplus and washings so they do not pollute the environment or
                water. Poison labels on the pack — blue, yellow, green and red — must be followed.
              </p>
            </div>
            <div className="rounded-2xl bg-paper p-6 text-ink">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal">Coming soon</p>
              <h3 className="mt-1 font-display text-2xl">NPK nano fertilizer</h3>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {NANO.map((grade) => (
                  <li key={grade} className="rounded-xl border border-ink/10 bg-card px-3 py-2 font-medium">
                    Nano {grade}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink/70">
                Listed in the April 2026 catalogue as coming soon. Ask customer care before you plan
                a season around them.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Contact</p>
          <h2 className="mt-1 font-display text-3xl">Talk to customer care</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a href={PHONE_HREF} className="rounded-2xl border border-ink/10 bg-card p-5 hover:border-teal/50">
              <Phone className="size-5 text-teal" aria-hidden />
              <p className="mt-3 text-sm text-ink/60">Customer care</p>
              <p className="font-display text-2xl">{PHONE}</p>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="rounded-2xl border border-ink/10 bg-card p-5 hover:border-teal/50"
            >
              <Mail className="size-5 text-teal" aria-hidden />
              <p className="mt-3 text-sm text-ink/60">Email</p>
              <p className="text-sm font-medium break-all">{EMAIL}</p>
            </a>
            <div className="rounded-2xl border border-ink/10 bg-card p-5">
              <MapPin className="size-5 text-teal" aria-hidden />
              <p className="mt-3 text-sm text-ink/60">Works</p>
              <p className="text-sm leading-relaxed">
                E-5/130 Amrapali Yojna, Awas Vikas Hardoi Road, Amethia Salempur, Lucknow 226101,
                Uttar Pradesh
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink/60">
            Pack photographs and directions are taken from the Mirhaj Chemicals catalogue, April
            2026. Always follow the registered label on the container you buy. This page is not a
            substitute for that label, and it is not an offer to sell a restricted product without
            the required licence.
          </p>
        </section>
      </main>

      <footer className="border-t border-ink/10 px-4 py-6 text-center text-xs text-ink/60">
        Mirhaj Chemicals Private Limited · MCPL · Lucknow
      </footer>

      {selected ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/70 sm:items-center sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pack-title"
            className="max-h-dvh w-full overflow-y-auto rounded-t-3xl bg-card text-ink sm:max-w-3xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              <div className="flex items-center justify-center bg-paper p-6">
                <img
                  src={`/products/${selected.slug}.jpg`}
                  alt={`${selected.name} pack`}
                  className="max-h-96 w-full object-contain"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                      {categoryLabel(selected.category)}
                    </p>
                    <h3 id="pack-title" className="mt-1 font-display text-3xl leading-tight">
                      {selected.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink/70">{selected.technical}</p>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15"
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-4 text-sm leading-relaxed">{selected.summary}</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <Fact label="Crops" value={selected.crops} />
                  <Fact label="Used on" value={selected.targets} />
                  <Fact label="Dosage" value={selected.dosage} />
                  <Fact label="Packing" value={selected.packing} />
                </dl>
                <a
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-teal px-5 text-sm font-semibold text-paper"
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Enquiry: ${selected.name}`)}`}
                >
                  Enquire about this pack
                </a>
                <p className="mt-3 text-xs text-ink/60">
                  Dose and packing are as printed in the catalogue. Confirm on the container label.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "min-h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-medium text-paper"
          : "min-h-11 shrink-0 rounded-full border border-ink/15 bg-card px-4 text-sm font-medium text-ink"
      }
    >
      {children}
    </button>
  );
}

function AboutFact({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-card p-5">
      <dt className="text-xs font-semibold uppercase tracking-widest text-gold">{title}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-ink/80">{children}</dd>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
