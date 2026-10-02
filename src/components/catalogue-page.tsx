import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Mail, MapPin, Phone, Search, ShieldCheck, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, packPhoto, productsInIndex, type Category, type Product } from "@/data/catalogue";

const PHONE = "8175903666";
const PHONE_HREF = "tel:+918175903666";
const EMAIL = "info@mirhajchemicals.com";
const WHATSAPP = "https://wa.me/918175903666";
const FACEBOOK = "https://www.facebook.com/share/18XYEzAmu8/";
const TWITTER = "https://x.com/mirhajchemicals";
const INSTAGRAM = "https://www.instagram.com/mirhajchemicals";

const TABS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About us" },
  { href: "#range", label: "Our Products" },
  { href: "#catalogue", label: "Our catalogue" },
  { href: "#gallery", label: "Our gallery" },
  { href: "#contact", label: "Contact us" },
  { href: "#careers", label: "Careers" },
];

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
  { src: "/flash/cabbage-spray.jpg?v=crop", kicker: "Farmer", title: "In the standing crop", fit: "cover", quote: "Mirhaj Chemicals stands with the farmer through every season, from the first spray in the standing crop to the last sack of the harvest." },
  { src: "/flash/field-team.jpg?v=crop", kicker: "Farmer", title: "The harvest", fit: "cover", quote: "A good season begins in the soil. Mirhaj Chemicals keeps the field protected so the crop can reach the market, and the farmer can keep his year." },
  { src: "/flash/mustard.jpg?v=flower", kicker: "Mustard", title: "The mustard crop", fit: "cover", quote: "When the mustard comes into flower, Mirhaj Chemicals has already stood with that field from the first leaf to the yellow bloom." },
  { src: "/flash/paddy.jpg?v=paddy2", kicker: "Paddy", title: "The paddy crop", fit: "cover", quote: "In the standing paddy, Mirhaj Chemicals keeps the crop safe from the nursery to the full grain." },
  { src: "/flash/wheat-field.jpg?v=wheat", kicker: "Wheat", title: "The wheat crop", fit: "cover", quote: "From the green wheat to the ripe ear, Mirhaj Chemicals stays with the field until the harvest is home." },
];

type FlashCard = {
  src: string;
  kicker: string;
  title: string;
  fit: "cover" | "contain";
  quote: string;
};

const NANO = [
  "19:19:19",
  "13:00:45",
  "00:00:50",
  "20:20:20",
  "00:52:34",
  "12:61:00",
  "13:40:13",
];

function SocialIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", className: "size-6", fill: "currentColor", "aria-hidden": true as const };
  if (name === "WhatsApp") {
    return (
      <svg {...common}>
        <path d="M20 11.5A8.5 8.5 0 0 1 7.1 18.6L4 20l1.5-3A8.5 8.5 0 1 1 20 11.5Zm-8.5 7a7 7 0 0 0 3.5-.9l.3-.2 2.1.6-.6-2 .2-.3A7 7 0 1 0 11.5 18.5Zm3.8-5.2c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.5.1-.5.7-.7.8-.2.2-.4.1a5.7 5.7 0 0 1-1.7-1 6.3 6.3 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.4.1-.2a.4.4 0 0 0 0-.4c0-.1-.5-1.2-.7-1.6s-.3-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.8 4.3 4.3 0 0 0 .9 2.3 9.8 9.8 0 0 0 3.8 3.3 4.4 4.4 0 0 0 2.5.5 2.1 2.1 0 0 0 1.4-1 1.7 1.7 0 0 0 .1-1c-.1-.1-.2-.1-.4-.2Z" />
      </svg>
    );
  }
  if (name === "Facebook") {
    return (
      <svg {...common}>
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
      </svg>
    );
  }
  if (name === "X") {
    return (
      <svg {...common}>
        <path d="M17.6 3H20l-6.2 7.1L21 21h-5.6l-4.4-6.1L6.2 21H3.7l6.6-7.6L3 3h5.7l4 5.6L17.6 3Zm-1 16.2h1.6L7.5 4.7H5.8l10.8 14.5Z" />
      </svg>
    );
  }
  if (name === "Instagram") {
    return (
      <svg {...common}>
        <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.3-2.9a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.2.3 6.8 4.6 6.8-4.6H5.2Zm13.3 1.7-6 4a1.2 1.2 0 0 1-1.3 0l-6-4V17.5c0 .2.1.3.3.3h13c.2 0 .3-.1.3-.3V8.5Z" />
    </svg>
  );
}

