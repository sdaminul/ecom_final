export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black tracking-tight mb-8">About NextEcom</h1>
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">
            NextEcom is Bangladesh’s premier e-commerce platform, dedicated to bringing the latest technology and high-quality electronics to your doorstep. Founded in 2026, we have quickly grown to become a trusted name in the industry.
          </p>
          <p className="mb-6">
            Our mission is to provide a seamless shopping experience through a user-friendly interface, secure payment methods, and lightning-fast delivery. We believe that technology should be accessible to everyone, and we work tirelessly to curate a collection that meets the diverse needs of our customers.
          </p>
          <div className="bg-gray-50 p-8 rounded-3xl border my-12">
            <h2 className="text-2xl font-bold text-black mb-4">Why Choose Us?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">1</span>
                <span><strong>Authentic Products:</strong> We source directly from manufacturers and authorized distributors.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">2</span>
                <span><strong>Fast Delivery:</strong> Our logistics network ensures your orders reach you in record time.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">3</span>
                <span><strong>Customer Support:</strong> Our dedicated team is always ready to help you with any queries.</span>
              </li>
            </ul>
          </div>
          <p>
            Thank you for choosing NextEcom. We look forward to serving you and being a part of your technology journey.
          </p>
        </div>
      </div>
    </div>
  );
}
