import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const menuItems = [
    { title: "My Orders", href: "/dashboard/user/orders", icon: "📦", desc: "Check your order history" },
    { title: "Profile", href: "/dashboard/user/profile", icon: "👤", desc: "Manage your personal info" },
    { title: "Track Order", href: "/dashboard/user/track-order", icon: "🚚", desc: "See where your package is" },
    { title: "Settings", href: "/dashboard/user/settings", icon: "⚙️", desc: "Account preferences" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back, {session.user.name}!</h1>
        <p className="text-gray-500">Manage your account and track your orders from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="group bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:border-black transition-all duration-300"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h2 className="text-lg font-bold mb-1">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-3xl p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-1">Need help with an order?</h3>
          <p className="text-blue-700">Our support team is available 24/7 to assist you.</p>
        </div>
        <Link href="/contact" className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
