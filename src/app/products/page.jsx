"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import { useCartStore } from "@/store/useCartStore";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products?limit=100"),
          api.get("/products/categories"),
        ]);

        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search query and category
  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(
      <div>
        <p className="font-semibold">{product.title}</p>
        <p className="text-sm">Added to cart</p>
      </div>,
      { icon: "🛒" }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Search Result Header */}
      {searchQuery && (
        <div className="bg-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Search Results for {searchQuery}
            </h1>
            <p className="text-gray-600">
              Found {filteredProducts.length} product(s)
            </p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-background shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto space-x-2 py-4 scrollbar-hide md:scrollbar-default">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-foreground text-secondary shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all capitalize ${
                  selectedCategory === category.slug
                    ? "bg-foreground text-secondary shadow-lg"
                    : "bg-background text-gray-700 hover:bg-foreground/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">
              No products found{searchQuery && ` for "${searchQuery}"`}
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                        -{product.discountPercentage}%
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    {product.category}
                  </p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({product.stock} in stock)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xl font-bold">
                        Rp {(product.price * 15000).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-foreground text-secondary py-2 rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
