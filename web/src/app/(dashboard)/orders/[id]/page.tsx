// app/orders/[id]/page.tsx
import { supabase } from "@/lib/supabase";
// import { OrderItemRow } from "@/lib/types";
// lib/types.ts
export type InventoryRow = {
  livestock_type: string;
  breed_type: string;
  farmer_id: string;
};

export type ProfileRow = {
  display_name: string;
};

export type OrderItemRow = {
  quantity: number;
  price_per_unit: number;
  inventory: InventoryRow;
  profiles: ProfileRow; // farmer profile
};

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <p>Unauthorized</p>;

  // ───── Order ─────
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .eq("buyer_id", user.id)
    .single();

  if (!order) return <p>Order not found</p>;

  // ───── Items + farmer name ─────
  const { data: items } = await supabase
    .from("order_items")
    .select(
      `
      quantity,
      price_per_unit,
      inventory:inventory_id (livestock_type, breed_type, farmer_id),
      profiles:farmer_id (display_name)
    `
    )
    .eq("order_id", params.id);

  // Type‑safe cast
  const typedItems = (items ?? []) as unknown as OrderItemRow[];

  // ───── Timeline ─────
  const steps = ["pending", "paid", "processing", "shipped", "delivered"];
  const current = steps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>

      {/* ───── Status Timeline ───── */}
      <div className="flex justify-between items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div
              className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white text-sm font-bold
                ${i <= current ? "bg-green-600" : "bg-gray-300"}`}
            >
              {i + 1}
            </div>
            <p className="mt-2 text-sm capitalize">{s}</p>
          </div>
        ))}
      </div>

      {/* ───── Items ───── */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Items</h2>

        {typedItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span>
              {item.profiles.display_name} – {item.inventory.livestock_type} (
              {item.inventory.breed_type}) × {item.quantity}
            </span>
            <span>{(item.quantity * item.price_per_unit).toFixed(4)} HBAR</span>
          </div>
        ))}

        <div className="font-bold mt-2 text-right">
          Total: {order.total_hbar} HBAR
        </div>
      </div>
    </div>
  );
}
