"use client";
import { useState } from "react";

export default function UserSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="bg-black p-6">
          <h1 className="text-xl font-bold text-white">Account Settings</h1>
        </div>
        <div className="p-8">
          <h2 className="text-lg font-bold mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
