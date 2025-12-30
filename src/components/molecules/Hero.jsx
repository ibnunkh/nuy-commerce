"use client";

import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full h-125 md:h-150 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2070&auto=format&fit=crop"
          alt="Shopping cart background"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="font-poppins text-4xl leading-tight md:text-6xl font-bold text-white mb-4">
          Selamat Datang di NuyCommerce
        </h1>
        <p className="text-md md:text-xl text-white mb-8 max-w-2xl">
          Temukan produk terbaik dengan harga terjangkau. Belanja mudah, cepat,
          dan aman.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
