"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter">
            NEXT<span className="text-blue-600">ECOM</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition">Home</Link>
            <Link href="/product" className="text-sm font-medium hover:text-blue-600 transition">Shop</Link>
            <Link href="/search" className="text-sm font-medium hover:text-blue-600 transition">Search</Link>
            
            <div className="h-4 w-px bg-gray-200"></div>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href={session.user?.email?.includes('admin') ? "/dashboard/admin" : "/dashboard/user"} 
                  className="text-sm font-medium hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-sm font-bold bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition">Login</Link>
                <Link 
                  href="/signup" 
                  className="text-sm font-bold bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-4">
            <Link href="/" className="block text-base font-medium">Home</Link>
            <Link href="/product" className="block text-base font-medium">Shop</Link>
            <Link href="/search" className="block text-base font-medium">Search</Link>
            <hr />
            {session ? (
              <>
                <Link href="/dashboard/user" className="block text-base font-medium">Dashboard</Link>
                <button 
                  onClick={() => signOut()}
                  className="w-full text-left text-base font-bold text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-base font-medium">Login</Link>
                <Link href="/signup" className="block text-base font-medium">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
