export default function LoadingState() {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-[#E5E5E5] aspect-[3/4] flex flex-col">
      <div className="flex-1 animate-pulse bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_200%] animate-shimmer" />
      <div className="p-4 border-t border-[#E5E5E5] flex gap-3">
        <div className="h-9 flex-1 rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-9 w-20 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}
