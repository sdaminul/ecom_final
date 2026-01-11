"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryClient({ initialCategories }: { initialCategories: any[] }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("parentId", parentId);
    if (image) formData.append("image", image);
    if (editId) formData.append("id", editId);

    try {
      const res = await fetch("/api/admin/category", {
        method: editId ? "PUT" : "POST",
        body: formData,
      });

      if (res.ok) {
        setName("");
        setParentId("");
        setImage(null);
        setEditId(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/category?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
          <h2 className="text-xl font-bold mb-6">{editId ? "Edit Category" : "Add New Category"}</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Parent Category</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              >
                <option value="">None (Main Category)</option>
                {initialCategories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Category Image</label>
              <input 
                type="file" 
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
              />
            </div>
            <div className="pt-4 flex gap-2">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : editId ? "Update Category" : "Create Category"}
              </button>
              {editId && (
                <button 
                  type="button" 
                  onClick={() => { setEditId(null); setName(""); setParentId(""); }}
                  className="px-4 py-3 border rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Parent</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {initialCategories.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-12 h-12 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">No Image</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.parent?.name || "—"}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditId(c._id);
                        setName(c.name);
                        setParentId(c.parent?._id || "");
                      }}
                      className="text-blue-600 hover:underline text-sm font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 hover:underline text-sm font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
