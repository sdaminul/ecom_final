"use client";
import { useState } from "react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?id=${orderId}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError("Could not find an order with that ID. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4">Track Your Order</h1>
        <p className="text-gray-500">Enter your order ID to see the current status of your delivery.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Order ID (e.g. 65a1b2c3...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition"
          />
          <button 
            onClick={handleTrack} 
            disabled={loading}
            className="bg-black text-white font-bold px-10 py-4 rounded-2xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track Now"}
          </button>
        </div>
        {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
      </div>

      {order && (
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Order Status</p>
              <h2 className="text-xl font-bold">{order.status}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Total Amount</p>
              <p className="text-xl font-black">${order.total}</p>
            </div>
          </div>
          <div className="p-8">
            <div className="relative">
              {/* Simple Progress Bar */}
              <div className="flex justify-between mb-8">
                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                  const currentStepIndex = steps.indexOf(order.status);
                  const isCompleted = index <= currentStepIndex;
                  
                  return (
                    <div key={step} className="flex flex-col items-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                        isCompleted ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-xs font-bold ${isCompleted ? "text-black" : "text-gray-400"}`}>{step}</span>
                    </div>
                  );
                })}
                {/* Connector Line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t">
              <div>
                <h3 className="font-bold mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">ID: {order._id}</p>
                <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">Standard Delivery</p>
                <p className="text-sm text-gray-600">Estimated: 3-5 Business Days</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
