"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fdf6f0] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl mb-6">🌸</div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          This page doesn't exist
        </h2>
        <p className="text-gray-400 leading-relaxed mb-8">
          It's okay to feel lost sometimes. Let's get you back to somewhere familiar.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-[#C084A0] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a8607f] transition"
          >
            Go back home
          </Link>
          <Link
            href="/dashboard"
            className="bg-white border border-gray-200 text-gray-600 font-medium px-8 py-3 rounded-full hover:bg-gray-50 transition text-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </main>
  );
}