import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type StockRow = {
  id: number;
  slug: string;
  name: string;
  technical: string;
  category: string;
  onHand: number;
  reorderAt: number;
};

export type EnquiryRow = {
  id: number;
  dealer: string;
  phone: string;
  product: string;
  note: string;
  status: "new" | "quoted" | "won" | "lost";
  createdAt: string;
};

export type DispatchRow = {
  id: number;
  product: string;
  qty: number;
  destination: string;
  createdAt: string;
};

const STATUSES = ["new", "quoted", "won", "lost"] as const;

export const listDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const stock = await sql<{
      id: number;
      slug: string;
      name: string;
      technical: string;
      category: string;
      on_hand: number;
      reorder_at: number;
    }>`select id, slug, name, technical, category, on_hand, reorder_at from stock order by category, name`;
    const enquiries = await sql<{
      id: number;
      dealer: string;
      phone: string;
      product: string;
      note: string;
      status: EnquiryRow["status"];
      created_at: string;
    }>`select id, dealer, phone, product, note, status, created_at from enquiries order by created_at desc limit 40`;
    const dispatches = await sql<{
      id: number;
      name: string;
      qty: number;
      destination: string;
      created_at: string;
    }>`select d.id, s.name, d.qty, d.destination, d.created_at
       from dispatches d join stock s on s.id = d.stock_id
       order by d.created_at desc limit 30`;
    return {
      stock: stock.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        technical: row.technical,
        category: row.category,
        onHand: row.on_hand,
        reorderAt: row.reorder_at,
      })),
      enquiries: enquiries.map((row) => ({
        id: row.id,
        dealer: row.dealer,
        phone: row.phone,
        product: row.product,
        note: row.note,
        status: row.status,
        createdAt: row.created_at,
      })),
      dispatches: dispatches.map((row) => ({
        id: row.id,
        product: row.name,
        qty: row.qty,
        destination: row.destination,
        createdAt: row.created_at,
      })),
    };
  });

export const setStock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; onHand: number }) => {
    const id = Number(input?.id);
    const onHand = Number(input?.onHand);
    if (!Number.isInteger(id) || id < 1) throw new Error("Unknown product");
    if (!Number.isInteger(onHand) || onHand < 0 || onHand > 1_000_000) {
      throw new Error("Stock must be a whole number from 0 to 1,000,000");
    }
    return { id, onHand };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      update stock set on_hand = ${data.onHand}, updated_at = now()
      where id = ${data.id}
      returning id`;
    if (!rows.length) throw new Error("Unknown product");
    return { ok: true };
  });

export const addEnquiry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealer: string; phone: string; product: string; note: string }) => {
    const dealer = String(input?.dealer ?? "").trim();
    const phone = String(input?.phone ?? "").trim();
    const product = String(input?.product ?? "").trim();
    const note = String(input?.note ?? "").trim();
    if (dealer.length < 2 || dealer.length > 120) throw new Error("Enter the dealer or farmer name");
    if (product.length < 2 || product.length > 160) throw new Error("Enter the product");
    if (phone.length > 30) throw new Error("Phone is too long");
    if (note.length > 500) throw new Error("Note is too long");
    return { dealer, phone, product, note };
  })
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`insert into enquiries (dealer, phone, product, note, created_by)
      values (${data.dealer}, ${data.phone}, ${data.product}, ${data.note}, ${context.userId})`;
    return { ok: true };
  });

export const setEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: string }) => {
    const id = Number(input?.id);
    const status = String(input?.status ?? "");
    if (!Number.isInteger(id) || id < 1) throw new Error("Unknown enquiry");
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) throw new Error("Unknown status");
    return { id, status: status as (typeof STATUSES)[number] };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      update enquiries set status = ${data.status} where id = ${data.id} returning id`;
    if (!rows.length) throw new Error("Unknown enquiry");
    return { ok: true };
  });

export const addDispatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { stockId: number; qty: number; destination: string }) => {
    const stockId = Number(input?.stockId);
    const qty = Number(input?.qty);
    const destination = String(input?.destination ?? "").trim();
    if (!Number.isInteger(stockId) || stockId < 1) throw new Error("Choose a product");
    if (!Number.isInteger(qty) || qty < 1 || qty > 100_000) throw new Error("Quantity must be at least 1");
    if (destination.length < 2 || destination.length > 160) throw new Error("Enter where it is going");
    return { stockId, qty, destination };
  })
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const updated = await sql<{ id: number }>`
      update stock set on_hand = on_hand - ${data.qty}, updated_at = now()
      where id = ${data.stockId} and on_hand >= ${data.qty}
      returning id`;
    if (!updated.length) throw new Error("Not enough stock for that dispatch");
    await sql`insert into dispatches (stock_id, qty, destination, created_by)
      values (${data.stockId}, ${data.qty}, ${data.destination}, ${context.userId})`;
    return { ok: true };
  });
