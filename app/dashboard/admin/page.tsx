import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

async function getDashboardData() {
  await connectDB();
  
  const [totalProducts, totalOrders, totalUsers] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments()
  ]);

  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    stats: { totalProducts, totalOrders, totalUsers },
    recentOrders: recentOrders.map(o => ({
      ...o,
      _id: o._id.toString(),
      createdAt: (o as any).createdAt.toISOString()
    }))
  };
}

export default async function AdminDashboard() {
  const { stats, recentOrders } = await getDashboardData();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link href="/dashboard/admin/orders" className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition">
          Orders
        </Link>
        <Link href="/dashboard/admin/category" className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition">
          Category
        </Link>
        <Link href="/dashboard/admin/products" className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition">
          Products
        </Link>
        <Link href="/dashboard/admin/settings" className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition">
          Settings
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="font-semibold text-blue-600 uppercase text-xs tracking-wider mb-1">Total Products</h2>
          <p className="text-3xl font-bold text-blue-900">{stats.totalProducts}</p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg border border-green-100">
          <h2 className="font-semibold text-green-600 uppercase text-xs tracking-wider mb-1">Total Orders</h2>
          <p className="text-3xl font-bold text-green-900">{stats.totalOrders}</p>
        </div>
        <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
          <h2 className="font-semibold text-purple-600 uppercase text-xs tracking-wider mb-1">Total Users</h2>
          <p className="text-3xl font-bold text-purple-900">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{order._id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm font-semibold">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
