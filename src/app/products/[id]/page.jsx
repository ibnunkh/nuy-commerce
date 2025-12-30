"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import Button from "@/components/atoms/Button";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const topRef = useRef(null);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${params.id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  useEffect(() => {
    if (product && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }

      // Show success notification
      toast.success(
        <div>
          <p className="font-semibold">{product.title}</p>
          <p className="text-sm">Added {quantity} item(s) to cart</p>
        </div>,
        {
          icon: "🛒",
        }
      );

      // Reset quantity after adding
      setQuantity(1);
    }
  };

  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Maximum stock reached");
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">
            {error || "Product not found"}
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft size={20} />
        <span>Back to Products</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {product.category}
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{product.stock} in stock</span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold">
                Rp {(product.price * 15000).toLocaleString("id-ID")}
              </p>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-red-500 font-medium">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-b py-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Brand & Additional Info */}
          <div className="space-y-2 text-sm">
            {product.brand && (
              <div className="flex">
                <span className="text-gray-500 w-24">Brand:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex">
                <span className="text-gray-500 w-24">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={decreaseQty}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className="px-6 py-2 border-x font-medium">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Max: {product.stock}
              </span>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2"
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          {/* Additional Info */}
          {product.warrantyInformation && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Warranty:</span>{" "}
                {product.warrantyInformation}
              </p>
              {product.shippingInformation && (
                <p className="text-gray-600">
                  <span className="font-medium">Shipping:</span>{" "}
                  {product.shippingInformation}
                </p>
              )}
              {product.returnPolicy && (
                <p className="text-gray-600">
                  <span className="font-medium">Return Policy:</span>{" "}
                  {product.returnPolicy}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section (Optional) */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.reviewerName}</span>
                  <span className="text-yellow-500">★ {review.rating}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(review.date).toLocaleDateString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
