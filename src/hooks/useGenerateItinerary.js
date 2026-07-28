/**
 * useGenerateItinerary.js
 * Hook that manages itinerary generation with:
 * - AbortController to cancel in-flight requests when a new one starts
 * - requestIdRef to prevent stale responses from overwriting newer ones
 * - Full status lifecycle: idle | loading | success | error
 */

import { useState, useRef, useCallback } from 'react';
import { validateItinerary } from '../utils/validateItinerary';

export function useGenerateItinerary() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  // Track the latest request ID — any response with a stale ID is discarded
  const requestIdRef = useRef(0);
  // Hold the AbortController so we can cancel the previous fetch
  const abortControllerRef = useRef(null);

  const generate = useCallback(async (text) => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Increment request ID — this is the "expected" ID for this call
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('loading');
    setError(null);
    setItinerary(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      // ── Stale response check ────────────────────────────────────────────────
      // If a newer request was already launched, discard this response
      if (requestId !== requestIdRef.current) return;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // ── Stale check again after async body read ─────────────────────────────
      if (requestId !== requestIdRef.current) return;

      // ── Client-side validation (second safety net) ──────────────────────────
      const { valid, itinerary: validatedItinerary, errors } = validateItinerary(data);

      if (!valid) {
        throw new Error(
          errors.length > 0
            ? errors[0]
            : 'The AI response could not be parsed into a valid itinerary.'
        );
      }

      setItinerary(validatedItinerary);
      setStatus('success');
    } catch (err) {
      // Ignore AbortError — it means a newer request took over
      if (err.name === 'AbortError') return;

      // Only update error state if this is still the latest request
      if (requestId !== requestIdRef.current) return;

      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    // Abort any in-flight request when resetting
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    requestIdRef.current++;
    setStatus('idle');
    setItinerary(null);
    setError(null);
  }, []);

  return { status, itinerary, error, generate, reset };
}
