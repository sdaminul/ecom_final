import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { redirect } from "next/navigation";

async function getUserOrders() {
  const session = await getServerSession();
  if (!session || !session.user) {
    return null;
  }

  await connectDB();
  // Note: In a real app, you'd find by user ID from session
  // For now, we'll fetch orders associated with the session email
  const orders = await Order.find({ "user.email": session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  return orders.map(o => ({
    ...o,
    _id: o._id.toString(),
    createdAt: (o as any).createdAt.toISOString()
  }));
}

export default async function OrdersPage() {
  const orders = await getUserOrders();

  if (orders === null) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-lg font-bold">Total: ${order.total}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <a href="/" className="text-blue-600 hover:underline mt-2 inline-block">Start Shopping</a>
          </div>
        )}
      </div>
    </div>
  );
}
