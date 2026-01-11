import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductSwiperGallery from "@/components/ProductSwiperGallery";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  await connectDB();
  const { slug } = await params;
  const product = await Product.findOne({ slug }).lean();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | NextEcom`,
    description: product.description?.substring(0, 160),
    openGraph: {
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function ProductPage({ params }: ProductPageProps) {
  await connectDB();

  // params unwrap
  const { slug } = await params;

  const product = await Product.findOne({ slug })
    .populate("category")
    .lean();

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg p-4">
          <ProductSwiperGallery images={product.images || []} />
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {product.category?.name}
          </p>
          <h1 className="text-3xl font-semibold mb-3">
            {product.name}
          </h1>
          <p className="text-md font-bold text-green-600 mb-3">
            {product.stockStatus}
          </p>
          <p className="text-xl font-bold text-green-600 mb-3">
            ৳ {product.price} <del className="text-red-500 text-sm font-medium ps-1">৳ {product.originalPrice}</del>
          </p>
          {/* Color Variants */}
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div className="mb-2">
              <h3 className="font-semibold mb-1">Available Colors:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colorVariants.map((color: any, index: number) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 border px-2 py-1 rounded text-sm"
                  >
                    <span
                      style={{ backgroundColor: color.hex }}
                      className="w-4 h-4 rounded-full border"
                    />
                    {color.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Size Variants */}
          {product.sizeVariants && product.sizeVariants.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Available Sizes:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizeVariants.map((size: any, index: number) => (
                  <span
                    key={index}
                    className="border px-3 py-1 rounded bg-gray-100 text-gray-800 text-sm"
                  >
                    {size.sizeName || size.measurements || ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="mb-3">
            Stock: {product.quantity}
          </p>
          <p className="mb-3">
            Weight: {product.weight}
          </p>
          <p className="mb-3">
            Delivery Time: {product.deliveryTime} days
          </p>
          <p className="mb-3">
            SKU: {product.sku}
          </p>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90">
              Add to Cart
            </button>

            <button className="border px-6 py-3 rounded-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div
    className="text-gray-700 leading-relaxed mb-6"
    dangerouslySetInnerHTML={{ __html: product.description }}
  />
    </div>
  );
}
