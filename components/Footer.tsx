export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-black tracking-tighter mb-4">
              NEXT<span className="text-blue-600">ECOM</span>
            </h2>
            <p className="text-gray-500 max-w-xs mb-6">
              Your one-stop shop for the latest electronics and gadgets. High quality products delivered to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-black">Home</a></li>
              <li><a href="/product" className="hover:text-black">Shop</a></li>
              <li><a href="/search" className="hover:text-black">Search</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/contact" className="hover:text-black">Contact Us</a></li>
              <li><a href="/about" className="hover:text-black">About Us</a></li>
              <li><a href="/track-order" className="hover:text-black">Track Order</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} NextEcom. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-gray-400">Privacy Policy</span>
            <span className="text-xs text-gray-400">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
