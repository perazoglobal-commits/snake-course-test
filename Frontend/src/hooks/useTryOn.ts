"use client";

import { useState, useRef } from "react";

const API_ROUTE = "/api/tryon";
const TIMEOUT_MS = 35_000; // slightly longer than server's 30s so server error wins

interface TryOnState {
  isLoading: boolean;
  resultUrl: string | null;
  error: string | null;
}

function errorFromStatus(status: number): string {
  if (status === 400) return "Invalid images. Check format and size.";
  if (status === 502 || status === 500) return "AI processing error. Check your images.";
  if (status === 503) return "Server is busy. Please try again.";
  if (status === 504) return "Server is busy. Please try again.";
  return "An unexpected error occurred.";
}

export function useTryOn() {
  const [state, setState] = useState<TryOnState>({
    isLoading: false,
    resultUrl: null,
    error: null,
  });
  const resultUrlRef = useRef<string | null>(null);

  async function generate(personFile: File, clothingFile: File) {
    setState({ isLoading: true, resultUrl: null, error: null });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const formData = new FormData();
      formData.append("person_image", personFile);
      formData.append("clothing_image", clothingFile);

      const response = await fetch(API_ROUTE, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        setState({ isLoading: false, resultUrl: null, error: errorFromStatus(response.status) });
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setState({ isLoading: false, resultUrl: url, error: null });
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof Error && err.name === "AbortError";
      setState({
        isLoading: false,
        resultUrl: null,
        error: isAbort ? "Server is busy. Please try again." : "An unexpected error occurred.",
      });
    }
  }

  function reset() {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setState({ isLoading: false, resultUrl: null, error: null });
  }

  return { ...state, generate, reset };
}
