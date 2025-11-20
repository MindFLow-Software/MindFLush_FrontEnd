"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { Pagination } from "@/components/pagination"
import { PatientsTableFilters } from "./components/patients-table-filters"
import { PatientsTable } from "./components/patients-table-row"
import { getPatients, type GetPatientsResponse } from "@/api/get-patients"

const DESKTOP_BREAKPOINT = 1024 // Ponto de corte para tela grande (ex: lg)

export function PatientsList() {
    const [searchParams, setSearchParams] = useSearchParams()

    // 1. Estado para quantidade de itens por página
    const [itemsPerPage, setItemsPerPage] = useState(10) 

    // 2. Efeito para detectar o tamanho da tela
    useEffect(() => {
        const checkScreenSize = () => {
            const newPerPage = window.innerWidth >= DESKTOP_BREAKPOINT ? 15 : 10;
            
            if (newPerPage !== itemsPerPage) {
                setItemsPerPage(newPerPage);
                
                // Opcional: Resetar a página para 0 ao mudar o perPage
                setSearchParams(state => {
                    state.set('pageIndex', '0');
                    return state;
                }, { replace: true });
            }
        };

        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();

        return () => window.removeEventListener('resize', checkScreenSize);
    }, [itemsPerPage, setSearchParams]);

    const pageIndex = Number(searchParams.get('pageIndex') ?? 0)
    const perPage = itemsPerPage; 
    
    // Leitura dos filtros
    const name = searchParams.get('name')
    const cpf = searchParams.get('cpf')
    const status = searchParams.get('status')

    const { data: result, isLoading, isError } = useQuery<GetPatientsResponse>({
        // Inclui perPage na queryKey para forçar re-fetch quando o tamanho da tela muda
        queryKey: ["patients", pageIndex, perPage, name, cpf, status],
        queryFn: () => getPatients({
            pageIndex,
            perPage,
            name,
            cpf,
            status,
        }),
        staleTime: 1000 * 60 * 5,
    })

    const patients = result?.patients ?? []
    // Usamos o perPage atualizado no meta fallback
    const meta = result?.meta ?? { pageIndex: 0, perPage: perPage, totalCount: 0 } 

    const handlePaginate = (newPageIndex: number) => {
        setSearchParams((state) => {
            state.set('pageIndex', String(newPageIndex))
            return state
        })
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 font-medium">Erro ao carregar pacientes 😕</p>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Cadastro de Pacientes" />

            <div className="flex flex-col gap-4 mt-6">

                <div className="space-y-2.5">
                    <PatientsTableFilters />

                    <PatientsTable
                        patients={patients}
                        isLoading={isLoading}
                        perPage={perPage} // ✅ Passa o perPage atualizado para a tabela
                    />

                    {result && (
                        <Pagination
                            pageIndex={meta.pageIndex}
                            totalCount={meta.totalCount}
                            perPage={meta.perPage}
                            onPageChange={handlePaginate}
                        />
                    )}
                </div>
            </div>
        </>
    )
}