import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import CategoryClient from "./CategoryClient";

async function getCategories() {
  await connectDB();
  const categories = await Category.find({})
    .populate("parent", "name")
    .sort({ createdAt: -1 })
    .lean();

  return categories.map(c => ({
    ...c,
    _id: c._id.toString(),
    parent: c.parent ? { _id: (c.parent as any)._id.toString(), name: (c.parent as any).name } : null
  }));
}

export default async function AdminCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-8 tracking-tight">Category Management</h1>
      <CategoryClient initialCategories={categories} />
    </div>
  );
}
