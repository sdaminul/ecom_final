import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category"; 
import AdminProductList from "./AdminProductList";

async function getAdminProducts() {
  await connectDB();
  const products = await Product.find({})
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    category: p.category ? { 
      _id: (p.category as any)._id.toString(), 
      name: (p.category as any).name 
    } : { name: "Uncategorized" }
  }));
}

export default async function AdminProducts() {
  const products = await getAdminProducts();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Products</h1>
        <Link 
          href="/dashboard/admin/products/add"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Add New Product
        </Link>
      </div>

      <AdminProductList initialProducts={products} />
    </div>
  );
}
