"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setResponse(data.message);
      if (res.ok) {
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      setResponse("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-6">Get in Touch</h1>
          <p className="text-gray-500 text-lg mb-10">
            Have a question or feedback? We'd love to hear from you. Fill out the form and our team will get back to you within 24 hours.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-gray-100 p-4 rounded-2xl mr-4">📍</div>
              <div>
                <h3 className="font-bold">Our Office</h3>
                <p className="text-gray-500 text-sm">123 Tech Plaza, Dhaka, Bangladesh</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-gray-100 p-4 rounded-2xl mr-4">📧</div>
              <div>
                <h3 className="font-bold">Email Us</h3>
                <p className="text-gray-500 text-sm">support@nextecom.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-gray-100 p-4 rounded-2xl mr-4">📞</div>
              <div>
                <h3 className="font-bold">Call Us</h3>
                <p className="text-gray-500 text-sm">+880 1234 567890</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Full Name</label>
              <input 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email Address</label>
              <input 
                type="email"
                placeholder="your@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Message</label>
              <textarea 
                placeholder="How can we help you?" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition h-32 resize-none"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {response && (
              <div className={`p-4 rounded-xl text-sm font-medium ${response.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {response}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
