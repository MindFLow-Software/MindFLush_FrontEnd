"use client"

import { useState, useEffect } from "react"
import { Search, UserRoundPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { RegisterPatients } from "./register-patients"

// Schema atualizado para usar 'filter' genérico
const patientsFilterSchema = z.object({
  filter: z.string().optional(),
  status: z.string().optional(),
})

type PatientsFilterSchema = z.infer<typeof patientsFilterSchema>

interface PatientsTableFiltersProps {
  onPatientRegistered?: () => void
}

export function PatientsTableFilters({ onPatientRegistered }: PatientsTableFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  // Recupera o filtro único da URL (ou falback para legados name/cpf para preencher o input inicial)
  const filter =
    searchParams.get("filter") ??
    searchParams.get("name") ??
    searchParams.get("cpf")

  const status = searchParams.get("status")

  const { register, watch } = useForm<PatientsFilterSchema>({
    resolver: zodResolver(patientsFilterSchema),
    defaultValues: {
      filter: filter ?? "",
      status: status ?? "all",
    },
  })

  // Monitora a digitação no campo único
  const watchedFilter = watch("filter")

  function applyFilters({ filter, status }: PatientsFilterSchema) {
    setSearchParams((state) => {
      // 1. Aplica o filtro genérico
      if (filter) {
        state.set("filter", filter)
      } else {
        state.delete("filter")
      }

      // 2. Remove parâmetros antigos para limpar a URL
      state.delete("name")
      state.delete("cpf")

      // 3. Aplica status (exceção mantida)
      if (status && status !== "all") {
        state.set("status", status)
      } else {
        state.delete("status")
      }

      // 4. Reseta para a primeira página ao filtrar
      state.set("page", "1")

      return state
    })
  }

  // Debounce para evitar requisições a cada tecla
  useEffect(() => {
    const timeout = setTimeout(() => {
      applyFilters({
        filter: watchedFilter,
        status: status ?? "all",
      })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedFilter])

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
        {/* Input Único com Ícone de Busca */}
        <div className="relative w-full lg:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por CPF, Nome e Email"
            className="h-8 w-full lg:w-[320px] pl-9"
            {...register("filter")}
          />
        </div>
      </div>

      {/* Botão de cadastro */}
      <div className="flex items-center">
        <Button
          size="sm"
          className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer hover:bg-blue-700"
          onClick={() => setIsRegisterOpen(true)}
        >
          <UserRoundPlus className="h-4 w-4" />
          Cadastrar paciente
        </Button>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          {isRegisterOpen && (
            <RegisterPatients onSuccess={() => {
              setIsRegisterOpen(false)
              onPatientRegistered?.()
            }} />
          )}
        </Dialog>
      </div>
    </div>
  )
}