function SiteHeader() {
  const social = [
    { name: "WhatsApp", href: WHATSAPP, color: "#25D366" },
    { name: "Facebook", href: FACEBOOK, color: "#1877F2" },
    { name: "X", href: TWITTER, color: "#111111" },
    { name: "Instagram", href: INSTAGRAM, color: "#E1306C" },
    { name: "Email", href: `mailto:${EMAIL}`, color: "#0c4f86" },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <a href="#top" className="shrink-0">
          <img src="/brand/logo-complete.jpg" alt="Mirhaj Chemicals" className="h-14 w-auto object-contain object-left" />
        </a>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <div className="flex items-center gap-1.5">
            {social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={item.name}
                title={item.name}
                className="inline-flex size-10 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: item.color }}
              >
                <SocialIcon name={item.name} />
              </a>
            ))}
          </div>
          <a
            href="#enquiry"
            className="inline-flex min-h-12 items-center rounded-full bg-[#d31212] px-5 text-base font-bold text-white"
          >
            Enquiry now
          </a>
        </div>
        <a
          href="#enquiry"
          className="ml-auto inline-flex min-h-12 items-center rounded-full bg-[#d31212] px-5 text-base font-bold text-white sm:hidden"
        >
          Enquiry now
        </a>
      </div>
      <nav aria-label="Site" className="bg-transparent">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-3 py-2">
          {TABS.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className="shrink-0 px-2 py-1 text-sm font-black tracking-tight text-black hover:text-[#0c4f86]"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="flex items-center justify-center gap-2 border-b border-[#0c4f86]/30 bg-white px-3 py-2 sm:hidden">
        {social.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={item.name}
            className="inline-flex size-11 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: item.color }}
          >
            <SocialIcon name={item.name} />
          </a>
        ))}
      </div>
    </header>
  );
}

const HERO_QUOTES = [
  "Mirhaj Chemicals stands with the farmer through every season, from the first spray in the standing crop to the last sack of the harvest.",
  "A good season begins in the soil. Mirhaj Chemicals keeps the field protected so the crop can reach the market, and the farmer can keep his year.",
  "When the mustard comes into flower, Mirhaj Chemicals has already stood with that field from the first leaf to the yellow bloom.",
  "In the standing paddy, Mirhaj Chemicals keeps the crop safe from the nursery to the full grain.",
  "From the green wheat to the ripe ear, Mirhaj Chemicals stays with the field until the harvest is home.",
];

