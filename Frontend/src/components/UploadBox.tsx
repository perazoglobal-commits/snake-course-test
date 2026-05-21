"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface UploadBoxProps {
  label: string;
  sublabel: string;
  file: File | null;
  onSelect: (file: File) => void;
  onError: (msg: string) => void;
  onClear: () => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Unsupported format. Use JPEG, PNG, or WEBP.";
  if (file.size > MAX_BYTES) return "File too large. Max 5MB.";
  return null;
}

export default function UploadBox({
  label,
  sublabel,
  file,
  onSelect,
  onError,
  onClear,
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previewUrl = file ? URL.createObjectURL(file) : null;

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const f = files[0];
    const err = validateFile(f);
    if (err) {
      onError(err);
      return;
    }
    onSelect(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      className={`relative rounded-xl border-2 transition-all duration-200 bg-white overflow-hidden
        ${isDragging ? "border-black scale-[1.01]" : "border-[#E5E5E5] hover:border-gray-300 hover:scale-[1.01]"}
        ${file ? "aspect-[3/4]" : "aspect-[3/4]"}
        cursor-pointer group`}
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {file && previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <p className="text-white text-xs font-medium truncate">{file.name}</p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <Upload size={20} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sublabel}</p>
          </div>
          <p className="text-[11px] text-gray-300">JPEG · PNG · WEBP · max 5MB</p>
        </div>
      )}
    </div>
  );
}
