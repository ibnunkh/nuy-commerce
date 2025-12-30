"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, UserRound, Menu, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

  // Ambil data dari useAuthStore
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;

  // useEffect untuk mounted state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleNavClick = () => {
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchQuery("");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    logout();
    toast.success("Logged out successfully");
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav className="max-w-7xl flex justify-between px-6 py-4 items-center shadow-md">
        <div className="flex items-center space-x-8">
          <div className="md:hidden">
            {open ? (
              <X onClick={() => setOpen(!open)} />
            ) : (
              <Menu onClick={() => setOpen(!open)} />
            )}

            {open && (
              <div className="absolute left-0 right-0 shadow-md mt-4 z-50">
                <nav className="w-full h-80 flex flex-col justify-between p-6 space-y-2 pt-2 bg-background">
                  <div className="mt-10 flex flex-col gap-2">
                    <Link href="/" className="text-xl" onClick={handleNavClick}>
                      Beranda
                    </Link>
                    <Link href="/" className="text-xl" onClick={handleNavClick}>
                      Kontak
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    {isAuthenticated ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <UserRound />
                          <p className="font-semibold">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <LogOut size={20} />
                          <p>Logout</p>
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="flex gap-2"
                        onClick={handleNavClick}
                      >
                        <UserRound />
                        <p>Login</p>
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </div>
          <Link href="/">
            <h1 className="text-lg md:text-2xl font-poppins font-semibold">
              NuyCommerce
            </h1>
          </Link>
        </div>

        <div className="flex space-x-4 md:space-x-6 items-center">
          <Search
            className="hover:cursor-pointer transform hover:scale-110"
            onClick={toggleSearch}
          />
          <Link href="/cart" className="relative">
            <ShoppingCart className="hover:cursor-pointer transform hover:scale-110" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-foreground text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden md:flex relative">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <UserRound className="hover:cursor-pointer transform hover:scale-110" />
                  <span className="font-medium">{user?.firstName}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <UserRound className="hover:cursor-pointer transform hover:scale-110" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-foreground/50 bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-background w-full max-w-2xl mx-4 rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Cari Produk</h2>
              <X className="hover:cursor-pointer" onClick={toggleSearch} />
            </div>
            <form onSubmit={handleSearch}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-foreground text-secondary rounded-lg hover:bg-foreground/90 transition-colors font-semibold"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
