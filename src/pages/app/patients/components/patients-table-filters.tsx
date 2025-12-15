"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, UserRoundPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RegisterPatients } from "./register-patients"

const patientsFilterSchema = z.object({
  query: z.string().optional(),
  status: z.string().optional(),
})

type PatientsFilterSchema = z.infer<typeof patientsFilterSchema>

interface PatientsTableFiltersProps {
  onPatientRegistered?: () => void
}

export function PatientsTableFilters({ onPatientRegistered }: PatientsTableFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const name = searchParams.get("name")
  const cpf = searchParams.get("cpf")
  const status = searchParams.get("status")

  const { register, watch } = useForm<PatientsFilterSchema>({
    resolver: zodResolver(patientsFilterSchema),
    defaultValues: {
      query: name ?? cpf ?? "",
      status: status ?? "all",
    },
  })

  const watchedQuery = watch("query")
  const watchedStatus = watch("status")

  const applyFilters = useCallback(
    ({ query, status }: PatientsFilterSchema) => {
      setSearchParams((state) => {
        const newState = new URLSearchParams(state)

        // Lógica Unificada: Detecta se é CPF (números) ou Nome (texto)
        if (query) {
          if (/\d/.test(query)) {
            newState.set("cpf", query)
            newState.delete("name")
          } else {
            newState.set("name", query)
            newState.delete("cpf")
          }
        } else {
          newState.delete("name")
          newState.delete("cpf")
        }

        if (status && status !== "all") {
          newState.set("status", status)
        } else {
          newState.delete("status")
        }

        newState.set("page", "1")

        return newState
      })
    },
    [setSearchParams],
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      applyFilters({
        query: watchedQuery,
        status: watchedStatus ?? "all",
      })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedQuery, watchedStatus, applyFilters])

  const handlePatientSuccess = useCallback(() => {
    setIsRegisterOpen(false)
    onPatientRegistered?.()
  }, [onPatientRegistered])

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
        <div className="relative flex-1 lg:flex-initial">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input placeholder="Buscar por Nome ou CPF" className="h-8 w-full lg:w-[320px] pl-8" {...register("query")} />
        </div>
      </div>

      <div className="flex items-center">
        <Button size="sm" className="gap-2 w-full lg:w-auto shrink-0" onClick={() => setIsRegisterOpen(true)}>
          <UserRoundPlus className="h-4 w-4" />
          Cadastrar paciente
        </Button>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registar Paciente</DialogTitle>
              <DialogDescription>A funcionalidade de registo será implementada aqui.</DialogDescription>
            </DialogHeader>
            {isRegisterOpen && <RegisterPatients onSuccess={handlePatientSuccess} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
