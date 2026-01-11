import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User"; // Ensure User model is registered

async function getAdminOrders() {
  await connectDB();
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return orders.map(o => ({
    ...o,
    _id: o._id.toString(),
    user: o.user || { name: "Unknown", email: "N/A" }
  }));
}

export default async function AdminOrders() {
  const orders = await getAdminOrders();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {orders.length > 0 ? (
          orders.map((o: any) => (
            <div key={o._id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {o._id}</p>
                  <p className="font-semibold">User: {o.user.name} ({o.user.email})</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  o.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                  o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {o.status}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="text-lg font-bold">Total: ${o.total}</p>
                <button className="text-blue-600 hover:underline text-sm">View Details</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}
