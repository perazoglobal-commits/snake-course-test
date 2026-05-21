"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout", { method: "POST" });
    if (!res.ok) {
      setError("Failed to start checkout. Please try again.");
      setLoading(false);
      return;
    }

    const { url } = await res.json();
    if (url) {
      window.location.href = url;
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-semibold tracking-tight text-gray-900">
            AI Try-On
          </span>
          <p className="mt-1 text-sm text-gray-400">Get access</p>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8">
          <div className="text-center mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              AI Virtual Try-On Access
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-gray-900">¥1,000</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">One-time payment · Lifetime access</p>
          </div>

          <ul className="space-y-2.5 mb-6">
            {[
              "Upload any outfit photo",
              "AI-powered virtual try-on",
              "Download your results",
              "Unlimited generations",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-900 font-medium">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          {error && <p className="text-xs text-red-500 mb-4 text-center">{error}</p>}

          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full flex items-center justify-center bg-black text-white font-medium py-3.5 rounded-full text-sm
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-800 active:scale-[0.98] transition-all duration-150"
          >
            {loading ? "Redirecting to checkout…" : "Buy Access · ¥1,000"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Wrong account?{" "}
          <button
            onClick={handleSignOut}
            className="text-gray-900 underline underline-offset-2"
          >
            Sign out
          </button>
        </p>
      </div>
    </div>
  );
}
