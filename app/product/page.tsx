import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

async function getProducts(page: number = 1) {
  await connectDB();
  const limit = 12;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({})
      .select("name slug price images category stockStatus")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments({})
  ]);

  return {
    products: products.map(p => ({
      ...p,
      _id: p._id.toString(),
      category: p.category || { name: "Uncategorized" }
    })),
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const { products, totalPages } = await getProducts(currentPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h1 className="text-4xl font-black tracking-tight">All Products</h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          Showing page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <div key={product._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <Link href={`/product/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                )}
                {product.stockStatus === "Out of Stock" && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-600 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                    OUT OF STOCK
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-2">{product.category.name}</p>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <p className="text-xl font-black text-black">${product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          {currentPage > 1 && (
            <Link 
              href={`/product?page=${currentPage - 1}`}
              className="px-6 py-3 rounded-xl border font-bold hover:bg-gray-50 transition"
            >
              Previous
            </Link>
          )}
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Only show a few page numbers if there are many
              if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-2">...</span>;
                return null;
              }
              return (
                <Link
                  key={pageNum}
                  href={`/product?page=${pageNum}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition ${
                    currentPage === pageNum ? "bg-black text-white" : "border hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          {currentPage < totalPages && (
            <Link 
              href={`/product?page=${currentPage + 1}`}
              className="px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
