import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

async function searchProducts(query: string) {
  await connectDB();
  if (!query) return [];
  
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ]
  })
  .select("name slug price")
  .limit(20)
  .lean();

  return products.map(p => ({
    ...p,
    _id: p._id.toString()
  }));
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = "" } = await searchParams;
  const results = await searchProducts(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Products</h1>
      
      <form action="/search" method="GET" className="mb-8 flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search for products..."
          className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button 
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Search
        </button>
      </form>

      {query && (
        <p className="mb-4 text-gray-600">
          Showing results for: <strong>{query}</strong>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {results.length > 0 ? (
          results.map((product: any) => (
            <div key={product._id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <Link href={`/product/${product.slug}`} className="font-semibold text-lg hover:underline">
                  {product.name}
                </Link>
                <p className="text-gray-600">${product.price}</p>
              </div>
              <Link 
                href={`/product/${product.slug}`}
                className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                View
              </Link>
            </div>
          ))
        ) : query ? (
          <p className="text-gray-500">No products found matching your search.</p>
        ) : (
          <p className="text-gray-500">Enter a search term to find products.</p>
        )}
      </div>
    </div>
  );
}
