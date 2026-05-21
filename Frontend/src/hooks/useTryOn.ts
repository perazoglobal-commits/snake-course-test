"use client";

import { useState, useRef } from "react";

const WEBHOOK_URL =
  "https://perazo.app.n8n.cloud/webhook/55c3f40e-551a-465d-b784-0f4c9036fe46";
const TIMEOUT_MS = 30_000;

interface TryOnState {
  isLoading: boolean;
  resultUrl: string | null;
  error: string | null;
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

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const msg =
          response.status === 500
            ? "AI processing error. Check your images."
            : "Server is busy. Please try again.";
        setState({ isLoading: false, resultUrl: null, error: msg });
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setState({ isLoading: false, resultUrl: url, error: null });
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort =
        err instanceof Error && err.name === "AbortError";
      setState({
        isLoading: false,
        resultUrl: null,
        error: isAbort
          ? "Server is busy. Please try again."
          : "An unexpected error occurred.",
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
