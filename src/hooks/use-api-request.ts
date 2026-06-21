"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiErrorResponse } from "@/lib/schemas";

export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiErrorResponse };

const fallbackError: ApiErrorResponse = {
  code: "UPSTREAM_ERROR",
  message: "응답을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
};

export function useApiRequest<TRequest, TResponse>(endpoint: string) {
  const [state, setState] = useState<RequestState<TResponse>>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const run = useCallback(
    async (payload: TRequest) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setState({ status: "loading" });

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const body: unknown = await response.json();
        if (!response.ok) {
          const error = body as Partial<ApiErrorResponse>;
          setState({
            status: "error",
            error: {
              code: error.code ?? fallbackError.code,
              message: error.message ?? fallbackError.message,
            },
          });
          return;
        }

        setState({ status: "success", data: body as TResponse });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error", error: fallbackError });
      }
    },
    [endpoint],
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState({ status: "idle" });
  }, []);

  return { state, run, reset };
}
