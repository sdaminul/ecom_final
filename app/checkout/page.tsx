"use client";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ items: cart }),
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    window.location.href = data.url; // redirect to Stripe checkout
    };


  return (
    <div>
      <h1>Checkout</h1>
      {cart.map((item) => (
        <div key={item._id}>
          {item.name} x {item.quantity} = ${item.price * item.quantity}
        </div>
      ))}
      <h2>Total: ${total}</h2>
      <button>Place Order</button>
    </div>
  );
}
