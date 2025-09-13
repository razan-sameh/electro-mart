// app/components/Hero.tsx
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-start bg-gray-100">
      {/* Background Image */}
      <Image
        src="/hero-bg.png" // replace with your image in /public
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6 md:pl-16 text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Introducing the <br /> Next Generation of Sound
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          Experience pure, immersive sound like never before
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition">
          Discover more
        </button>
      </div>
    </section>
  );
}
