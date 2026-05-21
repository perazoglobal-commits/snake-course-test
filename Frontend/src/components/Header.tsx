export default function Header() {
  return (
    <header className="border-b border-[#E5E5E5] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-semibold tracking-tight text-gray-900">
          AI Try-On
        </span>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
          <span className="hover:text-gray-900 cursor-pointer transition-colors">
            How it works
          </span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">
            About
          </span>
        </nav>
      </div>
    </header>
  );
}
