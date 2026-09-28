import { useEffect, useMemo, useState } from "react";
import { SignInGate, UserButton } from "@/lib/auth/gates";
import {
  addDispatch,
  addEnquiry,
  listDesk,
  setEnquiryStatus,
  setStock,
  type DispatchRow,
  type EnquiryRow,
  type StockRow,
} from "@/lib/mis.functions";

const STATUS_LABEL = {
  new: "New",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
} as const;

export function TeamDesk() {
  return (
    <SignInGate fallback={<SignedOutDesk />}>
      <Desk />
    </SignInGate>
  );
}

function SignedOutDesk() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4">
      <div className="max-w-md text-center">
        <img src="/brand/logo-full.jpg" alt="" className="mx-auto h-12 w-auto" />
        <h1 className="mt-4 font-display text-3xl text-ink">Team desk</h1>
        <p className="mt-2 text-sm text-ink/70">Sign in to see stock, enquiries and dispatches.</p>
        <a
          href="/login"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-teal px-5 text-sm font-semibold text-paper"
        >
          Staff sign in
        </a>
      </div>
    </main>
  );
}

function Desk() {
  const [stock, setRows] = useState<StockRow[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [dispatches, setDispatches] = useState<DispatchRow[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const data = await listDesk();
    setRows(data.stock);
    setEnquiries(data.enquiries);
    setDispatches(data.dispatches);
  }

  useEffect(() => {
    let live = true;
    listDesk()
      .then((data) => {
        if (!live) return;
        setRows(data.stock);
        setEnquiries(data.enquiries);
        setDispatches(data.dispatches);
      })
      .catch(() => {
        if (live) setError("Could not load the desk. Sign in again if this stays blank.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stock;
    return stock.filter((row) => `${row.name} ${row.technical} ${row.category}`.toLowerCase().includes(q));
  }, [query, stock]);

  const units = stock.reduce((sum, row) => sum + row.onHand, 0);
  const low = stock.filter((row) => row.reorderAt > 0 && row.onHand <= row.reorderAt).length;
  const open = enquiries.filter((row) => row.status === "new" || row.status === "quoted").length;

  async function run(action: () => Promise<unknown>) {
    setError("");
    try {
      await action();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <a href="/">
            <img src="/brand/logo-full.jpg" alt="Mirhaj Chemicals" className="h-10 w-auto" />
          </a>
          <p className="font-display text-xl text-ink">Team desk</p>
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="max-w-2xl text-sm leading-relaxed text-ink/70">
          Shared stock, dealer enquiries and dispatches for Mirhaj staff. Logins here are for this
          desk only. They are not @mirhajchemicals.com mailboxes — those start after the domain is
          bought and mail is hosted on Google Workspace or Zoho.
        </p>

        <section className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="Packs on hand" value={String(units)} />
          <Stat label="At or below reorder" value={String(low)} />
          <Stat label="Open enquiries" value={String(open)} />
        </section>

        {error ? <p className="mt-4 text-sm font-medium text-ink">{error}</p> : null}
        {loading ? <p className="mt-6 text-sm text-ink/70">Loading the desk…</p> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl text-ink">Stock</h2>
              <input
                className="min-h-11 w-full rounded-full border border-ink/15 bg-card px-4 text-sm sm:w-64"
                placeholder="Find a pack"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Find a pack"
              />
            </div>
            <ul className="mt-3 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-card">
              {visible.map((row) => (
                <li key={row.id} className="flex items-center gap-3 px-3 py-3">
                  <img
                    src={`/products/${row.slug}.jpg?v=${row.slug === "miraxima-plus" ? "bottle" : "catalogue"}`}
                    alt=""
                    className="h-14 w-12 shrink-0 object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{row.name}</p>
                    <p className="truncate text-xs text-ink/60">{row.technical}</p>
                    {row.reorderAt > 0 && row.onHand <= row.reorderAt ? (
                      <p className="text-xs font-semibold text-gold">Reorder</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="grid size-11 place-items-center rounded-full border border-ink/15 text-lg"
                      aria-label={`Decrease ${row.name}`}
                      onClick={() => void run(() => setStock({ data: { id: row.id, onHand: Math.max(0, row.onHand - 1) } }))}
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums">{row.onHand}</span>
                    <button
                      type="button"
                      className="grid size-11 place-items-center rounded-full border border-ink/15 text-lg"
                      aria-label={`Increase ${row.name}`}
                      onClick={() => void run(() => setStock({ data: { id: row.id, onHand: row.onHand + 1 } }))}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <EnquiryPanel
              enquiries={enquiries}
              onAdd={(input) => run(() => addEnquiry({ data: input }))}
              onStatus={(id, status) => run(() => setEnquiryStatus({ data: { id, status } }))}
            />
            <DispatchPanel
              stock={stock}
              dispatches={dispatches}
              onAdd={(input) => run(() => addDispatch({ data: input }))}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-card px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl text-ink">{value}</p>
    </div>
  );
}

function EnquiryPanel({
  enquiries,
  onAdd,
  onStatus,
}: {
  enquiries: EnquiryRow[];
  onAdd: (input: { dealer: string; phone: string; product: string; note: string }) => void;
  onStatus: (id: number, status: EnquiryRow["status"]) => void;
}) {
  const [dealer, setDealer] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [note, setNote] = useState("");

  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Enquiries</h2>
      <form
        className="mt-3 flex flex-col gap-2 rounded-2xl border border-ink/10 bg-card p-3"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd({ dealer, phone, product, note });
          setDealer("");
          setPhone("");
          setProduct("");
          setNote("");
        }}
      >
        <input className="min-h-11 rounded-xl border border-ink/15 px-3" placeholder="Dealer or farmer" value={dealer} onChange={(e) => setDealer(e.target.value)} required aria-label="Dealer or farmer" />
        <input className="min-h-11 rounded-xl border border-ink/15 px-3" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Phone" />
        <input className="min-h-11 rounded-xl border border-ink/15 px-3" placeholder="Product" value={product} onChange={(e) => setProduct(e.target.value)} required aria-label="Product" />
        <input className="min-h-11 rounded-xl border border-ink/15 px-3" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Note" />
        <button type="submit" className="min-h-11 rounded-full bg-teal text-sm font-semibold text-paper">
          Log enquiry
        </button>
      </form>
      <ul className="mt-3 flex flex-col gap-2">
        {enquiries.map((row) => (
          <li key={row.id} className="rounded-2xl border border-ink/10 bg-card p-3">
            <p className="font-medium text-ink">{row.dealer}</p>
            <p className="text-sm text-ink/70">
              {row.product}
              {row.phone ? ` · ${row.phone}` : ""}
            </p>
            {row.note ? <p className="mt-1 text-sm text-ink/70">{row.note}</p> : null}
            <div className="mt-2 flex flex-wrap gap-1">
              {(Object.keys(STATUS_LABEL) as EnquiryRow["status"][]).map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`min-h-9 rounded-full px-3 text-xs font-semibold ${
                    row.status === status ? "bg-ink text-paper" : "bg-paper text-ink"
                  }`}
                  onClick={() => onStatus(row.id, status)}
                >
                  {STATUS_LABEL[status]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DispatchPanel({
  stock,
  dispatches,
  onAdd,
}: {
  stock: StockRow[];
  dispatches: DispatchRow[];
  onAdd: (input: { stockId: number; qty: number; destination: string }) => void;
}) {
  const [stockId, setStockId] = useState(stock[0]?.id ?? 0);
  const [qty, setQty] = useState(1);
  const [destination, setDestination] = useState("");

  return (
    <section>
      <h2 className="font-display text-2xl text-ink">Dispatches</h2>
      <form
        className="mt-3 flex flex-col gap-2 rounded-2xl border border-ink/10 bg-card p-3"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd({ stockId: Number(stockId), qty: Number(qty), destination });
          setDestination("");
          setQty(1);
        }}
      >
        <select
          className="min-h-11 rounded-xl border border-ink/15 bg-card px-3"
          value={stockId}
          onChange={(event) => setStockId(Number(event.target.value))}
          aria-label="Product to dispatch"
        >
          {stock.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name} ({row.onHand})
            </option>
          ))}
        </select>
        <input
          className="min-h-11 rounded-xl border border-ink/15 px-3"
          type="number"
          min={1}
          value={qty}
          onChange={(event) => setQty(Number(event.target.value))}
          aria-label="Quantity"
        />
        <input
          className="min-h-11 rounded-xl border border-ink/15 px-3"
          placeholder="Going to"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          required
          aria-label="Destination"
        />
        <button type="submit" className="min-h-11 rounded-full bg-ink text-sm font-semibold text-paper">
          Dispatch and reduce stock
        </button>
      </form>
      <ul className="mt-3 flex flex-col gap-2">
        {dispatches.map((row) => (
          <li key={row.id} className="rounded-2xl border border-ink/10 bg-card px-3 py-2 text-sm">
            <span className="font-medium text-ink">{row.qty} × {row.product}</span>
            <span className="text-ink/70"> → {row.destination}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
