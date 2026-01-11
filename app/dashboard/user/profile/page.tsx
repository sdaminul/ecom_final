import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserProfile() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-black px-6 py-4">
          <h1 className="text-xl font-bold text-white">My Profile</h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Account Status</p>
                <p className="font-semibold text-green-600">Active</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Member Since</p>
                <p className="font-semibold">January 2026</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex space-x-3">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
              Edit Profile
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
