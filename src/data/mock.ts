// Wrapper de compatibilidade — re-exporta tipos e funções do repo.
// As páginas devem migrar para useData() (reatividade) ou repo.ts (server snapshot).
export type { Local, Categoria, Plano } from "./types";
export type { CategoriaItem as CategoriaInfo } from "./types";

import type { CategoriaItem, Local } from "./types";
import {
  listCategoriasAtivas,
  listLocais,
  listLocaisDestaque,
  listLocaisPorCategoria,
  getLocalPorSlug,
  getCategoria,
} from "./repo";

// Snapshot helpers (compatibilidade com código que esperava arrays).
export const categorias: CategoriaItem[] = listCategoriasAtivas();
export const locais: Local[] = listLocais();

export const getLocaisDestaque = listLocaisDestaque;
export const getLocaisPorCategoria = listLocaisPorCategoria;
export { getLocalPorSlug, getCategoria };
