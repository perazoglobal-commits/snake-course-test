"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserNav({ displayName }: { displayName: string | null }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700 font-medium hidden sm:block">
        {displayName}
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Log out"
      >
        <LogOut size={15} />
        <span className="hidden sm:inline">Log out</span>
      </button>
    </div>
  );
}
