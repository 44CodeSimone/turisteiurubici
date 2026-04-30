// Store de dados persistido em localStorage.
// Camada de abstração: trocar pela implementação Supabase no futuro
// sem alterar a API consumida pelas páginas/admin.

import { useEffect, useState, useSyncExternalStore } from "react";
import type { DataState } from "./types";
import { SEED } from "./seed";

const STORAGE_KEY = "turistei:data:v1";

// --- Subscriber pattern para re-render reativo ---
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// --- Estado em memória (singleton) ---
let memoryState: DataState = SEED;
let hydrated = false;

function loadFromStorage(): DataState {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as DataState;
    if (!parsed || parsed.version !== SEED.version) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

function saveToStorage(state: DataState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Erro ao salvar dados", e);
  }
}

function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  memoryState = loadFromStorage();
  emit();
}

// --- API pública ---
export function getState(): DataState {
  return memoryState;
}

export function setState(updater: (s: DataState) => DataState) {
  memoryState = updater(memoryState);
  saveToStorage(memoryState);
  emit();
}

export function resetData() {
  memoryState = SEED;
  saveToStorage(memoryState);
  emit();
}

// --- Hook React (com SSR-safe initial value) ---
const serverSnapshot = SEED;
export function useData(): DataState {
  // Hidrata na primeira renderização do cliente
  useEffect(() => {
    hydrateOnce();
  }, []);
  return useSyncExternalStore(subscribe, () => memoryState, () => serverSnapshot);
}

// Hook auxiliar: retorna se já hidratou (útil para evitar mismatch SSR)
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

// --- Utilitário ID ---
export function genId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
