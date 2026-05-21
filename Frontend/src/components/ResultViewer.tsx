"use client";

import { Download, RotateCcw } from "lucide-react";

interface ResultViewerProps {
  url: string;
  onReset: () => void;
}

export default function ResultViewer({ url, onReset }: ResultViewerProps) {
  function handleDownload() {
    const a = document.createElement("a");
    a.href = url;
    a.download = "tryon-result.jpg";
    a.click();
  }

  return (
    <div className="rounded-xl overflow-hidden bg-white border border-[#E5E5E5] aspect-[3/4] flex flex-col group">
      <div className="flex-1 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Try-on result"
          className="w-full h-full object-cover animate-fadeIn"
        />
      </div>
      <div className="p-4 border-t border-[#E5E5E5] flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Download size={15} />
          Download
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 border border-[#E5E5E5] text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </div>
  );
}
