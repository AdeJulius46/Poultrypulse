// app/api/checkout/route.ts
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export type Inventory = {
  id: string;
  price_per_bird: number;
  farm_name?: string;
  batch_name?: string;
  livestock_type?: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  inventory: Inventory;
};

export async function POST(req: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Get cart with inventory details
    const { data: cartItems, error: cartError } = await supabase
      .from("cart")
      .select(
        `
        id,
        quantity,
        inventory:inventory_id (
          id,
          price_per_bird,
          livestock_type
        )
      `
      )
      .eq("buyer_id", user.id);
    // Type assertion (safe because we know the shape)
    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const typedCartItems = cartItems as unknown as CartItem[];

    // 2. Calculate total
    const total = typedCartItems.reduce((sum, item) => {
      return sum + item.quantity * item.inventory.price_per_bird; // FIXED
    }, 0);

    // 3. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        total_hbar: total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create order items
    const orderItems = typedCartItems.map((item) => ({
      order_id: order.id,
      inventory_id: item.inventory.id,
      quantity: item.quantity,
      price_per_unit: item.inventory.price_per_bird, // FIXED
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. **DELETE CART ITEMS**
    const cartIds = cartItems.map((i) => i.id);
    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .in("id", cartIds);

    if (deleteError) throw deleteError;

    // 6. (Optional) Pay via contract
    // const signer = await getSigner();
    // const contract = new ethers.Contract(
    //   process.env.MARKETPLACE_CONTRACT!,
    //   ["function payOrder(uint256 orderId) payable"],
    //   signer
    // );
    // const tx = await contract.payOrder(order.id, {
    //   value: ethers.parseUnits(total.toString(), 8),
    // });
    // await tx.wait();
    // await supabase.from("orders").update({ transaction_hash: tx.hash, status: "paid" }).eq("id", order.id);

    return NextResponse.json({
      orderId: order.id,
      message: "Checkout successful",
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
