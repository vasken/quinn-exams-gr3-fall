"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store. The server snapshot is `null`, so components
 * know they are hydrated once the value is non-null.
 */
export function createStore<T>(key: string, fallback: T) {
  let cache: T | null = null;
  const listeners = new Set<() => void>();

  function read(): T {
    if (cache !== null) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
    } catch {
      cache = fallback;
    }
    return cache as T;
  }

  function write(next: T) {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Private mode or storage full: keep the in-memory value.
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function useValue(): T | null {
    return useSyncExternalStore(subscribe, read, () => null);
  }

  return { read, write, useValue };
}
