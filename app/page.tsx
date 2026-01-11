import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category";

export const revalidate = 3600; // Cache for 1 hour

async function getFeaturedProducts() {
  await connectDB();
  
  // Only fetch necessary fields and limit to 8 products for the home page
  const products = await Product.find({})
    .select("name slug price images category")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  return products.map(product => ({
    ...product,
    _id: product._id.toString(),
    images: product.images || [],
    category: product.category || { name: "Uncategorized" }
  }));
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tight">Premium Electronics</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Discover the latest in technology with our curated collection of high-performance gadgets.
        </p>
      </section>

      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <Link href="/product" className="text-blue-600 font-medium hover:underline">
          View All Products →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <div key={product._id} className="group">
            <Link href={`/product/${product.slug}`}>
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
                {product.category?.name}
              </p>
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-gray-900 font-black mt-1">${product.price}</p>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-black rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to upgrade your tech?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Join thousands of satisfied customers who trust NextEcom for their electronic needs.</p>
        <Link href="/product" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
