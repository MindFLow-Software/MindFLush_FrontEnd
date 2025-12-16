import { useSearchParams } from "react-router-dom"
import { z } from "zod"

export function usePatientFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get("page") ?? "1"

  const pageIndex = z.coerce
    .number()
    .transform((val) => val - 1)
    .parse(page)

  // 🔹 CORREÇÃO: Leitura do filtro unificado com fallback para legados name/cpf
  const filter =
    searchParams.get("filter") ??
    searchParams.get("name") ??
    searchParams.get("cpf")

  // O objeto 'filters' agora retorna 'filter'.
  const filters = {
    pageIndex: Math.max(0, pageIndex),
    perPage: Number(searchParams.get("perPage") ?? "10"),
    filter: filter,
    status: searchParams.get("status"),
  }

  function setPage(pageIndex: number) {
    setSearchParams((state) => {
      state.delete("pageIndex")
      state.set("page", (pageIndex + 1).toString())
      return state
    })
  }

  function setFilters(newFilters: Partial<typeof filters>) {
    setSearchParams((state) => {
      state.delete("pageIndex")

      // Limpa espaços em branco extras do filtro (ex: ' nome ' -> 'nome')
      const trimmedFilter = newFilters.filter?.trim()

      // Lógica de escrita: Prioriza 'filter' e limpa os antigos
      if (trimmedFilter) { // Usa o filtro limpo
        state.set("filter", trimmedFilter)
      } else {
        state.delete("filter")
      }

      state.delete("name")
      state.delete("cpf")

      if (newFilters.status) {
        state.set("status", newFilters.status)
      } else {
        state.delete("status")
      }

      state.set("page", "1")

      return state
    })
  }

  function clearFilters() {
    setSearchParams((state) => {
      state.delete("filter")
      state.delete("name")
      state.delete("cpf")
      state.delete("status")
      state.delete("pageIndex")
      state.set("page", "1")
      return state
    })
  }

  return { filters, setPage, setFilters, clearFilters }
}