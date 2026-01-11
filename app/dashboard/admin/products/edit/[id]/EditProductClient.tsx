"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ProductImageDropzone from "@/components/ProductImageDropzone";

interface ColorVariant { name: string; hex: string; }
interface SizeVariant { sizeName?: string; measurements?: string; }

export default function EditProductClient({ id }: { id: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const quillRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", originalPrice: "",
    category: "", stockStatus: "In Stock", weight: "", deliveryTime: "", sku: "", quantity: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [colors, setColors] = useState<ColorVariant[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const [sizes, setSizes] = useState<SizeVariant[]>([]);
  const [sizeName, setSizeName] = useState("");
  const [measurements, setMeasurements] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/admin/category"),
          fetch(`/api/admin/product/${id}`)
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (Array.isArray(catData)) setCategories(catData);
        
        if (prodRes.ok) {
          setForm({
            name: prodData.name || "",
            slug: prodData.slug || "",
            description: prodData.description || "",
            price: prodData.price?.toString() || "",
            originalPrice: prodData.originalPrice?.toString() || "",
            category: prodData.category || "",
            stockStatus: prodData.stockStatus || "In Stock",
            weight: prodData.weight?.toString() || "",
            deliveryTime: prodData.deliveryTime?.toString() || "",
            sku: prodData.sku || "",
            quantity: prodData.quantity?.toString() || "",
          });
          setExistingImages(prodData.images || []);
          setColors(prodData.colorVariants || []);
          setSizes(prodData.sizeVariants || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* =====================
     Load Quill from CDN
  ===================== */
  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    let isMounted = true;
    let quillScript: HTMLScriptElement | null = null;
    let quillStyle: HTMLLinkElement | null = null;

    const loadQuill = () => {
      if (!isMounted || quillRef.current || !editorContainerRef.current) return;

      quillStyle = document.createElement("link");
      quillStyle.href = "https://cdn.quilljs.com/1.3.7/quill.snow.css";
      quillStyle.rel = "stylesheet";
      document.head.appendChild(quillStyle);

      quillScript = document.createElement("script");
      quillScript.src = "https://cdn.quilljs.com/1.3.7/quill.js";
      quillScript.async = true;
      
      quillScript.onload = () => {
        if (!isMounted || !editorContainerRef.current) return;
        
        const Quill = (window as any).Quill;
        quillRef.current = new Quill(editorContainerRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image', 'video'],
              ['clean']
            ]
          },
          placeholder: 'Write product description here...',
        });

        if (form.description) {
          quillRef.current.root.innerHTML = form.description;
        }

        quillRef.current.on('text-change', () => {
          const html = quillRef.current.root.innerHTML;
          setForm(prev => ({ ...prev, description: html === '<p><br></p>' ? '' : html }));
        });
      };

      document.body.appendChild(quillScript);
    };

    const timer = setTimeout(loadQuill, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (quillScript && document.body.contains(quillScript)) document.body.removeChild(quillScript);
      if (quillStyle && document.head.contains(quillStyle)) document.head.removeChild(quillStyle);
      quillRef.current = null;
    };
  }, [loading]);

  useEffect(() => {
    if (quillRef.current && form.description !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = form.description;
    }
  }, [form.description]);

  const addColor = () => {
    if (!colorName.trim()) return alert("Color name required");
    setColors([...colors, { name: colorName.trim(), hex: colorHex }]);
    setColorName(""); setColorHex("#000000");
  };
  
  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (!sizeName.trim() && !measurements.trim()) return alert("Enter Size Name or Measurements");
    setSizes([...sizes, { sizeName: sizeName.trim() || undefined, measurements: measurements.trim() || undefined }]);
    setSizeName(""); setMeasurements("");
  };

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("originalPrice", form.originalPrice);
      formData.append("category", form.category);
      formData.append("quantity", form.quantity || "0");
      formData.append("stockStatus", form.stockStatus);
      formData.append("weight", form.weight);
      formData.append("deliveryTime", form.deliveryTime);
      formData.append("sku", form.sku);
      formData.append("colorVariants", JSON.stringify(colors));
      formData.append("sizeVariants", JSON.stringify(sizes));
      formData.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach(img => formData.append("images", img));

      const res = await fetch(`/api/admin/product/${id}`, { method: "PUT", body: formData });
      const data = await res.json();

      if (!res.ok) { alert(data.message || "Failed to update product"); return; }

      alert("✅ Product updated successfully");
      router.push("/dashboard/admin/products");
    } catch (err) {
      console.error(err); alert("Server error");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Product Name *</label>
            <input className="border p-2 w-full" required
              value={form.name} onChange={e => setForm({...form, name:e.target.value})} />

            <label className="block text-sm font-medium">Slug</label>
            <input className="border p-2 w-full bg-gray-50" value={form.slug} readOnly />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Original Price</label>
                <input type="number" className="border p-2 w-full"
                  value={form.originalPrice} onChange={e => setForm({...form, originalPrice:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Selling Price *</label>
                <input type="number" className="border p-2 w-full" required
                  value={form.price} onChange={e => setForm({...form, price:e.target.value})} />
              </div>
            </div>

            <label className="block text-sm font-medium">Category *</label>
            <select className="border p-2 w-full" value={form.category} required
              onChange={e => setForm({...form, category:e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <label className="block text-sm font-medium">Stock Status</label>
            <select className="border p-2 w-full" value={form.stockStatus}
              onChange={e => setForm({...form, stockStatus:e.target.value})}>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Existing Images</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(i)} 
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1">✕</button>
                </div>
              ))}
            </div>

            <label className="block text-sm font-medium">Add New Images</label>
            <ProductImageDropzone images={newImages} setImages={setNewImages} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <div ref={editorContainerRef} style={{ height: '300px' }} className="bg-white"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colors */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Color Variants</h3>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 flex-1" placeholder="Color Name" value={colorName} onChange={(e) => setColorName(e.target.value)} />
              <input type="color" className="w-10 h-10" value={colorHex} onChange={(e) => setColorHex(e.target.value)} />
              <button type="button" onClick={addColor} className="bg-black text-white px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2 border px-2 py-1 rounded bg-gray-50">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }}></span>
                  <span className="text-sm">{c.name}</span>
                  <button type="button" onClick={() => removeColor(i)} className="text-red-500 ml-1">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Size Variants</h3>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 flex-1" placeholder="Size" value={sizeName} onChange={(e) => setSizeName(e.target.value)} />
              <input className="border p-2 flex-1" placeholder="Info" value={measurements} onChange={(e) => setMeasurements(e.target.value)} />
              <button type="button" onClick={addSize} className="bg-black text-white px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-2 border px-2 py-1 rounded bg-gray-50">
                  <span className="text-sm">{s.sizeName} {s.measurements && `(${s.measurements})`}</span>
                  <button type="button" onClick={() => removeSize(i)} className="text-red-500 ml-1">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 disabled:bg-gray-400">
            {saving ? "Updating..." : "Update Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="border border-gray-300 px-8 py-3 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
