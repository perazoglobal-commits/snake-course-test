import { createClient } from "@/lib/supabase/server";
import UserNav from "./UserNav";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName: string | null = user
    ? (user.user_metadata?.display_name ?? user.email ?? null)
    : null;

  return (
    <header className="border-b border-[#E5E5E5] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-semibold tracking-tight text-gray-900">
          AI Try-On
        </span>
        <nav className="flex items-center gap-6">
          {user && <UserNav displayName={displayName} />}
        </nav>
      </div>
    </header>
  );
}
