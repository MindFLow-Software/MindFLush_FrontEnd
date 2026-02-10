import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import {
    Activity, DollarSign, ShieldCheck, Lock, FileSearch,
    AlertCircle, Loader2,
    MoveLeft, Plus, Download
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { getPatientDetails } from "@/api/get-patient-details"
import { PatientDetailsHeader } from "./components/patient-details-header"
import { useHeaderStore } from "@/hooks/use-header-store"
import { MetricCard } from "./components/metric-card"
import { PatientInfo } from "./components/patient-Info"
import { PatientSessionsTimeline } from "./components/patient-sessions-timeline"

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { setTitle, setSubtitle } = useHeaderStore()

    const [pageIndex, setPageIndex] = useState(0)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["patient-details", id, pageIndex],
        queryFn: () => getPatientDetails(id!, pageIndex),
        enabled: !!id,
    })

    useEffect(() => {
        setTitle("Cadastro de Pacientes")

        if (data?.patient) {
            const name = `${data.patient.firstName} ${data.patient.lastName}`
            setSubtitle(name)
        }

        return () => setSubtitle(undefined)
    }, [data, setTitle, setSubtitle])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (isError || !data?.patient) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive/50" />
                <div>
                    <h2 className="text-lg font-semibold">Paciente não encontrado</h2>
                    <p className="text-muted-foreground text-sm">Verifique o ID ou tente novamente mais tarde.</p>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>Voltar para tabela</Button>
            </div>
        )
    }

    const { patient, meta } = data

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                >
                    <MoveLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-medium uppercase tracking-wider">Voltar para listagem</span>
                </button>

                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="gap-2 flex-1 md:flex-none">
                        <Download className="size-4" /> Exportar PDF
                    </Button>
                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none">
                        <Plus className="size-4" /> Nova Sessão
                    </Button>
                </div>
            </div>

            <PatientDetailsHeader patient={patient} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="Sessões Totais"
                    value={meta.totalCount}
                    subLabel="Duração média"
                    subValue={meta.averageDuration}
                    icon={Activity}
                />

                <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-emerald-50/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2 font-bold">
                            <DollarSign className="h-3 w-3" /> Financeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-emerald-600">R$ --</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Status: Regularizado</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-amber-500 bg-amber-50/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2 font-bold">
                            <ShieldCheck className="h-3 w-3" /> Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-semibold text-amber-700 uppercase tracking-tighter">Dados Criptografados</p>
                            <p className="text-[10px] text-muted-foreground">Conformidade LGPD ativa</p>
                        </div>
                        <Lock className="h-5 w-5 text-amber-500 opacity-30" />
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="clinical" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-xl w-fit">
                    <TabsTrigger value="clinical" className="rounded-lg px-8">Prontuário</TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-lg px-8">Timeline</TabsTrigger>
                    <TabsTrigger value="docs" className="rounded-lg px-8">Arquivos</TabsTrigger>
                </TabsList>

                <TabsContent value="clinical" className="mt-6">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="p-0">
                            <PatientInfo patient={patient} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6 space-y-6">
                    <PatientSessionsTimeline
                        sessions={patient.sessions}
                        meta={meta}
                        pageIndex={pageIndex}
                        onPageChange={setPageIndex}
                    />
                </TabsContent>

                <TabsContent value="docs" className="mt-6">
                    <div className="flex flex-col items-center py-24 text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
                        <FileSearch className="h-10 w-10 opacity-20 mb-3" />
                        <p className="text-sm font-semibold">Repositório de Documentos</p>
                        <p className="text-xs">Upload de exames e laudos em breve.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}