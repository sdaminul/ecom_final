"use client";

import { useEffect, useState, useRef } from "react";
import ProductImageDropzone from "@/components/ProductImageDropzone";

interface ColorVariant { name: string; hex: string; }
interface SizeVariant { sizeName?: string; measurements?: string; }

export default function AddProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", originalPrice: "",
    category: "", stockStatus: "In Stock", weight: "", deliveryTime: "", sku: "", quantity: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [colors, setColors] = useState<ColorVariant[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const [sizes, setSizes] = useState<SizeVariant[]>([]);
  const [sizeName, setSizeName] = useState("");
  const [measurements, setMeasurements] = useState("");

  useEffect(() => {
    fetch("/api/admin/category")
      .then(res => res.json())
      .then(data => Array.isArray(data) && setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  /* =====================
     Load Quill from CDN
  ===================== */
  useEffect(() => {
    // Only load Quill in the browser
    if (typeof window === 'undefined') return;

    let isMounted = true;
    let quillScript: HTMLScriptElement | null = null;
    let quillStyle: HTMLLinkElement | null = null;

    const loadQuill = () => {
      if (!isMounted || quillRef.current || !editorContainerRef.current) return;

      // Load Quill CSS
      quillStyle = document.createElement("link");
      quillStyle.href = "https://cdn.quilljs.com/1.3.7/quill.snow.css";
      quillStyle.rel = "stylesheet";
      document.head.appendChild(quillStyle);

      // Load Quill JS
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

        // Set initial value if exists
        if (form.description) {
          quillRef.current.root.innerHTML = form.description;
        }

        // Update form when editor content changes
        quillRef.current.on('text-change', () => {
          const html = quillRef.current.root.innerHTML;
          if (html !== '<p><br></p>') { // Quill's empty state
            setForm(prev => ({ ...prev, description: html }));
          } else {
            setForm(prev => ({ ...prev, description: '' }));
          }
        });
      };

      document.body.appendChild(quillScript);
    };

    // Load Quill after a small delay to ensure DOM is ready
    const timer = setTimeout(loadQuill, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      
      // Cleanup
      if (quillScript && document.body.contains(quillScript)) {
        document.body.removeChild(quillScript);
      }
      if (quillStyle && document.head.contains(quillStyle)) {
        document.head.removeChild(quillStyle);
      }
      quillRef.current = null;
    };
  }, []);

  /* =====================
     Sync description when form changes externally
  ===================== */
  useEffect(() => {
    if (quillRef.current && form.description !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = form.description;
    }
  }, [form.description]);

  /* =====================
     Slug auto-generate
  ===================== */
  useEffect(() => {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setForm((prev) => ({ ...prev, slug }));
  }, [form.name]);

  /* =====================
   Dropzone
===================== */
const onDrop = (acceptedFiles: File[]) => {
  setImages((prev) => [...prev, ...acceptedFiles]);

  const previews = acceptedFiles.map((file) =>
    URL.createObjectURL(file)
  );

  setImagePreviews((prev) => [...prev, ...previews]);
};

  const addColor = () => {
    if (!colorName.trim()) return alert("Color name required");
    setColors([...colors, { name: colorName.trim(), hex: colorHex }]);
    setColorName(""); setColorHex("#000000");
  };
  

  /* =====================
   Remove Color
===================== */
const removeColor = (index: number) => {
  setColors((prev) => prev.filter((_, i) => i !== index));
};

  const addSize = () => {
    if (!sizeName.trim() && !measurements.trim()) return alert("Enter Size Name or Measurements");
    setSizes([...sizes, { sizeName: sizeName.trim() || undefined, measurements: measurements.trim() || undefined }]);
    setSizeName(""); setMeasurements("");
  };

  /* =====================
   Remove Size
===================== */
const removeSize = (index: number) => {
  setSizes((prev) => prev.filter((_, i) => i !== index));
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
      images.forEach(img => formData.append("images", img));

      const res = await fetch("/api/admin/product", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) { alert(data.message || "Failed to add product"); return; }

      alert("✅ Product added successfully");
      setForm({ name: "", slug: "", description: "", price: "", originalPrice: "", category: "", stockStatus: "In Stock", weight: "", deliveryTime: "", sku: "", quantity: "" });
      setImages([]); setImagePreviews([]); setColors([]); setSizes([]);
      
      // Clear Quill editor
      if (quillRef.current) {
        quillRef.current.root.innerHTML = '';
      }
    } catch (err) {
      console.error(err); alert("Server error");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Product Name *" className="border p-2 w-full" required
          value={form.name} onChange={e => setForm({...form, name:e.target.value})} />

        <input placeholder="Slug (auto-generated)" className="border p-2 w-full"
          value={form.slug} readOnly />

        <input type="number" placeholder="Original Price" className="border p-2 w-full"
          value={form.originalPrice} onChange={e => setForm({...form, originalPrice:e.target.value})} />

        <input type="number" placeholder="Selling Price *" className="border p-2 w-full" required
          value={form.price} onChange={e => setForm({...form, price:e.target.value})} />

        <select className="border p-2 w-full" value={form.category} required
          onChange={e => setForm({...form, category:e.target.value})}>
          <option value="">Select Category *</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        {/* Images */}
        <div>
          <ProductImageDropzone images={images} setImages={setImages} />
        </div>

        {/* Colors */}
        <div>
          <h3 className="font-semibold">Color Variants</h3>
          <div className="flex gap-2">
            <input
              className="border p-2"
              placeholder="Color Name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
            />
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
            />
            <button type="button" onClick={addColor} className="bg-gray-800 text-white px-3">
              Add
            </button>
          </div>

          {/* Display added colors */}
          {colors.length > 0 && (
  <ul className="mt-2 space-y-1">
    {colors.map((c, i) => (
      <li
        key={i}
        className="flex items-center gap-2 border px-2 py-1 rounded"
      >
        <span>{c.name}</span>

        <span
          style={{
            backgroundColor: c.hex,
            width: 20,
            height: 20,
            display: "inline-block",
            borderRadius: 4,
          }}
        />

        <button
          type="button"
          onClick={() => removeColor(i)}
          className="ml-auto text-red-600 font-bold"
        >
          ✕
        </button>
      </li>
    ))}
  </ul>
)}
        </div>

        {/* Sizes */}
        <div>
          <h3 className="font-semibold">Size Variants</h3>
          <div className="flex gap-2">
            <input
              className="border p-2"
              placeholder="Size Name"
              value={sizeName}
              onChange={(e) => setSizeName(e.target.value)}
            />
            <input
              className="border p-2"
              placeholder="Measurements"
              value={measurements}
              onChange={(e) => setMeasurements(e.target.value)}
            />
            <button type="button" onClick={addSize} className="bg-gray-800 text-white px-3">
              Add
            </button>
          </div>

          {/* Display added sizes */}
          {sizes.length > 0 && (
  <ul className="mt-2 space-y-1">
    {sizes.map((s, i) => (
      <li
        key={i}
        className="flex items-center gap-2 border px-2 py-1 rounded"
      >
        <span>
          {s.sizeName || ""}
          {s.sizeName && s.measurements ? " - " : ""}
          {s.measurements || ""}
        </span>

        <button
          type="button"
          onClick={() => removeSize(i)}
          className="ml-auto text-red-600 font-bold"
        >
          ✕
        </button>
      </li>
    ))}
  </ul>
)}

        </div>

        {/* Quill Editor */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Description *
          </label>
          <div 
            ref={editorContainerRef} 
            className="border rounded bg-white"
            style={{ minHeight: '200px' }}
          />
          <input 
            type="hidden" 
            name="description" 
            value={form.description} 
            required 
          />
        </div>

        {/* Editor Preview */}
        {/* {form.description && (
          <div className="mt-8 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: form.description }}
            />
          </div>
        )} */}

        <input placeholder="Weight (KG)" className="border p-2 w-full" value={form.weight} onChange={e=>setForm({...form, weight:e.target.value})} />
        <input type="number" placeholder="Delivery Time (days)" className="border p-2 w-full" value={form.deliveryTime} onChange={e=>setForm({...form, deliveryTime:e.target.value})} />
        <input placeholder="SKU" className="border p-2 w-full" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} />
        <input placeholder="Stock" className="border p-2 w-full" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} />

        <button disabled={loading} className="bg-black text-white px-6 py-2 rounded">
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>

      {/* Custom CSS for Quill */}
      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          min-height: 150px;
        }
      `}</style>
    </div>
  );
}