"use client";

import { Trash2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export default function Cart() {
  const cartItems = useCartStore((state) => state.cartItems);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalPrice = getTotalPrice();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {cartItems.length === 0 ? (
        <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center rounded-lg">
          <h2 className="text-2xl md:text-4xl font-poppins">
            Keranjang Anda Kosong
          </h2>
          <p className="text-foreground mt-1">
            Tidak ada produk dalam keranjang Anda
          </p>
          <Link href="/" className="mt-3">
            <Button>Lanjutkan Belanja</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-4xl">Keranjang Anda</h1>
            <Link
              href="/"
              className="text-sm md:text-md underline underline-offset-4"
            >
              Lanjutkan Belanja
            </Link>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-6 bg-secondary">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-32 h-32 rounded">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="leading-tight">{item.title}</h3>
                    <p>Rp{(item.price * 15000).toLocaleString("id-ID")}</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-2 text-lg"
                      >
                        -
                      </button>
                      <span className="px-4">{item.qty}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-3 py-2 text-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-primary flex justify-center"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="md:text-right min-w-35">
                      <p className="text-lg font-medium">
                        Rp{" "}
                        {(item.price * item.qty * 15000).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xl font-medium">Total</p>
              <p className="text-2xl font-semibold">
                Rp {(totalPrice * 15000).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="flex justify-end">
              <Button>Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
