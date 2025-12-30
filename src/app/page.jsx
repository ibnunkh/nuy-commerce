"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import Hero from "@/components/molecules/Hero";
import ProductCard from "@/components/molecules/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/products/categories");
        // API mengembalikan array langsung dalam response.data
        setCategories(response.data);
      } catch (error) {
        console.error("Gagal mengambil kategori produk:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        if (selectedCategory === "all") {
          response = await api.get("/products?limit=100");
        } else {
          response = await api.get(`/products/category/${selectedCategory}`);
        }

        // Axios mengembalikan data dalam response.data
        setProducts(response.data.products);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Hero />

      {/* Category Tabs */}
      <div className="sticky top-0 z-10 bg-background shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto space-x-2 py-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-foreground text-secondary shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua Produk
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
      <div className="p-4 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCategory === "all"
                  ? "Semua Produk"
                  : categories.find((c) => c.slug === selectedCategory)?.name ||
                    selectedCategory}
              </h2>
              <p className="text-gray-600 mt-1">
                {products.length} produk ditemukan
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