function FlashStage() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % FLASH_SCENES.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, []);

  const scene = FLASH_SCENES[index] ?? FLASH_SCENES[0];

  return (
    <div className="relative h-[88vh] min-h-[620px] overflow-hidden bg-[#1a120c]">
      <img
        key={scene.src}
        src={scene.src}
        alt={scene.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <p className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-3xl font-black leading-snug tracking-tight text-[#e7c56a] sm:px-16 sm:text-5xl md:text-6xl" style={{ textShadow: "0 3px 18px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)" }}>
        <span className="max-w-5xl">{scene.quote}</span>
      </p>
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
        {FLASH_SCENES.map((card, i) => (
          <button
            key={card.src}
            type="button"
            aria-label={card.title}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}

function categoryLabel(id: Category) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function CataloguePage() {
  const [openIds, setOpenIds] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const searching = query.trim().length > 0;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORIES.map((category, index) => ({
      ...category,
      number: index + 1,
      items: productsInIndex(
        PRODUCTS.filter((product) => {
          if (product.category !== category.id) return false;
          if (!q) return true;
          return [product.name, product.technical, product.crops, product.targets, product.summary, category.label]
            .join(" ")
            .toLowerCase()
            .includes(q);
        }),
      ),
    }));
  }, [query]);

  function toggleCategory(id: Category) {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  useEffect(() => {
    if (!searching) return;
    setOpenIds(groups.filter((group) => group.items.length > 0).map((group) => group.id));
  }, [searching, groups]);

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
      <SiteHeader />

      <main id="top">
        <section className="bg-[#1a120c] text-white">
          <FlashStage />
        </section>

        <section className="bg-paper" aria-label="What we do">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
            {[
              {
                href: "#range",
                src: "/flash/cabbage-spray.jpg?v=crop",
                kicker: "The range",
                title: "Packs for the crop in front of you",
                action: "See the products",
              },
              {
                href: "#about",
                src: "/flash/field-team.jpg?v=crop",
                kicker: "The company",
                title: "Made for dealers and farmers",
                action: "About us",
              },
              {
                href: "#enquiry",
                src: "/flash/cabbage-spray.jpg?v=crop",
                kicker: "The field",
                title: "Ask before the season starts",
                action: "Enquiry now",
              },
            ].map((card) => (
              <a key={card.href} href={card.href} className="group overflow-hidden rounded-3xl bg-ink text-paper">
                <img src={card.src} alt="" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{card.kicker}</p>
                  <h2 className="mt-2 font-display text-2xl leading-tight">{card.title}</h2>
                  <p className="mt-4 text-sm font-semibold text-white/80 group-hover:text-white">{card.action}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="range" className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Catalogue</p>
          <h2 className="mt-1 font-display text-3xl">Our product</h2>

          <label className="relative mt-6 block max-w-xl">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, crop or technical"
              className="min-h-11 w-full rounded-full border border-ink/15 bg-card py-2 pr-4 pl-10 text-sm outline-none focus:border-teal"
            />
          </label>

          <div className="mt-8 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-card">
            {groups.map((group) => {
              const shown = openIds.includes(group.id);
              const panelId = `products-${group.id}`;
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    aria-expanded={shown}
                    aria-controls={panelId}
                    className={`flex min-h-14 w-full items-center justify-between gap-4 px-4 py-4 text-left transition sm:px-6 ${shown ? "bg-teal text-paper" : "hover:bg-paper"}`}
                    onClick={() => toggleCategory(group.id)}
                  >
                    <span className="font-display text-2xl">
                      {group.number}. {group.label}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={`size-6 shrink-0 transition-transform duration-300 ${shown ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={panelId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${shown ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden" inert={shown ? undefined : true}>
                      {group.items.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-ink/70 sm:px-6">No packs in this group match that search.</p>
                      ) : (
                        <ul className="grid grid-cols-2 gap-3 px-3 py-6 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-4">
                          {group.items.map((product) => (
                            <li key={product.slug}>
                              <button
                                type="button"
                                className="pack-card flex h-full w-full flex-col rounded-2xl border border-ink/10 bg-paper text-left transition duration-200 hover:-translate-y-0.5 hover:border-teal/50"
                                onClick={() => setSelected(product)}
                              >
                                <span className="relative block aspect-[3/4] w-full">
                                  <img
                                    src={packPhoto(product.slug)}
                                    alt={`${product.name} pack`}
                                    className="absolute inset-0 h-full w-full object-contain p-2"
                                    loading="lazy"
                                  />
                                </span>
                                <span className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                                  <span className="font-display text-lg leading-tight">{product.name}</span>
                                  <span className="text-sm leading-snug text-ink/70">{product.technical}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {searching && groups.every((group) => group.items.length === 0) ? (
            <p className="mt-6 text-sm text-ink/70">No packs match that search. Try a crop, a pest, or a technical name.</p>
          ) : null}
        </section>

        <section id="catalogue" className="bg-card">
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

        <section id="gallery" className="bg-card">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">Our gallery</p>
            <h2 className="mt-1 font-display text-3xl">Fields and packs</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { src: "/flash/cabbage-spray.jpg?v=crop", title: "Protected spray in cabbage" },
                { src: "/flash/field-team.jpg?v=crop", title: "Team in the standing crop" },
                { src: "/flash/cabbage-spray.jpg?v=crop", title: "Spraying the paddy" },
              ].map((shot) => (
                <figure key={shot.src} className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
                  <img src={shot.src} alt={shot.title} className="h-56 w-full object-contain" />
                  <figcaption className="px-3 py-2 text-sm font-medium">{shot.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="careers" className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Careers</p>
          <h2 className="mt-1 font-display text-3xl">Work with Mirhaj</h2>
          <p className="mt-4 max-w-2xl text-ink/80">
            We look for people in field sales, production and the Lucknow office. Send your name,
            the role you want, and your phone number to {EMAIL}.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=Career%20at%20Mirhaj%20Chemicals`}
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-ink/15 px-5 text-sm font-semibold"
          >
            Write for a role
          </a>
        </section>

        <section id="enquiry" className="bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Enquiry now</p>
            <h2 className="mt-1 font-display text-3xl">Ask for a product or a dealer</h2>
            <form
              className="mt-6 grid max-w-xl gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const name = String(data.get("name") ?? "").trim();
                const phone = String(data.get("phone") ?? "").trim();
                const message = String(data.get("message") ?? "").trim();
                const text = `Enquiry from ${name}, ${phone}. ${message}`;
                window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
              }}
            >
              <label className="text-sm">
                Name
                <input name="name" required className="mt-1 w-full rounded-xl bg-paper px-3 py-3 text-ink" />
              </label>
              <label className="text-sm">
                Phone
                <input name="phone" required inputMode="tel" className="mt-1 w-full rounded-xl bg-paper px-3 py-3 text-ink" />
              </label>
              <label className="text-sm">
                Message
                <textarea name="message" required rows={4} className="mt-1 w-full rounded-xl bg-paper px-3 py-3 text-ink" />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="inline-flex min-h-11 items-center rounded-full bg-teal px-5 text-sm font-semibold text-paper">
                  Send on WhatsApp
                </button>
                <a
                  href={`mailto:${EMAIL}?subject=Enquiry%20for%20Mirhaj%20Chemicals`}
                  className="inline-flex min-h-11 items-center rounded-full border border-paper/30 px-5 text-sm font-semibold"
                >
                  Email {EMAIL}
                </a>
              </div>
            </form>
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
            <a
              href="https://www.google.com/maps/search/?api=1&query=E-5%2F130+Amrapali+Yojna%2C+Awas+Vikas+Hardoi+Road%2C+Amethia+Salempur%2C+Lucknow+226101"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-ink/10 bg-card p-5 hover:border-teal/50"
            >
              <MapPin className="size-5 text-teal" aria-hidden />
              <p className="mt-3 text-sm text-ink/60">Works</p>
              <p className="text-sm leading-relaxed">
                E-5/130 Amrapali Yojna, Awas Vikas Hardoi Road, Amethia Salempur, Lucknow 226101,
                Uttar Pradesh
              </p>
            </a>
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
        Mirhaj Chemicals Private Limited · MCPL · Lucknow · {EMAIL}
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
                  src={packPhoto(selected.slug)}
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
