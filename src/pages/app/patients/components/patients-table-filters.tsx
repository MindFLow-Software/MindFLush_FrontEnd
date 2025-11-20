"use client"

import { useEffect } from "react"
import { UserRoundPlus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterPatients } from "./register-patients"


// Zod Schema (inalterado)
const patientsFilterSchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
  status: z.string().optional(),
})

type PatientsFilterSchema = z.infer<typeof patientsFilterSchema>

// Constantes para os status da Select
const PATIENT_STATUSES = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Em acompanhamento' },
  { value: 'scheduled', label: 'Sessão agendada' },
  { value: 'completed', label: 'Sessão concluída' },
  { value: 'paused', label: 'Em pausa' },
  { value: 'discharged', label: 'Alta terapêutica' },
]

export function PatientsTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get("name")
  const cpf = searchParams.get("cpf")
  const status = searchParams.get("status")

  const { register, control, watch } = useForm<PatientsFilterSchema>({
    resolver: zodResolver(patientsFilterSchema),
    defaultValues: {
      name: name ?? "",
      cpf: cpf ?? "",
      status: status ?? "all",
    },
  })

  // Observa as mudanças no formulário
  const filters = watch()

  // Lógica de Debounce e Envio Otimizada
  useEffect(() => {
    let shouldResetPage = false;

    const timeoutId = setTimeout(() => {
      setSearchParams((state) => {

        // --- 1. TRATAMENTO DO NOME E CPF ---
        const fieldsToProcess = [
          { key: 'name', value: filters.name ?? "" },
          { key: 'cpf', value: filters.cpf ?? "" },
        ] as const;

        for (const { key, value } of fieldsToProcess) {
          const currentValue = state.get(key) ?? "";

          const isValid = value.length > 0;

          if (isValid) {
            if (currentValue !== value) {
              state.set(key, value);
              shouldResetPage = true;
            }
          } else {
            if (currentValue !== "") {
              state.delete(key);
              shouldResetPage = true;
            }
          }
        }

        // --- 2. TRATAMENTO DO STATUS (Inalterado) ---
        const newStatus = filters.status ?? "all";
        const currentStatus = state.get("status") ?? "all";

        if (newStatus !== "all") {
          if (currentStatus !== newStatus) {
            state.set("status", newStatus);
            shouldResetPage = true;
          }
        } else {
          if (currentStatus !== "all") {
            state.delete("status");
            shouldResetPage = true;
          }
        }

        // --- 3. PAGINAÇÃO ---
        if (shouldResetPage) {
          state.set("pageIndex", "0");
        }

        return state;
      }, { replace: true });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, setSearchParams])

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <form className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
        <Input
          placeholder="Buscar por CPF"
          className="h-8 w-full lg:w-auto"
          {...register("cpf")}
        />

        <Input
          placeholder="Buscar por Nome"
          className="h-8 w-full lg:w-[320px]"
          {...register("name")}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { name, onChange, value, disabled } }) => {
            return (
              <Select
                defaultValue="all"
                name={name}
                onValueChange={onChange}
                value={value}
                disabled={disabled}
              >
                {/* SELECT: Corrigido para h-8 para alinhar com os inputs e o botão size="sm" */}
                <SelectTrigger className="h-8 w-full lg:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {PATIENT_STATUSES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }}
        />
      </form>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer">
            <UserRoundPlus className="h-4 w-4" />
            Cadastrar paciente
          </Button>
        </DialogTrigger>
        <RegisterPatients />
      </Dialog>
    </div>
  )
}