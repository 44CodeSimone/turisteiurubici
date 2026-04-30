// Wrapper de compatibilidade com a API anterior do mock.
// Mantém imports existentes funcionando enquanto migramos para repo.ts.

export type { Local, Categoria, Plano, CategoriaItem as CategoriaInfo } from "./types";

import {
  listCategoriasAtivas,
  listLocais,
  listLocaisDestaque,
  listLocaisPorCategoria,
  getLocalPorSlug,
  getCategoria,
} from "./repo";

// Estes "getters" são funções para ser sempre frescas (lidas do store).
export const categorias = new Proxy([] as any, {
  get(_t, prop) {
    const arr = listCategoriasAtivas();
    return (arr as any)[prop];
  },
});

export const locais = new Proxy([] as any, {
  get(_t, prop) {
    const arr = listLocais();
    return (arr as any)[prop];
  },
});

export const getLocaisDestaque = listLocaisDestaque;
export const getLocaisPorCategoria = listLocaisPorCategoria;
export { getLocalPorSlug, getCategoria };
