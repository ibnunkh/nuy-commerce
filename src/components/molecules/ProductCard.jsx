"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`} scroll={true}>
      <div className="flex flex-col bg-background overflow-hidden group cursor-pointer">
        <div className="relative aspect-square bg-background overflow-hidden">
          <Image
            alt={product.title}
            src={product.thumbnail}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <p className="text-xs tracking-wide text-gray-500">
            {product.category}
          </p>
          <h3 className="text-sm text-primary line-clamp-2">{product.title}</h3>
        </div>

        <div className="mt-2">
          <p className="text-base font-medium text-primary">
            Rp {(product.price * 15000).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </Link>
  );
}
