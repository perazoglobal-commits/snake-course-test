"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import UploadBox from "@/components/UploadBox";
import ResultViewer from "@/components/ResultViewer";
import LoadingState from "@/components/LoadingState";
import { useTryOn } from "@/hooks/useTryOn";

export default function Home() {
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { isLoading, resultUrl, error, generate, reset } = useTryOn();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (error) showToast(error);
  }, [error, showToast]);

  function handleReset() {
    reset();
    setPersonFile(null);
    setClothingFile(null);
  }

  async function handleGenerate() {
    if (!personFile || !clothingFile) return;
    await generate(personFile, clothingFile);
  }

  const canGenerate = !!personFile && !!clothingFile && !isLoading;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Virtual Try-On
          </h1>
          <p className="mt-2 text-gray-400 text-sm">
            Upload your photo and a clothing item — see how it looks on you instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Your Photo
                </p>
                <UploadBox
                  label="Upload Person"
                  sublabel="A full-body photo works best"
                  file={personFile}
                  onSelect={setPersonFile}
                  onError={showToast}
                  onClear={() => setPersonFile(null)}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Clothing Item
                </p>
                <UploadBox
                  label="Upload Clothing"
                  sublabel="Top, dress, jacket, etc."
                  file={clothingFile}
                  onSelect={setClothingFile}
                  onError={showToast}
                  onClear={() => setClothingFile(null)}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium py-3.5 rounded-full text-sm
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:bg-gray-800 active:scale-[0.98]
                transition-all duration-150"
            >
              <Sparkles size={16} />
              {isLoading ? "Generating…" : "Generate Try-On"}
            </button>

            {!personFile && !clothingFile && (
              <p className="text-center text-xs text-gray-400">
                Upload both images to enable generation
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Result
            </p>
            {isLoading ? (
              <LoadingState />
            ) : resultUrl ? (
              <ResultViewer url={resultUrl} onReset={handleReset} />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-[#E5E5E5] aspect-[3/4] flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Sparkles size={24} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  Your result will appear here
                </p>
                <p className="text-xs text-gray-300">
                  Generation takes ~20–30 seconds
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideUp">
          <div className="bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}

    </div>
  );
}
